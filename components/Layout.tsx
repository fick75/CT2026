import React from 'react';
import { LayoutDashboard, FilePlus, Clock, Settings, LogOut, Menu, Cloud, UserCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, onChangeTab, currentRole, onRoleChange }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Define menus based on role
  const adminItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'repo', label: 'Repositorio Cloud', icon: Cloud },
    { id: 'history', label: 'Historial Global', icon: Clock },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const userItems = [
    { id: 'create', label: 'Nueva Solicitud', icon: FilePlus },
    { id: 'history', label: 'Mis Solicitudes', icon: Clock },
  ];

  const navItems = currentRole === 'admin' ? adminItems : userItems;

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col shadow-2xl z-30 relative`}
      >
        <div className="p-6 flex items-center h-20">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 animate-fade-in">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-900/50">D</div>
                <div>
                  <h1 className="font-bold text-xl text-white leading-none">DocuGen</h1>
                  <span className="text-xs text-slate-500 font-medium tracking-wider">PRO SYSTEM</span>
                </div>
            </div>
          ) : (
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white mx-auto shadow-lg">D</div>
          )}
        </div>

        {/* Role Indicator */}
        <div className={`px-4 mb-6 transition-opacity duration-300 ${!sidebarOpen && 'opacity-0 h-0 overflow-hidden'}`}>
           <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Modo de visualización</p>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                  <button 
                    onClick={() => onRoleChange('user')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${currentRole === 'user' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Usuario
                  </button>
                  <button 
                    onClick={() => onRoleChange('admin')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${currentRole === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Admin
                  </button>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                ${!sidebarOpen && 'justify-center px-2'}
              `}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              {sidebarOpen && <span className="font-medium tracking-wide">{item.label}</span>}
              
              {/* Active Indicator Line for collapsed state */}
              {!sidebarOpen && activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className={`flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition-all duration-200 group ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - Glassmorphism */}
        <header className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-20 transition-all duration-300 glass-panel">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-200/50 text-slate-600 mr-4 transition-colors">
                <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb-ish title */}
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <span className="font-medium text-slate-800 text-lg">
                    {currentRole === 'admin' ? 'Administración' : 'Portal Estudiante'}
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {navItems.find(i => i.id === activeTab)?.label}
                </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">
                    {currentRole === 'admin' ? 'Dra. María González' : 'Juan Pérez'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                    {currentRole === 'admin' ? 'Coordinación Académica' : 'Estudiante de Posgrado'}
                </p>
             </div>
             <div className={`w-11 h-11 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer
                ${currentRole === 'admin' ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700' : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700'}`}>
                {currentRole === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <UserCircle className="w-6 h-6" />}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-24 pb-8 px-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};