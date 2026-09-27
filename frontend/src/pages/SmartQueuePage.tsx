import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Truck,
  Cpu,
  Flame,
  Info,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest, BatchRecommendation } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';

interface SmartQueuePageProps {
  onOpenDrawer: (req: PickupRequest) => void;
  onNavigate: (page: string) => void;
}

export const SmartQueuePage: React.FC<SmartQueuePageProps> = ({ onOpenDrawer, onNavigate }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [recommendations, setRecommendations] = useState<BatchRecommendation[]>([]);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'All' | 'HIGH' | 'MEDIUM' | 'NORMAL'>('All');
  const [loading, setLoading] = useState(true);
  const [creatingBatchKey, setCreatingBatchKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const [reqs, recs] = await Promise.all([
      api.getRequests(),
      api.getRecommendations()
    ]);
    setRequests(reqs);
    setRecommendations(recs);
    setLoading(false);
  };

  const handleCreateBatch = async (rec: BatchRecommendation) => {
    setCreatingBatchKey(rec.batch_key);
    try {
      const b = await api.createBatch(rec.area, rec.pickup_date, rec.request_ids);
      setSuccessMessage(`✓ Batch ${b.id} formed! ${rec.requests_count} pickups in ${rec.area} scheduled for single-trip collection.`);
      await loadQueue();
      setTimeout(() => setSuccessMessage(null), 4500);
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingBatchKey(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (selectedPriorityFilter === 'All') return true;
    return r.priority === selectedPriorityFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      {successMessage && (
        <div className="p-4 bg-forest-900 text-white rounded-xl shadow-lg border border-emerald-500/50 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-150 sticky top-12 z-40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => onNavigate('admin-batches')}
            className="text-[11px] underline text-emerald-300 hover:text-white"
          >
            Go to Batches →
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          Autonomous Dispatch Optimization
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Smart Collection Queue & Batching Engine
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Unlike generic CRM lists, WasteWise dynamically scores waste risk, wait time, and proximity, then groups compatible requests into single-trip collection batches.
        </p>
      </div>

      {/* Transparent Priority Scoring Formula Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Info className="w-4 h-4 text-forest-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Explainable Priority Scoring Formula
          </h2>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-forest-900 font-semibold border border-slate-200/80">
          Priority Score = Waste Risk Score (10–40) + Waiting Time Score (0–30) + Urgency Score (10–30) + Volume Score (5–10)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-1">Waste Risk</strong>
            <div>Hazardous: 40</div>
            <div>E-Waste: 30</div>
            <div>Bulk Waste: 20</div>
            <div>Organic: 15 / Recyclable: 10</div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-1">Waiting Time</strong>
            <div>0 days: 0</div>
            <div>1 day: 10</div>
            <div>2 days: 20</div>
            <div>3+ days (Overdue): 30</div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-1">Window Urgency</strong>
            <div>Pickup Today: 30</div>
            <div>Pickup Tomorrow: 20</div>
            <div>Later: 10</div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-1">Priority Buckets</strong>
            <div className="text-red-700 font-semibold">61+ Score = HIGH 🔴</div>
            <div className="text-amber-700 font-semibold">31–60 Score = MEDIUM 🟡</div>
            <div className="text-emerald-700 font-semibold">0–30 Score = NORMAL 🟢</div>
          </div>
        </div>
      </div>

      {/* SMART COLLECTION BATCH RECOMMENDATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              <span>Smart Batch Recommendations</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                {recommendations.length} available
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Clusters nearby requests in the same municipal zone & date window into a single collection run.
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            All active requests have been successfully clustered into batches.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.batch_key}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      {rec.area} Sector Cluster
                    </span>
                    <PriorityBadge priority={rec.priority} size="sm" />
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    Combine {rec.requests_count} Pickups ({rec.pickup_date})
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rec.request_ids.map(id => (
                      <span
                        key={id}
                        className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200"
                      >
                        #{id}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed font-light">
                    💡 {rec.reason}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Stream: {rec.categories.join(', ')}
                  </span>
                  <button
                    onClick={() => handleCreateBatch(rec)}
                    disabled={creatingBatchKey === rec.batch_key}
                    className="px-4 py-2 bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-300" />
                    <span>
                      {creatingBatchKey === rec.batch_key ? 'Creating Batch...' : 'Create Batch'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DYNAMIC PRIORITY QUEUE LIST */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Prioritized Dispatch Queue</h2>
            <p className="text-xs text-slate-500">Sorted strictly by calculated risk and waiting urgency.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            {(['All', 'HIGH', 'MEDIUM', 'NORMAL'] as const).map((pri) => (
              <button
                key={pri}
                onClick={() => setSelectedPriorityFilter(pri)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedPriorityFilter === pri
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pri} ({pri === 'All' ? requests.length : requests.filter(r => r.priority === pri).length})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onOpenDrawer(req)}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-card transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                    #{req.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {req.category}
                  </span>
                  <PriorityBadge priority={req.priority} size="sm" />
                  <StatusBadge status={req.status} />
                  {req.batch_id && (
                    <span className="text-[11px] font-mono text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                      Batch {req.batch_id}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Score: <strong className="font-mono text-slate-900">{req.priority_score}/100</strong></span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-forest-800 transition-colors" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{req.items_description}</h3>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Customer: {req.customer_name} · {req.area}, Pune · Booked for {req.pickup_date} ({req.pickup_slot})
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400">Waiting:</span>{' '}
                  <span className={`font-semibold ${req.waiting_days >= 2 ? 'text-red-700' : 'text-slate-800'}`}>
                    {req.waiting_days} day{req.waiting_days !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Explainable Rationale Formula Breakdown */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                <span>
                  <strong className="text-slate-900">Scoring Engine:</strong> {req.priority_reason}
                </span>
                <span className="text-forest-700 font-semibold group-hover:underline shrink-0 ml-2">
                  Inspect & Update Status →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
