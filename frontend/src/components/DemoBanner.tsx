import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, HelpCircle, CheckCircle2, ChevronDown, User, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface DemoBannerProps {
  currentRole: 'user' | 'admin';
  onSwitchRole: (role: 'user' | 'admin') => void;
  onReset: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  currentRole,
  onSwitchRole,
  onReset
}) => {
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await api.resetData();
    onReset();
    setTimeout(() => setResetting(false), 500);
  };

  return (
    <div className="bg-[#0F1F17] text-white border-b border-forest-900 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm z-30 sticky top-0">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-forest-800/80 text-forest-200 border border-forest-700/50 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
          Hackathon Jury Demo
        </span>
        <span className="text-slate-300 hidden md:inline">
          Experience both sides of WasteWise: Citizen Triage & Admin Smart Collection Queue.
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <div className="inline-flex bg-forest-950 p-0.5 rounded-md border border-forest-800">
          <button
            onClick={() => onSwitchRole('user')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              currentRole === 'user'
                ? 'bg-forest-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3 h-3" />
            Citizen View
          </button>
          <button
            onClick={() => onSwitchRole('admin')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              currentRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            Operations Admin
          </button>
        </div>

        {/* Demo Script Helper Button */}
        <button
          onClick={() => setShowDemoGuide(!showDemoGuide)}
          className="px-2.5 py-1 rounded border border-forest-800 bg-forest-900/60 hover:bg-forest-800 text-slate-200 flex items-center gap-1.5 transition-colors"
          title="View recommended 2-minute demo flow"
        >
          <HelpCircle className="w-3.5 h-3.5 text-forest-400" />
          <span className="hidden sm:inline">Demo Script</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Reset Data Button */}
        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-2.5 py-1 rounded border border-forest-800/80 bg-forest-900/40 hover:bg-forest-800/80 text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          title="Reset sample Pune data to initial state"
        >
          <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>

      {/* Demo Guide Popover Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-forest-800 font-semibold text-sm">
                  WW
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">2-Minute Jury Demo Script</h3>
                  <p className="text-xs text-slate-500">Fastest way to showcase the core differentiators</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600 max-h-[65vh] overflow-y-auto pr-1">
              <div className="p-2.5 bg-forest-50/50 rounded-lg border border-forest-100">
                <span className="font-semibold text-forest-900 block mb-1">Part 1: Citizen Waste Triage (1 min)</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>Click <strong>Dispose Waste</strong> in Citizen view.</li>
                  <li>Type: <code className="bg-white px-1.5 py-0.5 rounded border border-forest-200 text-forest-800 font-mono">"Old laptop and two batteries"</code></li>
                  <li>Notice: System segments items into <strong>Laptop (E-Waste)</strong> and <strong>Batteries (Hazardous)</strong>.</li>
                  <li>Highlights special toxic handling and high-priority collection.</li>
                  <li>Click <strong>Schedule Pickup</strong> → select Wakad → confirm request.</li>
                </ol>
              </div>

              <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="font-semibold text-emerald-950 block mb-1">Part 2: Admin Command Center & Smart Queue (1 min)</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>Switch to <strong>Operations Admin</strong> via top toggle.</li>
                  <li>Observe <strong>Needs Attention</strong>: Priority engine transparently explains risk score calculation.</li>
                  <li>Look at <strong>Smart Recommendations</strong>: System groups 3 Wakad pickups.</li>
                  <li>Click <strong>Create Collection Batch</strong>: Requests are bundled under Batch B-003.</li>
                  <li>Open any request row to see side drawer and update status.</li>
                </ol>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-500 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>All actions persist in real-time. You can click "Reset Demo" at any point to restore initial state.</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDemoGuide(false)}
                className="px-4 py-1.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Got it, start demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
