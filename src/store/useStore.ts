import { useState, useEffect, useRef } from 'react';
import type { AppState, Client, ContentCard } from '../types';
import { supabase } from '../services/supabaseClient';

const STORAGE_KEY = 'planner_vitrine_v1';

interface StoreState extends AppState {
  currentClientId: string | null;
  isLoading: boolean;
}

interface Actions {
  setCurrentClientId: (id: string | null) => void;
  loadInitialData: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<Client | null>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addCard: (card: Partial<ContentCard>) => Promise<ContentCard | null>;
  updateCard: (id: string, updates: Partial<ContentCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  duplicateCard: (id: string) => Promise<void>;
}

export type FullStore = StoreState & Actions;

/**
 * ✅ Cache local (fallback)
 */
const getSavedState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler cache local', e);
  }
  return { clients: [], cards: [], dailyNotes: [] };
};

const initialState = getSavedState();

let globalState: StoreState = {
  ...initialState,
  currentClientId: null,
  isLoading: false,
};

const listeners = new Set<() => void>();

const persistLocal = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      clients: globalState.clients,
      cards: globalState.cards,
      dailyNotes: globalState.dailyNotes,
    })
  );
};

const updateState = (
  updater: Partial<StoreState> | ((prev: StoreState) => Partial<StoreState>)
) => {
  const patch = typeof updater === 'function' ? updater(globalState) : updater;
  globalState = { ...globalState, ...patch };
  persistLocal();
  listeners.forEach((l) => l());
};

const uuid = () => {
  // browser moderno
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  // fallback simples (último caso)
  return `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * ✅ Mapeadores DB <-> App
 * DB (clients): id (uuid), name (text), created_at (timestamp)
 * App (Client): id, name, createdAt
 */
const dbClientToApp = (row: any): Client => ({
  id: row.id,
  // se seu type usar "name", mantém; se usar "nome", ajuste aqui
  name: row.name ?? row.nome ?? '',
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
});

const appClientToDbInsert = (client: Omit<Client, 'id' | 'createdAt'>) => ({
  name: (client as any).name ?? (client as any).nome ?? '',
});

const appClientToDbUpdate = (updates: Partial<Client>) => {
  const payload: any = { ...updates };

  // Normaliza nome
  if ('nome' in payload && !('name' in payload)) payload.name = payload.nome;
  delete payload.nome;

  // Nunca tenta atualizar createdAt direto (DB usa created_at)
  delete payload.createdAt;
  delete payload.created_at;

  return payload;
};

/**
 * DB (cards) pelo seu print:
 * id (uuid), title (text), client_id (uuid), created_at (timestamp)
 * App (ContentCard) tem muito mais campos — vamos salvar no DB só o que existe,
 * e manter o resto no localStorage (sem quebrar).
 */
const dbCardToApp = (row: any): ContentCard => ({
  id: row.id,
  clientId: row.client_id ?? row.clientId ?? '',
  dateISO: row.dateISO ?? '',

  // seu app usa titulo; no DB é title
  titulo: row.titulo ?? row.title ?? 'Novo Post',

  tipo: row.tipo ?? 'Post',
  pilar: row.pilar ?? 'Geral',
  status: row.status ?? 'A Fazer',

  copy: row.copy ?? '',
  legenda: row.legenda ?? '',
  notas: row.notas ?? '',

  links: row.links ?? [],
  checklist: row.checklist ?? [],
  tags: row.tags ?? [],

  isBacklog: !!row.isBacklog,
  isFavorite: !!row.isFavorite,
});

const appCardToDbInsert = (card: ContentCard) => ({
  // No DB: title / client_id
  title: card.titulo ?? 'Novo Post',
  client_id: card.clientId,
});

const appCardToDbUpdate = (updates: Partial<ContentCard>) => {
  const payload: any = {};

  // Só atualiza colunas que sabemos que existem
  if (typeof updates.titulo === 'string') payload.title = updates.titulo;
  if (typeof updates.clientId === 'string') payload.client_id = updates.clientId;

  return payload;
};

const actions: Actions = {
  setCurrentClientId: (id) => {
    updateState({ currentClientId: typeof id === 'string' ? id : null });
  },

  loadInitialData: async () => {
    if (!supabase) {
      console.warn('Supabase não configurado. Operando apenas em modo local.');
      return;
    }

    updateState({ isLoading: true });

    try {
      // ✅ order correto: 'name' (não 'nome')
      const { data: clientsRaw, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      const { data: cardsRaw, error: cardError } = await supabase.from('cards').select('*');

      if (clientError) console.error('Supabase clients error:', clientError);
      if (cardError) console.error('Supabase cards error:', cardError);

      // Se qualquer um falhar, não derruba o app: mantém local
      if (clientError || cardError) throw new Error('Falha na sincronização');

      updateState({
        clients: (clientsRaw ?? []).map(dbClientToApp),
        cards: (cardsRaw ?? []).map(dbCardToApp),
        isLoading: false,
      });
    } catch (e) {
      console.error('Erro ao carregar dados do Supabase, mantendo dados locais.', e);
      updateState({ isLoading: false });
    }
  },

  addClient: async (clientData) => {
    // cria um client local imediato (UX)
    const tempClient: Client = {
      ...(clientData as any),
      id: uuid(),
      createdAt: new Date().toISOString(),
    };

    updateState((prev) => ({ clients: [...prev.clients, tempClient] }));

    if (!supabase) return tempClient;

    // ✅ deixa o Supabase criar o UUID e created_at
    const { data, error } = await supabase
      .from('clients')
      .insert(appClientToDbInsert(clientData))
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao persistir no Supabase (clients):', error);
      return tempClient; // mantém ao menos local
    }

    const saved = dbClientToApp(data);

    // substitui o temp pelo salvo real
    updateState((prev) => ({
      clients: prev.clients.map((c) => (c.id === tempClient.id ? saved : c)),
    }));

    return saved;
  },

  updateClient: async (id, updates) => {
    updateState((prev) => ({
      clients: prev.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    if (!supabase) return;

    const { error } = await supabase.from('clients').update(appClientToDbUpdate(updates)).eq('id', id);

    if (error) console.error('Erro ao atualizar no Supabase (clients):', error);
  },

  deleteClient: async (id) => {
    updateState((prev) => ({
      clients: prev.clients.filter((c) => c.id !== id),
      cards: prev.cards.filter((c) => c.clientId !== id),
      currentClientId: prev.currentClientId === id ? null : prev.currentClientId,
    }));

    if (!supabase) return;

    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) console.error('Erro ao deletar no Supabase (clients):', error);
  },

  addCard: async (cardData) => {
    const newCard: ContentCard = {
      id: uuid(),
      clientId: cardData.clientId || '',
      dateISO: cardData.dateISO || '',
      titulo: cardData.titulo || 'Novo Post',
      tipo: cardData.tipo || 'Post',
      pilar: cardData.pilar || 'Geral',
      status: cardData.status || 'A Fazer',
      copy: '',
      legenda: '',
      notas: '',
      links: [],
      checklist: [],
      tags: [],
      isBacklog: !!cardData.isBacklog,
      isFavorite: false,
      ...cardData,
    };

    updateState((prev) => ({ cards: [...prev.cards, newCard] }));

    if (!supabase) return newCard;

    // ✅ salva no DB só (title, client_id)
    if (!newCard.clientId) {
      // sem clientId não dá pra persistir card no seu schema atual
      return newCard;
    }

    const { data, error } = await supabase
      .from('cards')
      .insert(appCardToDbInsert(newCard))
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao persistir no Supabase (cards):', error);
      return newCard;
    }

    const saved = dbCardToApp(data);

    // substitui o temp pelo salvo real (id uuid do supabase)
    updateState((prev) => ({
      cards: prev.cards.map((c) => (c.id === newCard.id ? { ...c, id: saved.id } : c)),
    }));

    return { ...newCard, id: saved.id };
  },

  updateCard: async (id, updates) => {
    updateState((prev) => ({
      cards: prev.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    if (!supabase) return;

    const payload = appCardToDbUpdate(updates);
    // se não tem nada pra atualizar no DB, não faz request
    if (Object.keys(payload).length === 0) return;

    const { error } = await supabase.from('cards').update(payload).eq('id', id);
    if (error) console.error('Erro ao atualizar no Supabase (cards):', error);
  },

  deleteCard: async (id) => {
    updateState((prev) => ({ cards: prev.cards.filter((c) => c.id !== id) }));

    if (!supabase) return;

    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (error) console.error('Erro ao deletar no Supabase (cards):', error);
  },

  duplicateCard: async (id) => {
    const card = globalState.cards.find((c) => c.id === id);
    if (!card) return;

    const newCard: ContentCard = {
      ...card,
      id: uuid(),
      titulo: `${card.titulo} (Cópia)`,
    };

    updateState((prev) => ({ cards: [...prev.cards, newCard] }));

    if (!supabase) return;

    if (!newCard.clientId) return;

    const { error } = await supabase.from('cards').insert(appCardToDbInsert(newCard));
    if (error) console.error('Erro ao duplicar no Supabase (cards):', error);
  },
};

export const useStore = <T,>(selector: (state: FullStore) => T): T => {
  const [, forceUpdate] = useState({});
  const selectorRef = useRef(selector);
  const lastValueRef = useRef<T>(selector({ ...globalState, ...actions }));

  useEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    const listener = () => {
      const nextValue = selectorRef.current({ ...globalState, ...actions });
      if (nextValue !== lastValueRef.current) {
        lastValueRef.current = nextValue;
        forceUpdate({});
      }
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return lastValueRef.current;
};
