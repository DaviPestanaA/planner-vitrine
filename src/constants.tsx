
import { 
  Client, 
  ContentCard 
} from './src/types';

export const STATUS_COLORS: Record<string, string> = {
  'A Fazer': 'border-l-slate-300 bg-white text-slate-700',
  'Em Andamento': 'border-l-blue-400 bg-blue-50/30 text-slate-700',
  'Check': 'border-l-emerald-500 bg-emerald-50/20 text-slate-700',
  'default': 'border-l-slate-200 bg-white text-slate-700'
};

export const TYPE_ICONS: Record<string, string> = {
  'Reels': '🎬',
  'Carrossel': '🎠',
  'Story': '📱',
  'Live': '🔴',
  'Post': '🖼️',
  'Shorts': '⚡',
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    nome: 'Agência Digital Lux',
    instagram: '@lux.agencia',
    nicho: 'Moda e Estética',
    tomDeVoz: 'Inspirador e elegante',
    objetivos: 'Aumento de autoridade',
    observacoes: 'Focar em cores neutras.',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_CARDS: ContentCard[] = [
  {
    id: 'card-1',
    clientId: 'client-1',
    dateISO: new Date().toISOString().split('T')[0],
    titulo: 'Reels: Tendências Outono 2024',
    tipo: 'Reels',
    pilar: 'Educação',
    status: 'A Fazer',
    copy: 'Focar na escassez das cores neutras...',
    legenda: 'As 3 cores que vão dominar o armário este ano! 🍂',
    notas: 'Usar áudio de Jazz moderno.',
    links: [],
    checklist: [],
    tags: ['#moda'],
    isFavorite: true
  }
];
