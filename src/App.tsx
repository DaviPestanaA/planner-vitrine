<div className="fixed inset-0 bg-black text-white p-10 z-[999999]">
  TAILWIND ATIVO
</div>

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ClientList from './components/ClientList';
import Workspace from './components/Workspace';
import CardDrawer from './components/CardDrawer';
import { useStore } from './store/useStore';
import { ContentCard } from './types';

const App: React.FC = () => {
  const clients = useStore(state => state.clients);
  const currentClientId = useStore(state => state.currentClientId);
  const setCurrentClientId = useStore(state => state.setCurrentClientId);
  const isLoading = useStore(state => state.isLoading);

  const loadInitialData = useStore(state => state.loadInitialData);
  const addClient = useStore(state => state.addClient);
  const deleteClient = useStore(state => state.deleteClient);
  const addCard = useStore(state => state.addCard);
  const updateCard = useStore(state => state.updateCard);
  const deleteCard = useStore(state => state.deleteCard);
  const duplicateCard = useStore(state => state.duplicateCard);

  const [activeTab, setActiveTab] = useState<'clients' | 'workspace' | 'settings'>('clients');
  const [editingCard, setEditingCard] = useState<ContentCard | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const currentClient = useStore(state =>
    state.clients.find(c => c.id === state.currentClientId) || null
  );

  const clientCards = useStore(state =>
    state.cards.filter(c => c.clientId === state.currentClientId)
  );

  const handleSelectClient = (id: string) => {
    setCurrentClientId(id);
    setActiveTab('workspace');
  };

  const handleDeleteCard = (id: string) => {
    setEditingCard(null);
    deleteCard(id);
  };

  const handleDeleteClient = (id: string) => {
    if (currentClientId === id) {
      setActiveTab('clients');
    }
    deleteClient(id);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Badge de debug (pode apagar depois) */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 9999,
          background: '#fff',
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          fontWeight: 700,
        }}
      >
        APP RENDERIZANDO
      </div>

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 animate-pulse z-[200]" />
      )}

      {activeTab === 'clients' && (
        <ClientList
          clients={clients}
          onSelectClient={handleSelectClient}
          onAddClient={addClient}
          onDeleteClient={handleDeleteClient}
        />
      )}

      {activeTab === 'workspace' && currentClient && (
        <Workspace
          client={currentClient}
          cards={clientCards}
          onAddCard={async (cardData) => {
            const newCard = await addCard(cardData);
            if (newCard) setEditingCard(newCard);
          }}
          onUpdateCard={updateCard}
          onEditCard={setEditingCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {activeTab === 'settings' && (
        <div className="p-10 text-center flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4">
            ⚙️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
            Configurações
          </h2>
          <p className="text-slate-400 mt-2 font-medium max-w-sm">
            Este módulo estará disponível na versão Pro.
          </p>
        </div>
      )}

      <CardDrawer
        card={editingCard}
        client={currentClient}
        onClose={() => setEditingCard(null)}
        onUpdate={updateCard}
        onDelete={handleDeleteCard}
        onDuplicate={(id) => {
          duplicateCard(id);
          setEditingCard(null);
        }}
      />
    </Layout>
  );
};

export default App;
