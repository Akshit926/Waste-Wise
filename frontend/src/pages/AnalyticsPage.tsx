import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart3,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Truck,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsOverview } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const stats = await api.getAnalytics();
    setData(stats);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Loading operational analytics...
      </div>
    );
  }

  // Format charts data
  const categoryData = Object.entries(data.category_distribution).map(([name, value]) => ({
    name,
    value
  }));

  const areaData = Object.entries(data.area_distribution).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  const statusData = Object.entries(data.status_distribution).map(([name, count]) => ({
    name,
    count
  }));

  const CATEGORY_COLORS = [
    '#1B4332', // forest
    '#DC2626', // red hazardous
    '#2563EB', // blue plastic
    '#16A34A', // green organic
    '#D97706', // amber paper
    '#7C3AED', // purple bulk
    '#475569', // slate metal
    '#0891B2', // cyan glass
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-800">
          Civic Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
          Operational Analytics & Impact
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Measurable outcomes: volume diverted, sector demand clusters, and fleet efficiency.
        </p>
      </div>

      {/* Primary Impact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Waste Diverted</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {data.waste_diverted_kg} kg
          </div>
          <p className="text-[11px] text-forest-700 font-medium">Prevented from landfills</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Completed Pickups</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            18
          </div>
          <p className="text-[11px] text-slate-400">Total verified doorsteps</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Collection Batches</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            12
          </div>
          <p className="text-[11px] text-slate-400">Single-route clusters run</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            Estimated CO₂ Avoided
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-800 font-mono">
            {data.co2_avoided_kg} kg
          </div>
          <p className="text-[11px] text-slate-400">Estimated environmental impact</p>
        </div>
      </div>

      {/* Purposeful Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Waste Stream Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Where is waste coming from? (Stream Distribution)
            </h3>
            <p className="text-xs text-slate-500">
              Proportion of logged requests by material stream.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} requests`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pickups by Pune Sector */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Which areas have the most pickups? (Sector Demand)
            </h3>
            <p className="text-xs text-slate-500">
              Active volume distribution across Pune pilot zones.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={areaData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 500 }}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} requests`, 'Requests']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#1B4332" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progression Funnel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            How are requests progressing? (Operations Lifecycle Funnel)
          </h3>
          <p className="text-xs text-slate-500">
            Real-time status progression from citizen submission to downstream certification.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {statusData.map((st) => (
            <div key={st.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {st.name}
              </span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {st.count}
              </div>
              <p className="text-[11px] text-slate-400">
                {Math.round((st.count / data.total_requests) * 100)}% of total volume
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
