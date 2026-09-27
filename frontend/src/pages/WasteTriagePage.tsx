import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Recycle,
  Apple,
  FileText,
  Armchair,
  Package,
  Wine,
  HelpCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { TriageResponse, WasteCategory } from '../types';

interface WasteTriagePageProps {
  onSchedulePickup: (triageData: {
    category: WasteCategory;
    items_description: string;
    special_handling: boolean;
    guidance: string;
  }) => void;
}

export const WasteTriagePage: React.FC<WasteTriagePageProps> = ({ onSchedulePickup }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);

  const sampleQueries = [
    "Old laptop and two batteries",
    "Broken smartphone, charger and power bank",
    "Empty primer paint cans and solvent bottle",
    "Bundled corrugated cardboard boxes and paper",
    "Kitchen food vegetable peels and garden prunings",
    "Discarded 3-seater sofa and study desk",
    "Broken window glass panes and jars"
  ];

  const categoriesList: { name: WasteCategory; icon: any; desc: string }[] = [
    { name: 'E-Waste', icon: Cpu, desc: 'Laptops, phones, cables, screens' },
    { name: 'Hazardous', icon: Flame, desc: 'Batteries, chemicals, paint, meds' },
    { name: 'Plastic', icon: Recycle, desc: 'Bottles, containers, wraps' },
    { name: 'Organic', icon: Apple, desc: 'Food waste, compostable greens' },
    { name: 'Paper', icon: FileText, desc: 'Cardboard, newspapers, office' },
    { name: 'Bulk Waste', icon: Armchair, desc: 'Sofas, furniture, appliances' },
    { name: 'Metal', icon: Package, desc: 'Cans, brass fittings, scrap copper' },
    { name: 'Glass', icon: Wine, desc: 'Bottles, jars, broken cullet' },
  ];

  const handleTriage = async (textToIdentify: string) => {
    if (!textToIdentify.trim()) return;
    setLoading(true);
    setInputText(textToIdentify);
    try {
      const data = await api.triage(textToIdentify);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat: WasteCategory) => {
    handleTriage(`Disposal for ${cat} materials`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          Smart Waste Triage Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          What are you getting rid of?
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Describe what you have or pick a category. We will classify the hazard level, provide handling guidance, and prepare the right collection route.
        </p>
      </div>

      {/* Main Large Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-4">
        <label htmlFor="triage-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Describe your waste items in natural language
        </label>
        <div className="relative">
          <textarea
            id="triage-input"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTriage(inputText);
              }
            }}
            placeholder='e.g., "I have an old laptop and two batteries" or "cardboard packaging boxes and paint cans"'
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 p-4 pb-14 bg-slate-50/60 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 transition-all resize-none"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={() => handleTriage(inputText)}
              disabled={loading || !inputText.trim()}
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Identify Waste</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Example Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-medium text-slate-400">Quick Test Prompts (Click to run):</div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleTriage(sample)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100/80 hover:bg-forest-50 hover:text-forest-900 text-slate-600 border border-slate-200/60 transition-colors text-left"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Identified Triage Result (Visual Centerpiece) */}
      {result && (
        <div className="bg-white rounded-2xl border border-forest-200/90 p-6 shadow-elevated space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest-800 font-bold">
                  Identified Primary Category
                </span>
                <h3 className="text-lg font-bold text-slate-900">{result.primary_category}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                result.suggested_priority === 'HIGH'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : result.suggested_priority === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {result.suggested_priority} Priority Handling
              </span>
            </div>
          </div>

          {/* Breakdown of Segregated Waste Items Detected */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Segregated Items Detected ({result.identified_items.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.identified_items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    item.special_handling
                      ? 'bg-amber-50/40 border-amber-200/80'
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {item.item_name}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.handling_guidance}
                  </p>
                  {item.special_handling && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Special Handling Protocol Required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Handling Warning Banner */}
          {result.is_special_handling ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold text-amber-950 uppercase tracking-wide">
                  Special Handling Mandatory
                </h5>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Do not place these items with general household waste. Regulated hazardous or e-waste recycling pathways apply to prevent soil & groundwater contamination.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold text-emerald-950 uppercase tracking-wide">
                  Standard Recyclable Stream
                </h5>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Rinse and dry items before collection. These will be consolidated into community recycling rounds.
                </p>
              </div>
            </div>
          )}

          {/* Recommended Action Card & CTA */}
          <div className="p-4 rounded-xl bg-forest-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-emerald-300 font-mono uppercase tracking-wider block">
                Recommended Action
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">{result.recommended_action}</p>
            </div>
            <button
              onClick={() => {
                onSchedulePickup({
                  category: result.primary_category,
                  items_description: result.query || result.primary_category,
                  special_handling: result.is_special_handling,
                  guidance: result.summary_guidance
                });
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
            >
              <span>Schedule Pickup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Or Choose a Category */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Or Choose a Category Directly
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="p-3.5 bg-white hover:bg-forest-50/60 rounded-xl border border-slate-200/80 hover:border-forest-300 transition-all text-left shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-forest-100 text-slate-700 group-hover:text-forest-800 flex items-center justify-center mb-2.5 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">{cat.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
