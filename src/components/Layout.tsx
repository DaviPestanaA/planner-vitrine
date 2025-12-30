import React from 'react';
import { UserIcon, CalendarIcon, SettingsIcon } from './Icons';

type Tab = 'clients' | 'workspace' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  /** opcional: mostra badge de debug */
  debugBadgeText?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  debugBadgeText,
}) => {
  return (
    <div className="min-h-screen flex text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <span className="hidden lg:block font-bold text-white text-lg tracking-tight">
            Planner Vitrine
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'clients'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
            type="button"
          >
            <UserIcon />
            <span className="hidden lg:block font-medium">Clientes</span>
          </button>

          {/* Relatórios (desativado) */}
          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl opacity-30 cursor-not-allowed"
            type="button"
          >
            <CalendarIcon />
            <span className="hidden lg:block font-medium">Relatórios</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
            type="button"
          >
            <SettingsIcon />
            <span className="hidden lg:block font-medium">Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Badge opcional (se você passar debugBadgeText no App) */}
        {debugBadgeText ? (
          <div
            style={{
              position: 'fixed',
              top: 12,
              left: 92, // pra não ficar em cima da sidebar (w-20)
              zIndex: 9999,
              background: '#fff',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontWeight: 700,
            }}
          >
            {debugBadgeText}
          </div>
        ) : null}

        {children}
      </main>
    </div>
  );
};

export default Layout;
