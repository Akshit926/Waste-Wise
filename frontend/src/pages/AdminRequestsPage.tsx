import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  ArrowUpDown,
  Download,
  MapPin,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';

interface AdminRequestsPageProps {
  onOpenDrawer: (req: PickupRequest) => void;
  onNewRequest?: () => void;
}

export const AdminRequestsPage: React.FC<AdminRequestsPageProps> = ({ onOpenDrawer }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');

  useEffect(() => {
    loadRequests();
  }, [priorityFilter, statusFilter, categoryFilter, areaFilter]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await api.getRequests({
      search,
      priority: priorityFilter,
      status: statusFilter,
      category: categoryFilter,
      area: areaFilter
    });
    setRequests(data);
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

  const areas = ['All', 'Wakad', 'Hinjewadi', 'Baner', 'Aundh', 'Pimple Saudagar'];
  const categories = ['All', 'E-Waste', 'Hazardous', 'Plastic', 'Organic', 'Paper', 'Bulk Waste', 'Metal', 'Glass'];
  const statuses = ['All', 'Requested', 'Reviewed', 'Assigned', 'Scheduled', 'Out for Pickup', 'Collected', 'Processed'];
  const priorities = ['All', 'HIGH', 'MEDIUM', 'NORMAL'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
            Operations Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
            All Waste Service Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, and inspect detailed operational status across all Pune sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadRequests}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID (#WW1042), customer name, item keywords, or address..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Multi-Select Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium"
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Area Sector</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium"
            >
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Live Filter Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Showing <strong>{requests.length}</strong> matching requests</span>
          {(priorityFilter !== 'All' || statusFilter !== 'All' || categoryFilter !== 'All' || areaFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setPriorityFilter('All');
                setStatusFilter('All');
                setCategoryFilter('All');
                setAreaFilter('All');
                setSearch('');
              }}
              className="text-forest-700 font-semibold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No requests matched your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Request</th>
                  <th className="py-3.5 px-4">Customer & Items</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Zone / Area</th>
                  <th className="py-3.5 px-4">Window</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onOpenDrawer(req)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{req.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{req.customer_name}</div>
                      <div className="text-[11px] text-slate-500 max-w-[200px] truncate">
                        {req.items_description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {req.area}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      <div>{req.pickup_date}</div>
                      <div className="text-[10px] text-slate-400">{req.pickup_slot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-forest-700 hover:text-forest-900 font-semibold text-[11px] inline-flex items-center gap-1">
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
