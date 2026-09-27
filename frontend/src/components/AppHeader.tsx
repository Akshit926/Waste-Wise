import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications, formatNotificationTime } from '../context/NotificationContext';

interface AppHeaderProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const notifTypeStyles = {
  info: 'border-l-blue-400 bg-blue-50/40',
  success: 'border-l-emerald-500 bg-emerald-50/40',
  warning: 'border-l-amber-500 bg-amber-50/40',
  urgent: 'border-l-red-500 bg-red-50/40',
};

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate, onLogout }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const isAdmin = user.role === 'admin';

  return (
    <>
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20 sticky top-0">
        {/* Left: brand */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-slate-700 font-semibold">WasteWise</span>
          <span className="text-slate-300">·</span>
          <span>{isAdmin ? 'Operations Command Center' : 'Citizen Portal'}</span>
        </div>

        {/* Right: notification bell + user menu */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="notif-bell"
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-800"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] text-forest-800 hover:text-forest-900 font-medium"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      <Bell className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.requestId) onNavigate('track-pickup');
                        }}
                        className={`w-full text-left px-4 py-3 border-l-2 border-b border-slate-50 transition-colors hover:bg-slate-50/80 ${notifTypeStyles[n.type]} ${!n.read ? 'opacity-100' : 'opacity-60'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold text-slate-900 leading-tight ${!n.read ? '' : 'font-medium'}`}>{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{formatNotificationTime(n.timestamp)}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userRef}>
            <button
              id="user-menu-btn"
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="User menu"
            >
              <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-medium text-slate-900">{user.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{user.role === 'citizen' ? 'Citizen' : 'Operations Admin'}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                </div>
                <div className="py-1">
                  <MenuButton
                    icon={User}
                    label="Profile"
                    onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                  />
                  <MenuButton
                    icon={Settings}
                    label="Settings"
                    onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                  />
                </div>
                <div className="border-t border-slate-100 py-1">
                  <MenuButton
                    icon={LogOut}
                    label="Logout"
                    danger
                    onClick={() => { setShowUserMenu(false); setShowLogoutConfirm(true); }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xs w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-900">Sign out?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to sign out of WasteWise?</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function MenuButton({ icon: Icon, label, onClick, danger }: {
  icon: React.ElementType; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
