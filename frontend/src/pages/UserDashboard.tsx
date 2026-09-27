import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Package,
  Layers,
  ShieldCheck,
  Leaf,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  onTrackRequest: (requestId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate, onTrackRequest }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRequests();
  }, []);

  const loadUserRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };

  // Find upcoming active pickup
  const upcomingPickup = requests.find(
    r => ['Requested', 'Reviewed', 'Assigned', 'Scheduled', 'Out for Pickup'].includes(r.status)
  ) || requests[0];

  const completedCount = requests.filter(r => ['Collected', 'Processed'].includes(r.status)).length || 8;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
            Citizen Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
            Good afternoon, Akshit
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Here is the status of your municipal specialized waste requests.
          </p>
        </div>

        <button
          onClick={() => onNavigate('triage')}
          className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Dispose New Waste</span>
        </button>
      </div>

      {/* Editorial Primary Card: NEXT PICKUP */}
      {upcomingPickup && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-card space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
                Next Upcoming Pickup
              </span>
              <h2 className="text-lg font-semibold text-slate-900 mt-2">
                {upcomingPickup.category} · {upcomingPickup.items_description}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {upcomingPickup.area}, Pune
                </span>
                <span className="flex items-center gap-1 font-mono">
                  #{upcomingPickup.id}
                </span>
                <PriorityBadge priority={upcomingPickup.priority} size="sm" />
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-800 block">
                {upcomingPickup.pickup_date}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {upcomingPickup.pickup_slot}
              </span>
            </div>
          </div>

          {/* Clean Stepper Progression Line */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {[
                { label: 'Requested', done: true },
                { label: 'Assigned', done: ['Assigned', 'Scheduled', 'Out for Pickup', 'Collected', 'Processed'].includes(upcomingPickup.status) },
                { label: 'Collected', done: ['Collected', 'Processed'].includes(upcomingPickup.status) },
                { label: 'Processed', done: upcomingPickup.status === 'Processed' }
              ].map((step, idx) => (
                <div key={step.label} className="relative flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1.5 transition-colors ${
                      step.done
                        ? 'bg-forest-800 text-white'
                        : 'bg-slate-100 border border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] font-medium ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <StatusBadge status={upcomingPickup.status} />
            <button
              onClick={() => onTrackRequest(upcomingPickup.id)}
              className="text-xs font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1.5"
            >
              <span>Track pickup details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Citizen Environmental Activity Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Your Cumulative Impact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
            <div className="text-slate-500 text-xs font-medium">Completed Pickups</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{completedCount}</div>
            <p className="text-[11px] text-slate-400">Doorstep pickups executed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
            <div className="text-forest-800 text-xs font-medium flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              Waste Diverted
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">24.5 kg</div>
            <p className="text-[11px] text-emerald-700 font-medium">Prevented from unregulated landfills</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
            <div className="text-slate-500 text-xs font-medium">Estimated CO₂ Avoided</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">9.8 kg</div>
            <p className="text-[11px] text-slate-400">Verified circular treatment</p>
          </div>
        </div>
      </div>

      {/* Recent Requests List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Pickup Requests
          </h3>
          <button
            onClick={() => onNavigate('user-requests')}
            className="text-xs text-forest-800 font-medium hover:underline"
          >
            View all ({requests.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs divide-y divide-slate-100">
          {requests.slice(0, 4).map((req) => (
            <div
              key={req.id}
              onClick={() => onTrackRequest(req.id)}
              className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {req.id.slice(-3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{req.items_description}</span>
                    <PriorityBadge priority={req.priority} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {req.category} · {req.area} · Scheduled {req.pickup_date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={req.status} />
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
