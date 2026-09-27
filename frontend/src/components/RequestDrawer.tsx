import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Truck,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Layers
} from 'lucide-react';
import { PickupRequest, RequestStatus } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface RequestDrawerProps {
  request: PickupRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: RequestStatus, notes?: string) => Promise<void>;
}

export const RequestDrawer: React.FC<RequestDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | ''>('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !request) return null;

  const handleStatusChange = async (status: RequestStatus) => {
    setLoading(true);
    await onUpdateStatus(request.id, status, updateNotes);
    setLoading(false);
    setSelectedStatus('');
    setUpdateNotes('');
  };

  const statusOptions: RequestStatus[] = [
    'Requested',
    'Reviewed',
    'Assigned',
    'Scheduled',
    'Out for Pickup',
    'Collected',
    'Processed',
    'Cancelled'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-drawer flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  Request #{request.id}
                </span>
                <PriorityBadge priority={request.priority} size="sm" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mt-1">
                {request.category}: {request.items_description}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-600">
            {/* Status & Priority Highlight Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Current Status</span>
                <StatusBadge status={request.status} />
              </div>
              {request.batch_id && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="font-medium text-slate-500">Assigned Batch</span>
                  <span className="font-mono font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                    {request.batch_id}
                  </span>
                </div>
              )}
            </div>

            {/* Explainable Priority Engine Breakdown (Core USP) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Priority Score: {request.priority_score} / 100
                </span>
                <PriorityBadge priority={request.priority} size="sm" />
              </div>
              <div className="text-[11px] text-slate-500">
                <strong className="text-slate-700">Why this score?</strong>
                <p className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100 font-mono text-slate-700 leading-relaxed">
                  {request.priority_reason}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Citizen Details</h3>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{request.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{request.phone}</span>
                </div>
                {request.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-600">{request.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Pickup Location</h3>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">{request.address}</p>
                    <p className="text-slate-500 text-[11px]">
                      {request.area}, Pune — PIN {request.pin_code}
                    </p>
                    {request.landmark && (
                      <p className="text-slate-400 text-[11px] mt-0.5">Landmark: {request.landmark}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Collection Window</h3>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{request.pickup_date}</span>
                  <span className="text-[11px] text-slate-400">
                    ({request.waiting_days === 0 ? 'Today' : `Waiting ${request.waiting_days} days`})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{request.pickup_slot}</span>
                </div>
              </div>
            </div>

            {/* Waste Journey Log */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Tracking Timeline</h3>
              <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 space-y-3">
                {request.journey.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      ) : step.status === 'in_progress' ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${step.status === 'completed' ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.step}
                        </span>
                        {step.timestamp && (
                          <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Status Updater */}
            <div className="p-4 rounded-xl bg-forest-50/40 border border-forest-100 space-y-3">
              <h4 className="text-xs font-semibold text-forest-900">Operator Quick Action</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={loading || request.status === st}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-colors flex items-center justify-between ${
                      request.status === st
                        ? 'bg-forest-800 text-white border-forest-900 opacity-90'
                        : 'bg-white hover:bg-forest-50/80 text-slate-700 border-slate-200 hover:border-forest-300'
                    }`}
                  >
                    <span>{st}</span>
                    {request.status === st && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Created: {request.created_at.slice(0, 10)}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
