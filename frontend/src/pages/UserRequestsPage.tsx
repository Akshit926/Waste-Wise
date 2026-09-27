import React, { useState, useEffect } from 'react';
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';

interface UserRequestsPageProps {
  onNavigate: (page: string) => void;
  onTrackRequest: (id: string) => void;
}

export const UserRequestsPage: React.FC<UserRequestsPageProps> = ({ onNavigate, onTrackRequest }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };

  const filtered = requests.filter(r => {
    if (filter === 'active') return !['Collected', 'Processed', 'Cancelled'].includes(r.status);
    if (filter === 'completed') return ['Collected', 'Processed'].includes(r.status);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
            Citizen Requests
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
            My Waste Pickup Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active requests, view scheduled slots, and check downstream recycling custody.
          </p>
        </div>

        <button
          onClick={() => onNavigate('triage')}
          className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-forest-50 text-forest-900 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-forest-50 text-forest-900 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Pickups ({requests.filter(r => !['Collected', 'Processed', 'Cancelled'].includes(r.status)).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-forest-50 text-forest-900 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed & Certified ({requests.filter(r => ['Collected', 'Processed'].includes(r.status)).length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((req) => (
          <div
            key={req.id}
            onClick={() => onTrackRequest(req.id)}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-card transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  #{req.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {req.category}
                </span>
                <PriorityBadge priority={req.priority} size="sm" />
                <StatusBadge status={req.status} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-forest-800 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Track Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {req.items_description}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {req.area}, Pune
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {req.pickup_date} ({req.pickup_slot})
                </span>
                {req.batch_id && (
                  <span className="text-forest-700 font-mono text-[11px] bg-forest-50 px-2 py-0.5 rounded">
                    Batch: {req.batch_id}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
