
import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ContentCard, Client } from '../types';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, StarIcon } from './Icons';
import { STATUS_COLORS, TYPE_ICONS } from '../constants';

interface WorkspaceProps {
  client: Client;
  cards: ContentCard[];
  onAddCard: (cardData: Partial<ContentCard>) => void;
  onUpdateCard: (id: string, updates: Partial<ContentCard>) => void;
  onEditCard: (card: ContentCard) => void;
  onDeleteCard: (id: string) => void;
}

interface ContentCardComponentProps {
  card: ContentCard;
  onEditCard: (card: ContentCard) => void;
  onUpdateCard: (id: string, updates: any) => void;
  onDeleteCard: (id: string) => void;
}

/**
 * Componente de Card Compacto para a Visão Mensal
 */
const MonthlyCardComponent: React.FC<ContentCardComponentProps> = ({ 
  card, 
  onEditCard, 
  onDeleteCard 
}) => {
  const [askDelete, setAskDelete] = useState(false);

  return (
    <div className="relative group mb-1 last:mb-0">
      {/* Mini Modal de Confirmação para o Grid Apertado do Mês */}
      {askDelete && (
        <div className="absolute inset-0 z-[20] bg-red-600 rounded-md flex items-center justify-around px-1 animate-in fade-in zoom-in duration-150">
          <button 
            onClick={(e) => { e.stopPropagation(); setAskDelete(false); }}
            className="text-[6px] font-black uppercase text-white hover:scale-110 transition-transform"
          >
            Não
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteCard(card.id); setAskDelete(false); }}
            className="bg-white text-red-600 px-1.5 py-0.5 rounded text-[6px] font-black uppercase shadow-sm hover:scale-110 transition-transform"
          >
            Apagar
          </button>
        </div>
      )}

      <div 
        onClick={() => !askDelete && onEditCard(card)} 
        className={`px-1.5 py-1 rounded-md text-[7px] font-black border-l-2 shadow-sm cursor-pointer hover:brightness-95 flex items-center justify-between transition-all ${STATUS_COLORS[card.status] || STATUS_COLORS.default}`}
      >
        <span className="truncate flex-1">{card.titulo}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); setAskDelete(true); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition-all ml-1"
          title="Apagar Post"
        >
          <TrashIcon className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};

const ContentCardComponent: React.FC<ContentCardComponentProps> = ({ 
  card, 
  onEditCard, 
  onUpdateCard, 
  onDeleteCard 
}) => {
  const [askDelete, setAskDelete] = useState(false);
  
  const handleTriggerDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAskDelete(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteCard(card.id);
    setAskDelete(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAskDelete(false);
  };

  return (
    <div className="relative group w-full animate-in fade-in duration-200">
      {/* MODAL DE CONFIRMAÇÃO REATIVO */}
      {askDelete && (
        <div className="absolute inset-0 z-[110] bg-red-600/95 backdrop-blur-sm flex flex-col items-center justify-center p-3 rounded-xl text-white text-center animate-in fade-in zoom-in duration-200 shadow-2xl">
          <p className="text-[9px] font-black uppercase mb-4 tracking-tighter leading-tight">Apagar permanentemente?</p>
          <div className="flex gap-2 w-full">
            <button 
              onClick={cancelDelete}
              className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-[8px] font-black uppercase transition-all"
            >
              Não
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg text-[8px] font-black uppercase shadow-xl transition-all"
            >
              Sim
            </button>
          </div>
        </div>
      )}

      <button 
        type="button"
        data-action="delete"
        onClick={handleTriggerDelete}
        className="absolute -top-2 -right-2 z-[100] w-8 h-8 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-800 transition-all cursor-pointer border-2 border-white scale-110 pointer-events-auto"
        title="Apagar Post"
      >
        <TrashIcon className="w-4 h-4 pointer-events-none" />
      </button>

      <div 
        onClick={(e) => {
          const el = e.target as Element | null;
          if (el?.closest?.('[data-action="delete"]') || askDelete) return;
          onEditCard(card);
        }}
        className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-[6px] flex flex-col h-[130px] overflow-hidden ${STATUS_COLORS[card.status] || STATUS_COLORS.default}`}
      >
        <div className="p-2 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{TYPE_ICONS[card.tipo] || '📄'}</span>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">{card.tipo}</span>
          </div>
          {card.isFavorite && <StarIcon fill="currentColor" className="w-3 h-3 text-amber-400" />}
        </div>

        <div className="px-2.5 flex-1 overflow-hidden">
          <h4 className="text-[10px] font-bold text-slate-800 leading-[1.2] line-clamp-3">
            {card.titulo}
          </h4>
        </div>

        <div className="p-1 mt-auto bg-slate-50 flex gap-1 border-t border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); onUpdateCard(card.id, { status: card.status === 'Check' ? 'A Fazer' : 'Check' }); }}
            className={`flex-1 py-1 rounded text-[7px] font-black uppercase transition-all ${
              card.status === 'Check' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-400'
            }`}
          >
            {card.status === 'Check' ? 'FEITO' : 'CHECK'}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onUpdateCard(card.id, { status: 'Em Andamento' }); }}
            className={`flex-1 py-1 rounded text-[7px] font-black uppercase transition-all ${
              card.status === 'Em Andamento' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-400'
            }`}
          >
            PRODUÇÃO
          </button>
        </div>
      </div>
    </div>
  );
};

const Workspace: React.FC<WorkspaceProps> = ({ 
  client, 
  cards, 
  onAddCard, 
  onUpdateCard, 
  onEditCard, 
  onDeleteCard 
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'backlog' | 'favorites'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const toISO = (date: Date) => date.toISOString().split('T')[0];

  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      return dayDate;
    });
  }, [currentDate]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const result = [];
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = offset; i > 0; i--) result.push({ date: new Date(year, month, 1 - i), current: false });
    for (let i = 1; i <= daysCount; i++) result.push({ date: new Date(year, month, i), current: true });
    while (result.length < 42) result.push({ date: new Date(year, month, result.length - offset + 1), current: false });
    return result;
  }, [currentDate]);

  if (!client) return null;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-5">
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-none">{client.nome}</h2>
            <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest mt-1.5">{client.instagram}</p>
          </div>
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'weekly', label: 'Semana' },
              { id: 'monthly', label: 'Mês' },
              { id: 'backlog', label: 'Ideias' },
              { id: 'favorites', label: 'MELHORES REFERÊNCIAS' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {(activeTab === 'weekly' || activeTab === 'monthly') && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
              <button onClick={() => {
                const n = new Date(currentDate);
                activeTab === 'monthly' ? n.setMonth(n.getMonth()-1) : n.setDate(n.getDate()-7);
                setCurrentDate(n);
              }} className="p-1 hover:bg-white rounded transition-all"><ChevronLeftIcon className="w-3 h-3" /></button>
              <div className="px-3 text-[8px] font-black text-slate-600 uppercase text-center min-w-[80px]">
                {activeTab === 'monthly' ? `${months[currentDate.getMonth()]}` : `${weekDays[0].getDate()}/${weekDays[0].getMonth()+1}`}
              </div>
              <button onClick={() => {
                const n = new Date(currentDate);
                activeTab === 'monthly' ? n.setMonth(n.getMonth()+1) : n.setDate(n.getDate()+7);
                setCurrentDate(n);
              }} className="p-1 hover:bg-white rounded transition-all"><ChevronRightIcon className="w-3 h-3" /></button>
            </div>
          )}
          <button 
            onClick={() => onAddCard({ clientId: client.id, dateISO: toISO(new Date()), isBacklog: activeTab === 'backlog' })} 
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
          >
            + NOVO POST
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {activeTab === 'weekly' && (
          <div className="grid grid-cols-7 gap-4">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dayName, idx) => {
              const date = weekDays[idx];
              const iso = toISO(date);
              const dayCards = cards.filter(c => c.dateISO === iso && !c.isBacklog);
              return (
                <div key={idx} className="flex flex-col gap-3 min-h-[600px]">
                  <div className="text-center pb-3 border-b border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase block tracking-tighter">{dayName}</span>
                    <span className={`text-xl font-black ${iso === toISO(new Date()) ? 'text-blue-600' : 'text-slate-900'}`}>{date.getDate()}</span>
                  </div>
                  <div className="space-y-3">
                    {dayCards.map(card => (
                      <ContentCardComponent 
                        key={card.id} 
                        card={card} 
                        onEditCard={onEditCard} 
                        onUpdateCard={onUpdateCard} 
                        onDeleteCard={onDeleteCard} 
                      />
                    ))}
                    <button 
                      onClick={() => onAddCard({ clientId: client.id, dateISO: iso, isBacklog: false })}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 hover:text-blue-400 hover:border-blue-200 transition-all flex items-center justify-center bg-white/50"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="grid grid-cols-7 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm max-w-7xl mx-auto">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="p-3 text-center font-black text-[9px] text-slate-400 uppercase bg-slate-50 border-b border-slate-100">{d}</div>
            ))}
            {daysInMonth.map((cell, idx) => {
              const iso = toISO(cell.date);
              const dayCards = cards.filter(c => c.dateISO === iso && !c.isBacklog);
              return (
                <div 
                  key={idx} 
                  className={`min-h-[110px] p-2 border-r border-b border-slate-50 relative ${!cell.current ? 'bg-slate-50/40' : 'bg-white hover:bg-slate-50/50 transition-colors'}`}
                >
                  <span className={`text-[9px] font-black ${cell.current ? (iso === toISO(new Date()) ? 'text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded' : 'text-slate-400') : 'text-slate-200'}`}>{cell.date.getDate()}</span>
                  <div className="mt-2 space-y-1">
                    {dayCards.map(card => (
                      <MonthlyCardComponent
                        key={card.id}
                        card={card}
                        onEditCard={onEditCard}
                        onUpdateCard={onUpdateCard}
                        onDeleteCard={onDeleteCard}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'backlog' && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Banco de Ideias</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cards.filter(c => c.isBacklog).map(card => (
                <ContentCardComponent 
                  key={card.id} 
                  card={card} 
                  onEditCard={onEditCard} 
                  onUpdateCard={onUpdateCard} 
                  onDeleteCard={onDeleteCard} 
                />
              ))}
              <button 
                onClick={() => onAddCard({ clientId: client.id, dateISO: '', isBacklog: true, titulo: 'Nova Ideia' })}
                className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-300 hover:text-blue-400 flex flex-col items-center justify-center gap-2 h-[130px] transition-all hover:border-blue-200"
              >
                <PlusIcon className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase">Novo Insight</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-2">
              <StarIcon fill="currentColor" className="text-amber-400 w-6 h-6" /> MELHORES REFERÊNCIAS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cards.filter(c => c.isFavorite).map(card => (
                <ContentCardComponent 
                  key={card.id} 
                  card={card} 
                  onEditCard={onEditCard} 
                  onUpdateCard={onUpdateCard} 
                  onDeleteCard={onDeleteCard} 
                />
              ))}
              {cards.filter(c => c.isFavorite).length === 0 && (
                <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 font-medium italic">Nenhuma referência favoritada ainda.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
