import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  Package,
  Layers,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { WasteJourneyTimeline } from '../components/WasteJourneyTimeline';

interface TrackPickupPageProps {
  initialRequestId?: string | null;
  onNavigate: (page: string) => void;
  onToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TrackPickupPage: React.FC<TrackPickupPageProps> = ({
  initialRequestId,
  onNavigate,
  onToast
}) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialRequestId || 'WW1042');
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('2026-09-29');
  const [newSlot, setNewSlot] = useState('04:00 PM - 06:00 PM');
  const [rescheduleReason, setRescheduleReason] = useState('Schedule conflict / away from home');
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    if (initialRequestId && data.some(r => r.id === initialRequestId)) {
      setSelectedId(initialRequestId);
    } else if (data.length > 0) {
      setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const currentRequest = requests.find(r => r.id === selectedId) || requests[0];

  const handleConfirmReschedule = async () => {
    if (!currentRequest) return;
    setRescheduling(true);
    try {
      const updated = await api.rescheduleRequest(currentRequest.id, newDate, newSlot, rescheduleReason);
      if (updated) {
        setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        onToast?.(`Pickup #${currentRequest.id} rescheduled to ${newDate} (${newSlot}).`, 'success');
      }
      setIsRescheduleOpen(false);
    } catch (e) {
      console.error(e);
      onToast?.('Failed to reschedule pickup. Please try again.', 'warning');
    } finally {
      setRescheduling(false);
    }
  };

  const canReschedule = currentRequest && ['Requested', 'Reviewed', 'Assigned', 'Scheduled'].includes(currentRequest.status);

  const standardTimeline = [
    { title: 'Request Submitted', desc: 'Received via WasteWise Triage.' },
    { title: 'Request Reviewed', desc: 'Classified & priority assigned by engine.' },
    { title: 'Collector Assigned', desc: 'Grouped into zone route or single-run vehicle.' },
    { title: 'Pickup Scheduled', desc: 'Slot confirmed with collection crew.' },
    { title: 'Out for Pickup', desc: 'Vehicle in transit to your doorstep.' },
    { title: 'Waste Collected', desc: 'Custody handed over to authorized collector.' },
    { title: 'Recycled / Processed', desc: 'Delivered to certified recovery facility.' }
  ];

  // Helper to determine step state
  const getStepStatus = (stepName: string, req: PickupRequest) => {
    const journeyItem = req.journey.find(j => j.step.toLowerCase() === stepName.toLowerCase());
    if (journeyItem) {
      return { status: journeyItem.status, time: journeyItem.timestamp, notes: journeyItem.description };
    }

    // Fallback status order comparison
    const order = [
      'Requested',
      'Reviewed',
      'Assigned',
      'Scheduled',
      'Out for Pickup',
      'Collected',
      'Processed'
    ];
    const currentIndex = order.indexOf(req.status);
    const stepIndex = order.indexOf(stepName);

    if (currentIndex >= stepIndex) {
      return { status: 'completed', time: 'Verified' };
    }
    return { status: 'pending', time: null };
  };

  if (loading || !currentRequest) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        Loading tracking timeline...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar with Request Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Live Request Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time progress from triage review to downstream recycling.
          </p>
        </div>

        {/* Quick Request Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Track another:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            {requests.map(r => (
              <option key={r.id} value={r.id}>
                #{r.id} - {r.category} ({r.area})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Request Header Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold text-slate-900 font-mono">
                #{currentRequest.id}
              </span>
              <PriorityBadge priority={currentRequest.priority} size="sm" />
              <StatusBadge status={currentRequest.status} />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-1">
              {currentRequest.category}: {currentRequest.items_description}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentRequest.batch_id && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-forest-50 border border-forest-200 rounded-lg text-xs">
                <Layers className="w-3.5 h-3.5 text-forest-700" />
                <span className="text-slate-600">Assigned Batch:</span>
                <span className="font-semibold text-forest-900 font-mono">{currentRequest.batch_id}</span>
              </div>
            )}
            {canReschedule && (
              <button
                type="button"
                onClick={() => {
                  setNewDate(currentRequest.pickup_date);
                  setNewSlot(currentRequest.pickup_slot);
                  setIsRescheduleOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-forest-700" />
                <span>Reschedule Slot</span>
              </button>
            )}
          </div>
        </div>

        {/* Key Operational Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">{currentRequest.area}, Pune</span>
              <span className="text-[11px] text-slate-500">{currentRequest.address}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">{currentRequest.pickup_date}</span>
              <span className="text-[11px] text-slate-500">{currentRequest.pickup_slot}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Collection Logistics</span>
              <span className="text-[11px] text-slate-500">
                {currentRequest.batch_id ? `Assigned to Batch ${currentRequest.batch_id}` : 'Queued for Route Batching'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Interactive Step Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Custody & Progression Timeline</h3>
          <p className="text-xs text-slate-500">Live operational milestones recorded by municipal dispatch.</p>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {standardTimeline.map((step, idx) => {
            const { status, time, notes } = getStepStatus(step.title, currentRequest);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress' || currentRequest.status.toLowerCase() === step.title.toLowerCase();

            return (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Milestone Node */}
                <div
                  className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-forest-800 text-white shadow-2xs'
                      : isInProgress
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-slate-100 border border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/70">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${isCompleted ? 'text-slate-900' : 'text-slate-600'}`}>
                      {step.title}
                    </span>
                    {time && (
                      <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {time}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {notes || step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Downstream Waste Journey Component */}
      <WasteJourneyTimeline request={currentRequest} />

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800">Change Collection Window</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Reschedule #{currentRequest.id}</h3>
              </div>
              <button onClick={() => setIsRescheduleOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">New Pickup Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Time Window</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Reason for Adjustment</label>
                <select
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                >
                  <option value="Schedule conflict / away from home">Schedule conflict / away from home</option>
                  <option value="Need more time to gather items">Need more time to gather items</option>
                  <option value="Postponed household relocation">Postponed household relocation</option>
                  <option value="Other convenience preference">Other convenience preference</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={rescheduling}
                className="flex-1 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {rescheduling ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Confirm Slot'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
