import React, { useState, useEffect } from 'react';
import {
  Layers,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Car
} from 'lucide-react';
import { api } from '../services/api';
import { CollectionBatch, BatchRecommendation } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';

interface BatchesPageProps {
  onOpenRequestById?: (id: string) => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = () => {
  const [batches, setBatches] = useState<CollectionBatch[]>([]);
  const [recommendations, setRecommendations] = useState<BatchRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [bList, rList] = await Promise.all([
      api.getBatches(),
      api.getRecommendations()
    ]);
    setBatches(bList);
    setRecommendations(rList);
    setLoading(false);
  };

  const handleCreateBatch = async (rec: BatchRecommendation) => {
    setCreatingKey(rec.batch_key);
    try {
      await api.createBatch(rec.area, rec.pickup_date, rec.request_ids);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingKey(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
          Route Optimization
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
          Smart Collection Batches
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Automated clustering groups compatible doorstep requests into single vehicle runs, preventing empty return legs and reducing emissions.
        </p>
      </div>

      {/* Available Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-semibold text-slate-900">
              Pending Clustering Opportunities ({recommendations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.batch_key}
                className="bg-white rounded-2xl border border-forest-200/90 p-5 shadow-card space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      {rec.area} Sector
                    </span>
                    <PriorityBadge priority={rec.priority} size="sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Cluster {rec.requests_count} Pickups for {rec.pickup_date}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    💡 {rec.reason}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {rec.request_ids.map(id => (
                      <span key={id} className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        #{id}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Zone: {rec.area}
                  </span>
                  <button
                    onClick={() => handleCreateBatch(rec)}
                    disabled={creatingKey === rec.batch_key}
                    className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{creatingKey === rec.batch_key ? 'Creating...' : 'Form Batch'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Formed Batches */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-forest-700" />
          <span>Active Scheduled Batches ({batches.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm bg-forest-50 px-2 py-0.5 rounded text-forest-900 border border-forest-200">
                    {batch.id}
                  </span>
                  <PriorityBadge priority={batch.priority} size="sm" />
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {batch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Area & Date</span>
                  <span className="font-semibold text-slate-800">{batch.area}</span>
                  <span className="text-slate-500 block text-[11px] font-mono">{batch.pickup_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Vehicle</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    {batch.assigned_vehicle}
                  </span>
                  <span className="text-slate-500 block text-[11px] truncate">{batch.assigned_collector}</span>
                </div>
              </div>

              {/* Clustered Requests in Batch */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-500">
                  Associated Pickups ({batch.requests_count}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {batch.request_ids.map(id => (
                    <span
                      key={id}
                      className="font-mono text-xs bg-slate-50 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      #{id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Created {batch.created_at.slice(0, 10)}</span>
                <span className="text-forest-700 font-medium">Single-Trip Route Optimized ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
