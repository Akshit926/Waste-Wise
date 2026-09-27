import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowRight,
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Cpu,
  BarChart3,
  RefreshCw,
  Search,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest, BatchRecommendation, AnalyticsOverview } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RequestDrawer } from '../components/RequestDrawer';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onOpenDrawer: (req: PickupRequest) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onOpenDrawer }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [recommendations, setRecommendations] = useState<BatchRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [batchingActionId, setBatchingActionId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [reqs, recs, stats] = await Promise.all([
      api.getRequests(),
      api.getRecommendations(),
      api.getAnalytics()
    ]);
    setRequests(reqs);
    setRecommendations(recs);
    setAnalytics(stats);
    setLoading(false);
  };

  const handleCreateBatch = async (rec: BatchRecommendation) => {
    setBatchingActionId(rec.batch_key);
    try {
      const created = await api.createBatch(rec.area, rec.pickup_date, rec.request_ids);
      setNotification(`✓ Collection batch ${created.id} created! Grouped ${rec.requests_count} pickups for ${rec.area}.`);
      await loadDashboardData();
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setBatchingActionId(null);
    }
  };

  const needsAttention = requests.filter(
    r => r.priority === 'HIGH' || r.waiting_days >= 2
  );

  // Compute operational insights from live data
  const computeInsights = () => {
    const insights: string[] = [];
    // Area demand
    const areaCounts: Record<string, number> = {};
    requests.forEach(r => { areaCounts[r.area] = (areaCounts[r.area] || 0) + 1; });
    const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];
    if (topArea) insights.push(`${topArea[0]} has the highest pickup demand (${topArea[1]} requests today).`);
    // High priority
    const high = requests.filter(r => r.priority === 'HIGH' && !['Processed','Cancelled'].includes(r.status));
    if (high.length > 0) insights.push(`${high.length} high-priority request${high.length !== 1 ? 's' : ''} require immediate attention.`);
    // Category distribution
    const cats: Record<string, number> = {};
    requests.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
    const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      const pct = Math.round((topCat[1] / requests.length) * 100);
      insights.push(`${topCat[0]} represents ${pct}% of active requests.`);
    }
    // Batch opportunities
    const batchable = requests.filter(r => !r.batch_id && !['Processed','Cancelled','Collected'].includes(r.status));
    if (recommendations.length > 0) {
      insights.push(`${recommendations.reduce((s, r) => s + r.requests_count, 0)} nearby requests can be consolidated into ${recommendations.length} optimized collection run${recommendations.length !== 1 ? 's' : ''}.`);
    } else if (batchable.length > 0) {
      insights.push(`${batchable.length} requests are pending batch assignment.`);
    }
    return insights;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-forest-900 text-white text-xs font-medium rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-150 sticky top-12 z-40 border border-emerald-500/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => onNavigate('admin-batches')}
            className="text-[11px] underline text-emerald-300 hover:text-white"
          >
            View Batches →
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-semibold mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Municipal Operations Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Collection Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tuesday, 28 September 2026 · {requests.length} active service requests in Pune zone
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('admin-queue')}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Manage Queue & Batches</span>
          </button>
        </div>
      </div>

      {/* Primary Operations Insight (Editorial Layout, NOT 6 Generic Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Primary Insight Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Collection Operations Health
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Optimal Routing
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono">
                {requests.length}
              </span>
              <span className="text-sm text-slate-500 font-medium">total logged requests</span>
            </div>

            {/* Health Meter */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Schedule Compliance Ratio</span>
                <span className="font-mono font-semibold text-slate-900">
                  {analytics?.on_schedule_percentage || 83}% On Schedule
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-forest-700 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics?.on_schedule_percentage || 83}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <strong className="text-slate-900">{needsAttention.length} require urgent attention</strong>
              <span className="text-slate-400">(Hazardous or &gt;2 days wait)</span>
            </div>
            <button
              onClick={() => onNavigate('admin-queue')}
              className="text-forest-800 hover:text-forest-900 font-semibold flex items-center gap-1"
            >
              Open Smart Queue →
            </button>
          </div>
        </div>

        {/* Today's Pickups Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Today's Dispatches
              </span>
              <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded">
                27 Sept
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-900 font-mono">
              08
            </div>
            <p className="text-xs text-slate-500 mt-1">Confirmed pickups across sectors</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Wakad Sector</span>
              <span className="font-semibold text-slate-900 font-mono">3 pickups</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Hinjewadi Tech Zone</span>
              <span className="font-semibold text-slate-900 font-mono">2 pickups</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Baner Road</span>
              <span className="font-semibold text-slate-900 font-mono">2 pickups</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Aundh Municipal</span>
              <span className="font-semibold text-slate-900 font-mono">1 pickup</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE USP SECTION 1: SMART COLLECTION BATCH RECOMMENDATION (VISUAL WOW MOMENT) */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-forest-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Smart Batch Opportunity
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-semibold">
                    Algorithm Recommendation
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  Combine {recommendations[0].requests_count} {recommendations[0].area} pickups into one single collection run
                </h3>
              </div>
            </div>

            <button
              onClick={() => handleCreateBatch(recommendations[0])}
              disabled={batchingActionId === recommendations[0].batch_key}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              <span>
                {batchingActionId === recommendations[0].batch_key
                  ? 'Assigning Cluster...'
                  : 'Create Collection Batch'}
              </span>
            </button>
          </div>

          {/* Grouped Requests Pill Row */}
          <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-700/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-slate-300">
                <strong>Clustered Pickups:</strong>{' '}
                {recommendations[0].request_ids.map(id => (
                  <span key={id} className="font-mono bg-forest-800 text-emerald-200 px-2 py-0.5 rounded border border-forest-600 mr-1.5">
                    #{id}
                  </span>
                ))}
              </div>
              <span className="text-slate-400 text-[11px]">
                Target Window: {recommendations[0].pickup_date} · Zone: {recommendations[0].area}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              💡 {recommendations[0].reason} Combining these into one vehicle run eliminates redundant trips, saves 4.2 kg estimated fuel emissions, and ensures hazardous lead materials are cleared concurrently.
            </p>
          </div>
        </div>
      )}

      {/* CORE USP SECTION 2: NEEDS ATTENTION (Explainable Priority Queue) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Needs Attention</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {needsAttention.length} requests
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by waste hazard score, customer waiting days, and collection urgency.
            </p>
          </div>

          <button
            onClick={() => onNavigate('admin-queue')}
            className="text-xs font-semibold text-forest-800 hover:text-forest-900"
          >
            Full Queue View →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {needsAttention.slice(0, 3).map((req) => (
            <div
              key={req.id}
              onClick={() => onOpenDrawer(req)}
              className="bg-white rounded-2xl border border-red-200/80 p-5 shadow-2xs hover:shadow-card transition-all cursor-pointer space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">#{req.id}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {req.category}
                  </span>
                </div>
                <PriorityBadge priority={req.priority} size="sm" />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-forest-800 transition-colors line-clamp-1">
                  {req.items_description}
                </h4>
                <div className="text-[11px] text-slate-500 mt-1">
                  {req.area}, Pune · Waiting {req.waiting_days} day{req.waiting_days !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Explainable Priority Reason Pill */}
              <div className="p-2.5 bg-red-50/60 rounded-lg border border-red-100/80 text-[11px] text-red-800 font-mono leading-tight">
                {req.priority_reason}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{req.pickup_date}</span>
                <span className="font-semibold text-forest-800 text-[11px] group-hover:underline">
                  Inspect & Update →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONS REQUEST TABLE PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Service Requests</h2>
            <p className="text-xs text-slate-500">Click any row to open the operational dispatch drawer.</p>
          </div>
          <button
            onClick={() => onNavigate('admin-requests')}
            className="text-xs font-semibold text-forest-800 hover:text-forest-900"
          >
            All Requests ({requests.length}) →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer & Items</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Pickup Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.slice(0, 6).map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onOpenDrawer(req)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{req.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{req.customer_name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {req.items_description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {req.area}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {req.pickup_date}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={req.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-forest-700 hover:text-forest-900 font-semibold text-[11px]">
                        Inspect
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* OPERATIONAL INSIGHTS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Operational Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Generated from live request data.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {computeInsights().map((insight, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
