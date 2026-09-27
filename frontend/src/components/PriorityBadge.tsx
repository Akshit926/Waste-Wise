import React from 'react';
import { PriorityLevel } from '../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showDot = true
}) => {
  const isHigh = priority === 'HIGH';
  const isMed = priority === 'MEDIUM';

  const baseClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs font-medium rounded-md'
    : 'px-2.5 py-1 text-xs font-medium rounded-md';

  const styleClasses = isHigh
    ? 'bg-red-50 text-red-700 border border-red-200/60'
    : isMed
    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';

  const dotClasses = isHigh
    ? 'bg-red-500'
    : isMed
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <span className={`inline-flex items-center gap-1.5 ${baseClasses} ${styleClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />}
      {priority} PRIORITY
    </span>
  );
};
