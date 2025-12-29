
import React, { useState, useEffect } from 'react';
import { ContentCard, Client, ContentLink } from '../types';
import { PlusIcon, TrashIcon, LinkIcon, StarIcon } from './Icons';
import { generateCaption } from '../services/geminiService';

interface CardDrawerProps {
  card: ContentCard | null;
  client: Client | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ContentCard>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const CardDrawer: React.FC<CardDrawerProps> = ({ card, client, onClose, onUpdate, onDelete, onDuplicate }) => {
  const [localData, setLocalData] = useState<Partial<ContentCard>>({});
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (card) setLocalData(card);
  }, [card?.id]);

  if (!card) return null;

  const handleUpdate = (updates: Partial<ContentCard>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
    onUpdate(card.id, updates);
  };

  const handleGenerateIA = async () => {
    if (!client) return;
    setIsGenerating(true);
    try {
      const suggested = await generateCaption(
        localData.titulo || '',
        localData.tipo || 'Post',
        localData.pilar || 'Geral',
        client.nicho,
        client.tomDeVoz
      );
      handleUpdate({ legenda: suggested });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addLink = () => {
    if (!newLinkUrl) return;
    const link: ContentLink = { id: Date.now().toString(), label: newLinkLabel || 'Link', url: newLinkUrl };
    const links = [...(localData.links || []), link];
    handleUpdate({ links });
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const removeLink = (id: string) => {
    const links = (localData.links || []).filter(l => l.id !== id);
    handleUpdate({ links });
  };

  const handleInternalDelete = () => {
    if (confirm('Tem certeza que deseja apagar este conteúdo?')) {
      onDelete(card.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[650px] bg-white z-[70] shadow-2xl flex flex-col animate-slide-in overflow-hidden border-l border-slate-100">
        
        <div className="px-8 py-5 border-b flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleUpdate({ isFavorite: !localData.isFavorite })}
              className={`p-2.5 rounded-xl transition-all ${localData.isFavorite ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300'}`}
            >
              <StarIcon fill={localData.isFavorite ? 'currentColor' : 'none'} className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editor de Post</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-all"><PlusIcon className="w-6 h-6 rotate-45" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white">
          <textarea 
            value={localData.titulo || ''}
            onChange={(e) => handleUpdate({ titulo: e.target.value })}
            rows={2}
            className="w-full text-4xl font-black border-none focus:ring-0 p-0 text-slate-900 placeholder:text-slate-100 bg-white resize-none outline-none"
            placeholder="Título do conteúdo..."
          />

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status de Produção</label>
            <div className="flex gap-3">
              {[
                { label: 'A Fazer', color: 'bg-slate-100 text-slate-500', active: 'bg-slate-700 text-white' },
                { label: 'Em Andamento', color: 'bg-blue-50 text-blue-500', active: 'bg-blue-600 text-white shadow-lg shadow-blue-200' },
                { label: 'Check', color: 'bg-emerald-50 text-emerald-500', active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' }
              ].map(s => (
                <button
                  key={s.label}
                  onClick={() => handleUpdate({ status: s.label })}
                  className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${localData.status === s.label || (!localData.status && s.label === 'A Fazer') ? s.active : `${s.color} hover:opacity-100`}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tipo</label>
              <input type="text" value={localData.tipo || ''} onChange={e => handleUpdate({ tipo: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pilar</label>
              <input type="text" value={localData.pilar || ''} onChange={e => handleUpdate({ pilar: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Links de Apoio (Drive, Refs, etc)</label>
            <div className="flex gap-2">
              <input placeholder="Rótulo (ex: Drive)" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm" />
              <input placeholder="URL" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="flex-[2] bg-slate-50 rounded-xl px-4 py-2 text-sm" />
              <button onClick={addLink} className="bg-slate-900 text-white px-4 rounded-xl font-bold">+</button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {localData.links?.map(link => (
                <div key={link.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 group">
                  <a href={link.url} target="_blank" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><LinkIcon /> {link.label}</a>
                  <button onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {/* Seção de Direcionamento e Copy agora em primeiro e com mais espaço */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-30">Direcionamento e Copy</label>
              <textarea 
                rows={12} 
                value={localData.copy || ''} 
                onChange={e => handleUpdate({ copy: e.target.value })} 
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-[14px] leading-relaxed outline-none focus:ring-2 focus:ring-slate-100 transition-all" 
                placeholder="Instruções para a criação, hooks, CTAs desejadas..." 
              />
            </div>

            {/* Seção de Legenda Final do Post em segundo */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-30">Legenda Final do Post</label>
                <button 
                  onClick={handleGenerateIA}
                  disabled={isGenerating}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                >
                  {isGenerating ? 'Gerando...' : '✨ Sugerir com IA'}
                </button>
              </div>
              <textarea 
                rows={8} 
                value={localData.legenda || ''} 
                onChange={e => handleUpdate({ legenda: e.target.value })} 
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-[14px] leading-relaxed outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                placeholder="A legenda do post aparecerá aqui..." 
              />
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-white flex gap-5 z-30">
          <button onClick={handleInternalDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95">Apagar Conteúdo</button>
          <button onClick={() => { onDuplicate(card.id); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95">Duplicar</button>
        </div>
      </div>
    </>
  );
};

export default CardDrawer;
