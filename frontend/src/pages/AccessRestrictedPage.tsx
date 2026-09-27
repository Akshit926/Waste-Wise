import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AccessRestrictedPageProps {
  onReturn: () => void;
}

export const AccessRestrictedPage: React.FC<AccessRestrictedPageProps> = ({ onReturn }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
        <ShieldAlert className="w-7 h-7 text-red-600" />
      </div>
      <div className="space-y-2 max-w-xs">
        <h2 className="text-lg font-semibold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          You don't have permission to view this page.
        </p>
      </div>
      <button
        onClick={onReturn}
        className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Dashboard
      </button>
    </div>
  );
};
