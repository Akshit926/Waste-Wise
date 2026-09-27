import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  Package,
  Layers,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { WasteCategory, PickupRequest } from '../types';

interface SchedulePickupPageProps {
  initialData?: {
    category?: WasteCategory;
    items_description?: string;
    special_handling?: boolean;
    guidance?: string;
  };
  onSuccess: (request: PickupRequest) => void;
  onCancel: () => void;
}

export const SchedulePickupPage: React.FC<SchedulePickupPageProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<PickupRequest | null>(null);

  // Form State
  const [category, setCategory] = useState<WasteCategory>(initialData?.category || 'E-Waste');
  const [itemsDescription, setItemsDescription] = useState(
    initialData?.items_description || 'Old laptop and two batteries'
  );
  const [quantity, setQuantity] = useState(2);
  const [quantityUnit, setQuantityUnit] = useState('items');

  // Customer & Location
  const [customerName, setCustomerName] = useState('Akshit Sharma');
  const [phone, setPhone] = useState('+91 98221 00987');
  const [email, setEmail] = useState('akshit@wastewise.io');
  const [address, setAddress] = useState('Flat 402, Rohan Tarang, Datta Mandir Road');
  const [area, setArea] = useState('Wakad');
  const [landmark, setLandmark] = useState('Near Ginger Hotel');
  const [pinCode, setPinCode] = useState('411057');

  // Schedule
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [pickupSlot, setPickupSlot] = useState('04:00 PM - 06:00 PM');
  const [notes, setNotes] = useState('Fragile items. Kept in marked carton.');

  const puneAreas = ['Wakad', 'Hinjewadi', 'Baner', 'Aundh', 'Pimple Saudagar'];
  const categories: WasteCategory[] = [
    'E-Waste',
    'Hazardous',
    'Plastic',
    'Organic',
    'Paper',
    'Bulk Waste',
    'Metal',
    'Glass'
  ];

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  // Priority preview calculation
  const isHighPri = category === 'Hazardous' || category === 'E-Waste' || itemsDescription.toLowerCase().includes('battery');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newReq = await api.createRequest({
        customer_name: customerName,
        phone,
        email,
        address,
        area,
        landmark,
        pin_code: pinCode,
        category,
        items_description: itemsDescription,
        quantity,
        quantity_unit: quantityUnit,
        pickup_date: pickupDate,
        pickup_slot: pickupSlot,
        notes
      });

      // Subtle celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if blocked
      }

      setCreatedRequest(newReq);
      setCurrentStep(6);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    'Category',
    'Details',
    'Quantity',
    'Location',
    'Schedule',
    'Confirmation'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Schedule Waste Pickup
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the required details for specialized doorstep collection.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-2xs">
        {stepsList.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;
          return (
            <div key={stepName} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                  isDone
                    ? 'bg-forest-800 text-white'
                    : isCurrent
                    ? 'bg-forest-100 text-forest-900 border border-forest-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span
                className={`text-xs hidden md:inline font-medium ${
                  isCurrent ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-5">
        {/* Step 1: Category */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Step 1: Waste Stream Category</h3>
              <p className="text-xs text-slate-500">Pick the primary waste category for logistics routing.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    category === cat
                      ? 'bg-forest-50 border-forest-700 text-forest-900 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Waste Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Step 2: Specific Items Description</h3>
              <p className="text-xs text-slate-500">List items so collection team carries proper protective containers.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Items to collect
              </label>
              <textarea
                rows={3}
                value={itemsDescription}
                onChange={(e) => setItemsDescription(e.target.value)}
                placeholder="e.g. Old Dell laptop, charger, and 2 inverter batteries"
                className="w-full text-xs p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Handling Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Kept in cardboard box on balcony"
                className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* Step 3: Quantity */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Step 3: Approximate Volume / Quantity</h3>
              <p className="text-xs text-slate-500">Helps allocate sufficient vehicle space in the collection run.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quantity Value</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                >
                  <option value="items">Items / Units</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="cans">Cans / Containers</option>
                  <option value="bags">Bags / Cartons</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Step 4: Pickup Address in Pune</h3>
              <p className="text-xs text-slate-500">Enables deterministic route clustering with nearby pickups.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Address / Society</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Operational Area Zone</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800 font-medium text-slate-900"
                >
                  {puneAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Schedule */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Step 5: Pickup Date & Preferred Slot</h3>
              <p className="text-xs text-slate-500">Pick an active collection window for your zone.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time Slot Window</label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-800"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Smart Preview Box */}
            <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-forest-900">Predicted Triage Priority:</span>
                <span className={`px-2 py-0.5 rounded font-semibold ${
                  isHighPri ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isHighPri ? 'HIGH PRIORITY' : 'NORMAL PRIORITY'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {isHighPri
                  ? "Contains hazardous components or e-waste. This will be automatically prioritized in the collection queue."
                  : "Standard recyclable stream. Scheduled for coordinated community batch pickup."}
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation Screen */}
        {currentStep === 6 && createdRequest && (
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-forest-700" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-forest-800 uppercase tracking-wider">
                Pickup Request Confirmed
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Request #{createdRequest.id}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your request is registered and entered into the municipal collection queue.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Waste Category:</span>
                <span className="font-semibold text-slate-800">{createdRequest.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Items:</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                  {createdRequest.items_description}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{createdRequest.area}, Pune</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Pickup Window:</span>
                <span className="font-semibold text-slate-800">
                  {createdRequest.pickup_date} · {createdRequest.pickup_slot}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Queue Priority:</span>
                <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {createdRequest.priority} PRIORITY
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onSuccess(createdRequest)}
                className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Track This Pickup</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Pickup Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
