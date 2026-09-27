import React from 'react';
import { RequestStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'Requested':
      colorStyle = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
    case 'Reviewed':
      colorStyle = 'bg-sky-50 text-sky-700 border-sky-200';
      dotColor = 'bg-sky-500';
      break;
    case 'Assigned':
      colorStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      dotColor = 'bg-indigo-500';
      break;
    case 'Scheduled':
      colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      dotColor = 'bg-blue-500';
      break;
    case 'Out for Pickup':
      colorStyle = 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      dotColor = 'bg-amber-500';
      break;
    case 'Collected':
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'Processed':
      colorStyle = 'bg-forest-100 text-forest-800 border-forest-200';
      dotColor = 'bg-forest-600';
      break;
    case 'Cancelled':
      colorStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-400';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
