import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  History,
  Layers,
  BarChart3,
  Leaf,
  Truck,
  ArrowRightLeft,
  User,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentRole: 'user' | 'admin';
  currentPage: string;
  onNavigate: (page: string) => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
  userName?: string;
  userArea?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentPage,
  onNavigate,
  onSwitchRole,
  userName,
  userArea
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const userNavItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage', label: 'Dispose Waste', icon: Sparkles, badge: 'Smart' },
    { id: 'user-requests', label: 'My Requests', icon: ClipboardList },
    { id: 'user-history', label: 'History & Impact', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-queue', label: 'Collection Queue', icon: Sparkles, badge: 'Smart' },
    { id: 'admin-requests', label: 'All Requests', icon: ClipboardList },
    { id: 'admin-batches', label: 'Smart Batches', icon: Layers },
    { id: 'admin-analytics', label: 'Analytics & Impact', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = currentRole === 'user' ? userNavItems : adminNavItems;
  const displayName = userName || (currentRole === 'user' ? 'Akshit Sharma' : 'PMC Operations');
  const displaySub = userArea ? `${userArea}, Pune` : (currentRole === 'user' ? 'Wakad, Pune' : 'Pimpri-Chinchwad Hub');
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const SidebarContent = () => (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col h-full select-none">
      {/* Brand */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={() => { onNavigate(currentRole === 'user' ? 'user-dashboard' : 'admin-dashboard'); setMobileOpen(false); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1B4332] text-white flex items-center justify-center shadow-sm group-hover:bg-[#15362A] transition-colors">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">WasteWise</span>
              {currentRole === 'admin' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1 py-0.5 bg-emerald-100 text-forest-800 rounded">
                  OPS
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          className="lg:hidden text-slate-400 hover:text-slate-700 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2.5 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {currentRole === 'user' ? 'Citizen Portal' : 'Municipal Operations'}
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1B4332]/8 text-[#1B4332] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1B4332]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? 'bg-emerald-100 text-forest-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#1B4332] rounded-l" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Role Switcher */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span>Demo Mode</span>
            <span className="normal-case font-normal text-slate-700 capitalize">{currentRole === 'user' ? 'Citizen' : 'Admin'}</span>
          </div>
          <button
            onClick={() => { onSwitchRole(currentRole === 'user' ? 'admin' : 'user'); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowRightLeft className="w-3 h-3 text-slate-400" />
            Switch to {currentRole === 'user' ? 'Admin Ops' : 'Citizen View'}
          </button>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => { onNavigate('profile'); setMobileOpen(false); }}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/70 shadow-sm hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-semibold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-900 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{displaySub}</p>
          </div>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-[#1B4332] text-white rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-50">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 shrink-0 min-h-screen">
        <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};
