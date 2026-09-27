import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Leaf,
  CalendarClock,
  Package,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  onTrackRequest: (requestId: string) => void;
}

const STATUS_STEPS = ['Requested', 'Assigned', 'Collected', 'Processed'];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    'Requested': 0, 'Reviewed': 0, 'Assigned': 1, 'Scheduled': 1,
    'Out for Pickup': 1, 'Collected': 2, 'Processed': 3
  };
  return map[status] ?? 0;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate, onTrackRequest }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ req: PickupRequest; reason: string } | null>(null);
  const [cancelReason, setCancelReason] = useState('No longer required');

  useEffect(() => { loadUserRequests(); }, []);

  const loadUserRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };

  const upcomingPickup = requests.find(
    r => ['Requested', 'Reviewed', 'Assigned', 'Scheduled', 'Out for Pickup'].includes(r.status)
  ) || requests[0];

  const completedCount = requests.filter(r => ['Collected', 'Processed'].includes(r.status)).length || 8;
  const activeCount = requests.filter(r => !['Processed', 'Cancelled'].includes(r.status)).length;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const CANCEL_REASONS = [
    'No longer required',
    'Wrong pickup time',
    'Waste already disposed',
    'Other'
  ];

  const canReschedule = (status: string) =>
    ['Requested', 'Reviewed', 'Assigned', 'Scheduled'].includes(status);

  const canCancel = (status: string) =>
    ['Requested', 'Reviewed', 'Assigned', 'Scheduled'].includes(status);

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">Citizen Overview</span>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight mt-1">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {activeCount > 0
              ? `You have ${activeCount} active pickup request${activeCount !== 1 ? 's' : ''}.`
              : "You're all caught up. No active pickups."}
          </p>
        </div>
        <button
          onClick={() => onNavigate('triage')}
          className="px-4 py-2 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          Dispose New Waste
        </button>
      </div>

      {/* NEXT PICKUP — primary card */}
      {upcomingPickup && ['Requested', 'Reviewed', 'Assigned', 'Scheduled', 'Out for Pickup'].includes(upcomingPickup.status) ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-forest-50/30">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-forest-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">Next Pickup</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">#{upcomingPickup.id}</span>
          </div>

          <div className="p-5 space-y-5">
            {/* Item info */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {upcomingPickup.category}
                  </span>
                  <PriorityBadge priority={upcomingPickup.priority} size="sm" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 mt-1">{upcomingPickup.items_description}</h2>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {upcomingPickup.area}, Pune
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-semibold text-slate-900">{upcomingPickup.pickup_date}</div>
                <div className="text-[11px] text-slate-500 font-mono">{upcomingPickup.pickup_slot}</div>
              </div>
            </div>

            {/* Status progression */}
            <div className="grid grid-cols-4 gap-1">
              {STATUS_STEPS.map((step, idx) => {
                const currentIdx = getStepIndex(upcomingPickup.status);
                const done = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={step} className="flex flex-col items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      done ? 'bg-[#1B4332] text-white' : 'bg-slate-100 border border-slate-300 text-slate-400'
                    } ${isCurrent ? 'ring-2 ring-forest-200' : ''}`}>
                      {done ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={upcomingPickup.status} />
              <div className="flex items-center gap-2">
                {canCancel(upcomingPickup.status) && (
                  <button
                    onClick={() => setCancelModal({ req: upcomingPickup, reason: 'No longer required' })}
                    className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => onTrackRequest(upcomingPickup.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-900"
                >
                  Track details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-forest-700" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No Active Pickups</h3>
            <p className="text-xs text-slate-500">You're all caught up. Schedule a new pickup when you're ready.</p>
            <button
              onClick={() => onNavigate('triage')}
              className="mx-auto flex items-center gap-1.5 px-4 py-2 bg-forest-800 text-white rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Dispose Waste
            </button>
          </div>
        )
      )}

      {/* Impact Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-xs text-slate-500 font-medium">Completed Pickups</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{completedCount}</div>
          <div className="text-[11px] text-slate-400">Doorstep pickups done</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-forest-800">
            <Leaf className="w-3.5 h-3.5 text-forest-600" /> Waste Diverted
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">24.5 kg</div>
          <div className="text-[11px] text-emerald-700 font-medium">From unregulated landfills</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-xs text-slate-500 font-medium">CO₂ Avoided</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">9.8 kg</div>
          <div className="text-[11px] text-slate-400">Via circular treatment</div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Pickup Requests</h3>
          <button onClick={() => onNavigate('user-requests')} className="text-xs text-forest-800 font-medium hover:underline">
            View all ({requests.length})
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No pickup history yet.</p>
            <p className="text-[11px] text-slate-400">Your requests will appear here once submitted.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {requests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                onClick={() => onTrackRequest(req.id)}
                className="px-4 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                    {req.id.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 line-clamp-1">{req.items_description}</span>
                      <PriorityBadge priority={req.priority} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {req.category} · {req.area} · {req.pickup_date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xs w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Cancel Pickup</h3>
              <button onClick={() => setCancelModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">Why are you cancelling <span className="font-semibold">#{cancelModal.req.id}</span>?</p>
            <div className="space-y-2">
              {CANCEL_REASONS.map(r => (
                <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={r}
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                    className="text-forest-700"
                  />
                  <span className="text-xs text-slate-700">{r}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => setCancelModal(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                Keep Pickup
              </button>
              <button
                onClick={async () => {
                  await api.updateStatus(cancelModal.req.id, 'Cancelled', `Cancelled by citizen: ${cancelReason}`);
                  setCancelModal(null);
                  await loadUserRequests();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
