import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  CheckCircle2,
  Cpu,
  Flame,
  Recycle,
  BarChart3,
  Building2
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSelectRole: (role: 'user' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectRole }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Leaf className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900 text-base tracking-tight">WasteWise</span>
              <span className="text-xs text-slate-500 hidden sm:inline">Civic Logistics</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('user-dashboard');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Citizen Demo
            </button>
            <button
              onClick={() => {
                onSelectRole('admin');
                onNavigate('admin-dashboard');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Admin Command
            </button>
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('triage');
              }}
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Dispose Waste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            Modern Civic Waste Triage & Logistics Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.15]">
            Smarter Disposal. <br className="hidden sm:inline" />
            <span className="text-forest-800">Smarter Collection.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            WasteWise helps citizens identify and dispose of specialized waste responsibly,
            while giving municipal teams an intelligent priority queue and automated collection batching.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('triage');
              }}
              className="px-6 py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Identify & Dispose Waste</span>
            </button>
            <button
              onClick={() => {
                onSelectRole('admin');
                onNavigate('admin-dashboard');
              }}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-sm font-semibold shadow-2xs flex items-center gap-2 transition-colors"
            >
              <Truck className="w-4 h-4 text-slate-600" />
              <span>Open Operations Command</span>
            </button>
          </div>

          {/* Quick Demo Preview Card */}
          <div className="mt-12 p-4 max-w-xl mx-auto rounded-xl bg-white border border-slate-200 text-left shadow-subtle flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-forest-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                AI
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Try rule-based triage keyword input:</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">"Old laptop and two batteries"</p>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('triage');
              }}
              className="text-xs text-forest-700 font-semibold hover:text-forest-900 flex items-center gap-1 shrink-0"
            >
              Test Triage →
            </button>
          </div>
        </section>

        {/* The Fundamental Shift (Traditional vs WasteWise) */}
        <section className="bg-white border-y border-slate-200/80 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                The Core Differentiator
              </h2>
              <p className="text-xl font-semibold text-slate-900">
                Beyond Standard Waste CRUD Dashboards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional */}
              <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Traditional Waste Apps
                </div>
                <div className="font-mono text-sm text-slate-600 font-medium py-3 border-b border-slate-200">
                  Request ➔ Assign ➔ Collect
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Citizens dump mixed garbage into generic forms. Logistics teams face chaotic, unprioritized lists with no hazard filtering or route clustering.
                </p>
              </div>

              {/* WasteWise */}
              <div className="p-6 rounded-xl bg-forest-50/40 border border-forest-200">
                <div className="text-xs font-semibold text-forest-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  WasteWise Operating Model
                </div>
                <div className="font-mono text-xs sm:text-sm text-forest-900 font-semibold py-3 border-b border-forest-200/70">
                  Identify ➔ Understand ➔ Prioritize ➔ Batch ➔ Collect ➔ Process
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Automated triage segregates hazardous e-waste from recyclables. A deterministic scoring engine scores priority and combines nearby pickups into single-truck batches.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
              Core Capabilities
            </h2>
            <p className="text-xl font-semibold text-slate-900">
              Designed for Citizens & City Operators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Smart Waste Triage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe waste in natural language. Our rule-based matching engine instantly detects hazardous materials, e-waste, and provides handling guidelines.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Smart Collection Queue</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                An explainable priority engine factors in waste hazard, wait time, pickup urgency, and volume. Nearby requests in the same zone are grouped into single-trip batches.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Downstream Waste Journey</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trust through transparency. Citizens and municipal auditors track waste from doorstep collection through sorting and certified circular processing.
              </p>
            </div>
          </div>
        </section>

        {/* Operations Statistics Banner */}
        <section className="bg-slate-900 text-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-mono">24.5 kg</p>
                <p className="text-xs text-slate-400 mt-1">Waste Diverted</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">18</p>
                <p className="text-xs text-slate-400 mt-1">Pickups Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-mono">3 Batches</p>
                <p className="text-xs text-slate-400 mt-1">Single-Route Runs</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">9.8 kg</p>
                <p className="text-xs text-slate-400 mt-1">Estimated CO₂ Avoided</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">WasteWise</span> — Smarter Disposal. Smarter Collection.
          </div>
          <div>
            Pune Pilot Deployment: Wakad · Hinjewadi · Baner · Aundh · Pimple Saudagar
          </div>
        </div>
      </footer>
    </div>
  );
};
