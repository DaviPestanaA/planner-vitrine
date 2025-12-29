
import React from 'react';
// Fix: removed non-existent HomeIcon from imports
import { UserIcon, CalendarIcon, SettingsIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'clients' | 'workspace' | 'settings';
  onNavigate: (tab: 'clients' | 'workspace' | 'settings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  return (
    <div className="min-h-screen flex text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">V</div>
          <span className="hidden lg:block font-bold text-white text-lg tracking-tight">Planner Vitrine</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => onNavigate('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'clients' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <UserIcon />
            <span className="hidden lg:block font-medium">Clientes</span>
          </button>
          
          {/* Note: Workspace navigation depends on selected client, handled in main App */}
          
          <button 
            disabled
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl opacity-30 cursor-not-allowed"
          >
            <CalendarIcon />
            <span className="hidden lg:block font-medium">Relatórios</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-slate-200 transition-all">
            <SettingsIcon />
            <span className="hidden lg:block font-medium">Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
