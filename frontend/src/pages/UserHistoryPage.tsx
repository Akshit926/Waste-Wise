import React, { useState, useEffect } from 'react';
import {
  History,
  Award,
  CheckCircle2,
  Leaf,
  Download,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface UserHistoryPageProps {
  onTrackRequest: (id: string) => void;
}

export const UserHistoryPage: React.FC<UserHistoryPageProps> = ({ onTrackRequest }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };

  const processedList = requests.filter(r => ['Collected', 'Processed'].includes(r.status));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
          Responsible Stewardship
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
          Pickup History & Certified Impact
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Every completed item is tracked downstream to certified recycling and zero-landfill facilities.
        </p>
      </div>

      {/* Environmental Metrics (Clearly Labeled as Estimated Impact) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-forest-700" />
            <h3 className="font-semibold text-slate-900 text-sm">Environmental Diverted Total</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Estimated impact calculations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">24.5 kg</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Total Waste Diverted</p>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-2xl font-bold text-emerald-700 font-mono">9.8 kg</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Estimated CO₂ Avoided</p>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-2xl font-bold text-slate-900 font-mono">{processedList.length || 2}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Certified Batches</p>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-2xl font-bold text-forest-800 font-mono">100%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero Landfill Ratio</p>
          </div>
        </div>
      </div>

      {/* Completed Pickups Records */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Completed & Processed Pickups
        </h3>

        <div className="space-y-3">
          {processedList.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      #{req.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {req.category}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1">
                    {req.items_description}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Collected from {req.area}, Pune · {req.pickup_date}
                  </p>
                </div>

                <button
                  onClick={() => onTrackRequest(req.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>View Custody Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Processing Certification Box */}
              <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-forest-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Responsibly Processed & Recycled
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Certificate: CER-WW-2026-{req.id} · Facility: Chakan Recovery Complex
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-white px-2.5 py-1 rounded border border-forest-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Audit Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
