import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  History,
  Layers,
  BarChart3,
  CalendarCheck2,
  Leaf,
  Truck,
  ArrowRightLeft,
  Search
} from 'lucide-react';

interface SidebarProps {
  currentRole: 'user' | 'admin';
  currentPage: string;
  onNavigate: (page: string) => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentPage,
  onNavigate,
  onSwitchRole
}) => {
  const userNavItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage', label: 'Dispose Waste', icon: Sparkles, badge: 'Smart AI' },
    { id: 'user-requests', label: 'My Requests', icon: ClipboardList },
    { id: 'user-history', label: 'History & Impact', icon: History },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-queue', label: 'Collection Queue', icon: Sparkles, badge: 'Smart' },
    { id: 'admin-requests', label: 'All Requests', icon: ClipboardList },
    { id: 'admin-batches', label: 'Smart Batches', icon: Layers },
    { id: 'admin-analytics', label: 'Analytics & Impact', icon: BarChart3 },
  ];

  const navItems = currentRole === 'user' ? userNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-forest-900 transition-colors">
            <Leaf className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">WasteWise</span>
              {currentRole === 'admin' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-100 text-forest-800 rounded">
                  OPS
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5">Smarter Collection</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {currentRole === 'user' ? 'Citizen Portal' : 'Municipal Operations'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-50 text-forest-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-forest-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-forest-200/80 text-forest-900'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Demo Switcher helper within sidebar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Active Perspective:</span>
            <span className="font-semibold text-slate-800 capitalize">{currentRole}</span>
          </div>
          <button
            onClick={() => onSwitchRole(currentRole === 'user' ? 'admin' : 'user')}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowRightLeft className="w-3 h-3 text-slate-400" />
            Switch to {currentRole === 'user' ? 'Admin Ops' : 'Citizen View'}
          </button>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
          <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-semibold text-xs shrink-0">
            {currentRole === 'user' ? 'AS' : 'PMC'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-900 truncate">
              {currentRole === 'user' ? 'Akshit Sharma' : 'PMC Operations Dispatch'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentRole === 'user' ? 'Wakad, Pune' : 'Pimpri-Chinchwad Hub'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
