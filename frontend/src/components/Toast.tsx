import React, { useEffect } from 'react';
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'info';
  onDismiss: () => void;
  autoDismissMs?: number;
  action?: { label: string; onClick: () => void };
}

const styles = {
  success: {
    wrapper: 'bg-[#1B4332] text-white border-forest-800',
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
  },
  warning: {
    wrapper: 'bg-amber-900 text-white border-amber-700',
    icon: AlertTriangle,
    iconClass: 'text-amber-300',
  },
  info: {
    wrapper: 'bg-slate-900 text-white border-slate-700',
    icon: Info,
    iconClass: 'text-blue-300',
  },
};

export const Toast: React.FC<ToastProps> = ({
  message, type = 'success', onDismiss, autoDismissMs = 4500, action
}) => {
  const s = styles[type];
  const Icon = s.icon;

  useEffect(() => {
    if (autoDismissMs <= 0) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs max-w-sm animate-in slide-in-from-top-2 duration-200 ${s.wrapper}`}>
      <Icon className={`w-4 h-4 shrink-0 ${s.iconClass}`} />
      <span className="flex-1 leading-snug">{message}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[11px] underline opacity-80 hover:opacity-100 shrink-0"
        >
          {action.label}
        </button>
      )}
      <button onClick={onDismiss} className="text-white/60 hover:text-white/90 transition-colors shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'warning' | 'info'; action?: { label: string; onClick: () => void } }>;
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-14 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDismiss={() => onDismiss(t.id)}
          action={t.action}
        />
      ))}
    </div>
  );
};
