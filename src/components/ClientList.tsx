import React, { useState } from 'react';
import { Client } from '../types';
import { PlusIcon, UserIcon, TrashIcon } from './Icons';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (id: string) => void;
  onAddClient: (client: any) => void;
  onDeleteClient: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddClient, onDeleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [newClient, setNewClient] = useState({
    nome: '', instagram: '', nicho: '', tomDeVoz: '', objetivos: '', observacoes: ''
  });

  const q = (searchTerm ?? '').toLowerCase();

  const filtered = (clients ?? []).filter((c: any) => {
    const nome = (c?.nome ?? '').toString().toLowerCase();
    const instagram = (c?.instagram ?? '').toString().toLowerCase();
    return nome.includes(q) || instagram.includes(q);
  });

  const handleSafeDeleteRequest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteConfirmId(id);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteClient(id);
    setDeleteConfirmId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient(newClient);
    setIsAdding(false);
    setNewClient({ nome: '', instagram: '', nicho: '', tomDeVoz: '', objetivos: '', observacoes: '' });
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Clientes</h1>
          <p className="text-slate-400 mt-3 font-medium text-lg italic">Organize o ecossistema de conteúdo da sua agência.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
        >
          <PlusIcon className="w-5 h-5" /> Adicionar Cliente
        </button>
      </div>

      {/* (opcional) campo de busca se você tiver no layout em outro lugar, ignore */}
      {/* <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((client: any) => {
          const displayNome = client?.nome ?? 'Sem nome';
          const displayInstagram = client?.instagram ?? '';
          const displayNicho = client?.nicho ?? '';
          const createdAtStr = client?.createdAt;

          const displayDate = createdAtStr
            ? new Date(createdAtStr).toLocaleDateString()
            : '—';

          return (
            <div key={client.id} className="relative group flex flex-col h-full animate-in zoom-in duration-500">
              {deleteConfirmId === client.id && (
                <div className="absolute inset-0 z-[60] bg-red-600/95 backdrop-blur-md rounded-[56px] flex flex-col items-center justify-center p-10 text-white text-center animate-in fade-in zoom-in duration-200 shadow-2xl">
                  <TrashIcon className="w-12 h-12 mb-4 opacity-50" />
                  <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Excluir Cliente?</h4>
                  <p className="text-xs font-bold mb-8 opacity-80 leading-relaxed uppercase tracking-widest">
                    Isso apagará permanentemente todos os posts e dados de {displayNome}.
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={(e) => confirmDelete(e, client.id)}
                      className="w-full py-5 bg-white text-red-600 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      Sim, Apagar Tudo
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                data-action="delete"
                onClick={(e) => handleSafeDeleteRequest(e, client.id)}
                className="absolute top-6 right-6 z-50 p-4 bg-red-600 text-white shadow-2xl rounded-full transition-all pointer-events-auto hover:bg-red-800 hover:scale-110 active:scale-90 border-4 border-white"
                title="Apagar Cliente"
              >
                <TrashIcon className="w-6 h-6 pointer-events-none" />
              </button>

              <div
                className="relative z-10 bg-white border border-slate-100 p-10 rounded-[56px] shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full overflow-hidden border-b-[12px] border-b-transparent hover:border-b-blue-600"
                onClick={(e) => {
                  const el = e.target as Element | null;
                  if (el?.closest?.('[data-action="delete"]') || deleteConfirmId) return;
                  onSelectClient(client.id);
                }}
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all mb-8">
                  <UserIcon className="w-10 h-10" />
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{displayNome}</h3>
                <p className="text-blue-600 font-black text-sm mb-8 tracking-widest uppercase">{displayInstagram}</p>

                <div className="flex flex-wrap gap-2 mb-10">
                  <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black px-4 py-2 rounded-2xl tracking-widest">
                    {displayNicho}
                  </span>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Desde</span>
                    <span className="text-xs font-bold text-slate-400">{displayDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Ver Planejamento →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-[56px] shadow-2xl p-12 animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <h2 className="text-4xl font-black mb-10 tracking-tighter text-slate-900">Novo Cliente</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Comercial</label>
                <input required placeholder="Ex: Lux Agência" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold" value={newClient.nome} onChange={e => setNewClient({ ...newClient, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Handle Instagram</label>
                <input placeholder="@exemplo" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold" value={newClient.instagram} onChange={e => setNewClient({ ...newClient, instagram: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nicho</label>
                <input placeholder="Ex: Moda, Gastronomia..." className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold" value={newClient.nicho} onChange={e => setNewClient({ ...newClient, nicho: e.target.value })} />
              </div>
            </div>
            <div className="mt-12 flex gap-6">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">Cancelar</button>
              <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">Cadastrar Cliente</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientList;
