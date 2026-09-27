import React from 'react';
import { CheckCircle2, ShieldCheck, Factory, Award, ArrowRight } from 'lucide-react';
import { PickupRequest } from '../types';

interface WasteJourneyTimelineProps {
  request: PickupRequest;
}

export const WasteJourneyTimeline: React.FC<WasteJourneyTimelineProps> = ({ request }) => {
  const isProcessed = request.status === 'Processed';
  const isCollected = ['Collected', 'Processed'].includes(request.status);

  const stages = [
    {
      title: 'Requested',
      desc: 'Smart triage classified item & scheduled pickup window.',
      done: true,
      time: 'Phase 1'
    },
    {
      title: 'Collected',
      desc: 'Doorstep custody verified by specialized municipal route team.',
      done: isCollected,
      time: 'Phase 2'
    },
    {
      title: 'Sorted & Tested',
      desc: 'Separated by grade & hazardous materials isolated at district hub.',
      done: isProcessed,
      time: 'Phase 3'
    },
    {
      title: 'Responsibly Processed',
      desc: 'Recovered materials melted/dismantled under certified circular standard.',
      done: isProcessed,
      time: 'Final Milestone'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <h3 className="font-semibold text-slate-900 text-sm">End-to-End Waste Journey</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent downstream environmental chain of custody for #{request.id}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          isProcessed
            ? 'bg-forest-50 text-forest-800 border border-forest-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {isProcessed ? '♻️ Responsibly Processed' : 'Collection In Progress'}
        </span>
      </div>

      {/* Horizontal Step Progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {stages.map((stage, idx) => (
          <div key={idx} className="relative p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stage.time}
                </span>
                {stage.done ? (
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                )}
              </div>
              <h4 className={`text-xs font-semibold ${stage.done ? 'text-slate-900' : 'text-slate-500'}`}>
                {stage.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {stage.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Facility Certificate Card */}
      {isProcessed && (
        <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                Certified Recycling Partner: Chakan GreenTech Recovery Hub
              </div>
              <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                Certificate ID: CER-WW-2026-{request.id} · Zero Landfill Verified (94.2% Material Reclamation)
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-forest-800 bg-white px-3 py-1 rounded-md border border-forest-200">
            Audit Ready ✓
          </span>
        </div>
      )}
    </div>
  );
};
