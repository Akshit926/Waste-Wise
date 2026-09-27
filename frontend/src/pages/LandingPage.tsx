import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  ArrowDown,
  ChevronRight,
  FileCheck2,
  Package,
  Activity,
  BarChart2
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSelectRole: (role: 'user' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectRole }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {/* 4. NAVBAR */}
      <header className="sticky top-0 z-30 bg-[#F8F9FA]/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">WasteWise</span>
              <span className="text-[10px] uppercase font-mono font-medium text-slate-400 border border-slate-200 px-1 py-0.2 rounded hidden sm:inline">
                Civic Logistics
              </span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('citizens')}
              className="hover:text-slate-900 transition-colors"
            >
              For Citizens
            </button>
            <button
              onClick={() => scrollTo('operations')}
              className="hover:text-slate-900 transition-colors"
            >
              For Operations
            </button>
          </nav>

          {/* Right: Auth Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('login');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('triage');
              }}
              className="px-3.5 py-1.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Request a Pickup</span>
              <ArrowRight className="w-3 h-3 text-emerald-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 5 & 6 & 7. HERO SECTION (Two-Column Layout) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200/80 text-forest-900 text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                Smart Waste Coordination
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-slate-900 leading-[1.08]">
                Smarter Disposal.<br />
                <span className="text-[#1B4332]">Smarter Collection.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                WasteWise helps citizens understand what to do with their waste while giving waste-management teams the tools to prioritize and coordinate collection.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onSelectRole('user');
                    onNavigate('triage');
                  }}
                  className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Request a Pickup</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors shadow-2xs"
                >
                  See How It Works
                </button>
              </div>

              <p className="text-xs text-slate-500 pt-1 font-medium">
                Built for smarter, more responsible urban waste collection.
              </p>
            </div>

            {/* Right: Realistic Product UI Composition */}
            <div className="lg:col-span-6 relative">
              {/* Primary Citizen Triage Mockup */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-4 max-w-md mx-auto lg:max-w-none">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
                    <span className="text-xs font-semibold text-slate-900">WasteWise Triage</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-400">Citizen Portal</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What are you getting rid of?
                  </label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 flex items-center justify-between">
                    <span>"Old laptop + batteries"</span>
                    <span className="text-[10px] text-forest-800 font-semibold bg-forest-100/70 px-1.5 py-0.5 rounded">
                      Matched
                    </span>
                  </div>
                </div>

                {/* Segmented Identified Items */}
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] bg-blue-50 text-blue-800 border border-blue-200">
                        E-WASTE
                      </span>
                      <span className="font-medium text-slate-900">Old Laptop</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Recyclable silicon & circuit</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                        HAZARDOUS
                      </span>
                      <span className="font-medium text-slate-900">Batteries (2 units)</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">Lead-acid risk</span>
                  </div>
                </div>

                {/* Warning / Advisory */}
                <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">
                    <strong>Special handling required:</strong> Toxic heavy metals. Do not dispose with general household waste.
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Priority score: <strong className="text-red-700">HIGH (90)</strong></span>
                  <button
                    onClick={() => {
                      onSelectRole('user');
                      onNavigate('schedule-pickup');
                    }}
                    className="px-3.5 py-1.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#15362A] transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Schedule Pickup</span>
                    <ChevronRight className="w-3 h-3 text-emerald-300" />
                  </button>
                </div>
              </div>

              {/* Overlapping Operations Cluster Card */}
              <div className="mt-4 sm:-mt-6 sm:ml-12 bg-white rounded-xl border border-forest-300 p-4 shadow-md max-w-sm ml-auto relative z-10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-forest-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 font-mono">
                      Collection Opportunity
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    Wakad Sector
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  3 nearby pickups can be coordinated into 1 run
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <span>#WW1042</span> · <span>#WW1045</span> · <span>#WW1046</span>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Route lead: Pawan Jadhav</span>
                  <button
                    onClick={() => {
                      onSelectRole('admin');
                      onNavigate('admin-queue');
                    }}
                    className="text-[11px] font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1"
                  >
                    Create Batch →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. PROBLEM SECTION: Waste collection has two sides */}
        <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">The Operational Gap</span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-1">
                Waste collection has two sides.
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Municipal waste breakdown happens when citizen confusion meets disconnected collection logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1: For Citizens */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-slate-200/90 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  For Citizens
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  "What should I do with this?"
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Waste such as e-waste, batteries and bulky items can require different handling, making responsible disposal difficult. Without guidance, hazardous items end up in general landfills.
                </p>
                <div className="pt-2 space-y-2 border-t border-slate-200/80 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Confusion over material segregation and local guidelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>No reliable doorstep service for specialized hazardous items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Lack of visibility into where collected items actually go</span>
                  </div>
                </div>
              </div>

              {/* Column 2: For Operations */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-slate-200/90 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                  For Operations
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  "What should we handle first?"
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Waste-management teams need a better way to prioritize requests and coordinate nearby pickups. Unsorted requests lead to single-truck dispatch runs and overdue pickups.
                </p>
                <div className="pt-2 space-y-2 border-t border-slate-200/80 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>Chronological queues that don't prioritize hazardous or overdue waste</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>Multiple trucks entering the same sector on the same day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>No auditable chain-of-custody tracking for downstream compliance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Statement */}
            <div className="mt-12 text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-800">
                The Solution
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                WasteWise connects both sides.
              </h3>
              <p className="text-sm text-slate-600">
                A unified platform that structures citizen disposal requests at entry and converts them into intelligent, prioritized collection batches for municipal operators.
              </p>
            </div>
          </div>
        </section>

        {/* 9. HOW IT WORKS: 6-Step Visual Process */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
              The Complete Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-1">
              From waste to responsible processing.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A structured six-step workflow replacing traditional, chaotic request dumps.
            </p>
          </div>

          {/* Desktop: Horizontal Timeline / Mobile: Vertical Stack */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {[
              {
                num: '01',
                step: 'IDENTIFY',
                title: 'What do you have?',
                desc: 'Citizen describes waste in natural language or selects stream.'
              },
              {
                num: '02',
                step: 'UNDERSTAND',
                title: 'How to handle it?',
                desc: 'Engine flags hazard precautions and recommended routing.'
              },
              {
                num: '03',
                step: 'PRIORITIZE',
                title: 'What comes first?',
                desc: 'Scoring engine ranks requests by risk, urgency, and wait time.'
              },
              {
                num: '04',
                step: 'BATCH',
                title: 'What clusters?',
                desc: 'Deterministic algorithm groups same-sector requests together.'
              },
              {
                num: '05',
                step: 'COLLECT',
                title: 'Coordinated run',
                desc: 'Assigned crew collects verified doorstep waste with safety gear.'
              },
              {
                num: '06',
                step: 'PROCESS',
                title: 'Track journey',
                desc: 'Downstream delivery to authorized eco-recovery facilities.'
              }
            ].map((s, idx) => (
              <div
                key={s.num}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1B4332]">
                    {s.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase font-semibold text-slate-400">
                    {s.step}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. USP SECTION: More than a pickup request */}
        <section id="citizens" className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                Core Differentiation
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-1">
                More than a pickup request.
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                WasteWise adds intelligence to both sides of the collection workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Block 1: Smart Waste Triage */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-slate-200/90 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    For Citizens
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    Know what your waste needs.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    WasteWise identifies waste streams and highlights when special handling is required.
                  </p>
                </div>

                {/* Triage Visual Transformation Box */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200/80 text-slate-700">
                    <span className="text-[10px] text-slate-400 block font-sans">Input:</span>
                    "Old laptop and two batteries"
                  </div>
                  <div className="flex justify-center text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-blue-50 border border-blue-200 text-blue-900">
                      <strong>Laptop</strong>
                      <span className="block text-[10px] text-blue-700">E-Waste Stream</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                      <strong>Batteries</strong>
                      <span className="block text-[10px] text-amber-700">Hazardous Stream</span>
                    </div>
                  </div>
                  <div className="flex justify-center text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-sans font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Special handling recommended. Scheduled for certified recovery.</span>
                  </div>
                </div>
              </div>

              {/* Block 2: Smart Collection Coordination */}
              <div id="operations" className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-slate-200/90 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                    For Operations
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    Know what needs attention.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    WasteWise uses risk, waiting time, urgency and volume to help operations prioritize and coordinate collection.
                  </p>
                </div>

                {/* Priority Visual Transformation Box */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
                  <div className="p-2.5 bg-red-50/70 border border-red-200 rounded text-red-950 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-red-800 uppercase block font-sans">
                        HIGH PRIORITY · SCORE 90
                      </span>
                      Battery Collection · Wakad
                      <span className="block text-[10px] text-red-700 font-sans mt-0.5">
                        Waiting 2 days · Toxic chemical handling required
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-900 text-[10px] font-bold">
                      URGENT
                    </span>
                  </div>
                  <div className="flex justify-center text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded bg-forest-50 border border-forest-200 text-forest-900 text-[11px] font-sans font-medium flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-forest-700" />
                      <span>3 nearby requests in Wakad can be coordinated</span>
                    </div>
                    <span className="text-[10px] font-bold text-forest-800 uppercase font-mono">
                      1 Run
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. SMART BATCHING VISUAL */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
              Logistics Optimization
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-1">
              Turn scattered requests into coordinated collection.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Better coordination. Fewer single-truck trips.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-subtle max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
              {/* Before Column */}
              <div className="md:col-span-5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Before: Scattered Requests
                  </span>
                  <span className="text-[10px] text-slate-400">3 Separate Trips</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Wakad Sector</span>
                    <span className="font-mono text-slate-400">#WW1042</span>
                  </div>
                  <div className="text-[11px] text-slate-500">2 Inverter batteries · Hazardous</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Wakad Sector</span>
                    <span className="font-mono text-slate-400">#WW1045</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Dell laptop & charger · E-Waste</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Wakad Sector</span>
                    <span className="font-mono text-slate-400">#WW1046</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Sorted clean PET plastics · 12 kg</div>
                </div>
              </div>

              {/* Transformation Icon */}
              <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                <div className="w-8 h-8 rounded-full bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-xs">
                  ➔
                </div>
              </div>

              {/* After Column */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-forest-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                    After: Coordinated Batch
                  </span>
                  <span className="text-[10px] font-semibold text-forest-800 bg-forest-50 px-1.5 py-0.5 rounded border border-forest-200">
                    Single Coordinated Run
                  </span>
                </div>
                <div className="p-4 bg-forest-50/60 border border-forest-300 rounded-xl text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-forest-800 uppercase font-mono block">
                        Batch B-003 · Wakad Zone
                      </span>
                      <span className="font-semibold text-sm text-slate-900">3 Doorstep Pickups Combined</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-forest-900 bg-white px-2 py-0.5 rounded border border-forest-200">
                      1 Trip
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 border-t border-forest-200/60 pt-2 space-y-1">
                    <div><strong>Driver Lead:</strong> Pawan Jadhav (Specialized Crew)</div>
                    <div><strong>Assigned Vehicle:</strong> MH-12-WW-4028 (Multi-compartment)</div>
                    <div><strong>Scheduled Window:</strong> Tomorrow, 04:00 PM - 06:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. PRODUCT PREVIEW SECTION: One platform. Two workflows */}
        <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                Unified Ecosystem
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-1">
                One platform. Two workflows.
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Purpose-built interfaces tailored for citizen convenience and municipal operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Workflow 1: Citizen Portal */}
              <div className="bg-[#F8F9FA] rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Citizen Workflow
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 text-xs font-medium border border-slate-200">
                    Doorstep Service
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Citizen Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Citizens access straightforward waste guidance, schedule pickups using saved locations, and track real-time recovery custody.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Smart Waste Triage:</strong> Natural language material parsing</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Pickup Scheduling:</strong> Saved locations & slot windows</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Live Tracking:</strong> Real-time status with slot rescheduling</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Waste Journey:</strong> Downstream circular recovery certificates</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectRole('user');
                    onNavigate('user-dashboard');
                  }}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Explore Citizen Portal</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
              </div>

              {/* Workflow 2: Operations Command Center */}
              <div className="bg-[#F8F9FA] rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                    Operations Workflow
                  </span>
                  <span className="px-2 py-0.5 rounded bg-forest-100 text-forest-900 text-xs font-semibold border border-forest-200">
                    Municipal Dispatch
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Operations Command Center</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Municipal supervisors monitor live sector demand, inspect requests via slide-out drawer, and trigger cluster batches with driver dispatch.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Priority Queue:</strong> Mathematical scoring factoring risk & wait</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Smart Batching:</strong> Cluster opportunities with 1-click formation</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Operations Table:</strong> Slide-out inspection & custody status</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-forest-700" />
                    <span><strong>Analytics & Metrics:</strong> Stream distribution & on-time compliance</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectRole('admin');
                    onNavigate('admin-dashboard');
                  }}
                  className="w-full py-2.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Open Operations Command</span>
                  <ArrowRight className="w-3 h-3 text-emerald-300" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 13. IMPACT SECTION (Pilot / Demo Data) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
              Pilot / Demo Data
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2">
              Pune Municipal Pilot Metrics
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active operational dataset across Wakad, Hinjewadi, Baner, Aundh, and Pimple Saudagar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-2xs">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">15+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Active Requests</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-2xs">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-forest-800">83%</div>
              <div className="text-xs text-slate-500 font-medium mt-1">On Schedule</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-2xs">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">3</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Collection Batches</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-2xs">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-forest-800">8</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Waste Streams</div>
            </div>
          </div>
        </section>

        {/* 14. FINAL CTA */}
        <section className="bg-white border-t border-slate-200/80 py-16 sm:py-20 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-[#1B4332] flex items-center justify-center mx-auto shadow-2xs">
              <Leaf className="w-5 h-5 text-forest-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                Ready to dispose responsibly?
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Find the right way to handle your waste and schedule a collection.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectRole('user');
                  onNavigate('triage');
                }}
                className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Request a Pickup</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
              <button
                onClick={() => {
                  onSelectRole('user');
                  onNavigate('login');
                }}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 15. FOOTER */}
      <footer className="border-t border-slate-200 bg-[#F8F9FA] py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">♻ WasteWise</span>
            <span className="text-slate-300">|</span>
            <span>Smarter Disposal. Smarter Collection.</span>
          </div>

          <div className="flex items-center gap-5 text-slate-600">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-slate-900 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('citizens')} className="hover:text-slate-900 transition-colors">
              Citizens
            </button>
            <button onClick={() => scrollTo('operations')} className="hover:text-slate-900 transition-colors">
              Operations
            </button>
            <button
              onClick={() => {
                onSelectRole('user');
                onNavigate('login');
              }}
              className="hover:text-slate-900 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 mt-4 border-t border-slate-200/60 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Pune Pilot Deployment: Wakad · Hinjewadi · Baner · Aundh · Pimple Saudagar</span>
          <span>Civic Waste Logistics & Downstream Custody Architecture</span>
        </div>
      </footer>
    </div>
  );
};
