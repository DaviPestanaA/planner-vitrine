
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ContentLink {
  id: string;
  label: string;
  url: string;
}

export interface ContentCard {
  id: string;
  clientId: string;
  dateISO: string; 
  timeOpcional?: string;
  titulo: string;
  tipo: string; 
  pilar: string; 
  status: 'A Fazer' | 'Em Andamento' | 'Check' | string; 
  copy: string;
  legenda: string;
  notas: string;
  links: ContentLink[];
  checklist: ChecklistItem[];
  tags: string[];
  responsavel?: string;
  isBacklog?: boolean;
  isFavorite?: boolean;
}

export interface Client {
  id: string;
  nome: string;
  instagram: string;
  nicho: string;
  tomDeVoz: string;
  objetivos: string;
  observacoes: string;
  createdAt: string;
}

export interface DailyNote {
  clientId: string;
  dateISO: string;
  notes: string;
}

export interface AppState {
  clients: Client[];
  cards: ContentCard[];
  dailyNotes: DailyNote[];
}
