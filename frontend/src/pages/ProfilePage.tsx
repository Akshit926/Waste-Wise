import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Building2,
  BadgeCheck, Edit3, Check, X, Plus, Home, BookOpen, Briefcase
} from 'lucide-react';
import { useAuth, SavedLocation } from '../context/AuthContext';

const PUNE_AREAS = [
  'Wakad', 'Hinjewadi', 'Baner', 'Aundh', 'Pimple Saudagar',
  'Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hadapsar', 'Kondhwa', 'Other'
];

const LOCATION_ICONS: Record<string, React.ElementType> = {
  Home, College: BookOpen, Office: Briefcase, Other: MapPin
};

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, addSavedLocation } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    area: user?.area || 'Wakad'
  });
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<{ label: 'Home' | 'College' | 'Office' | 'Other'; address: string; area: string }>({
    label: 'Home', address: '', area: user?.area || 'Wakad'
  });
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ name: editForm.name, phone: editForm.phone, area: editForm.area });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddLocation = () => {
    if (!newLocation.address.trim()) return;
    addSavedLocation(newLocation);
    setShowAddLocation(false);
    setNewLocation({ label: 'Home', address: '', area: user.area || 'Wakad' });
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.role === 'citizen' ? 'Citizen Account' : 'Operations Admin Account'}
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-forest-800 bg-forest-50 border border-forest-200 px-3 py-1.5 rounded-lg">
            <Check className="w-3.5 h-3.5" />
            Profile updated
          </div>
        )}
      </div>

      {/* Avatar + Identity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-lg shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{user.name}</h2>
            {user.role === 'admin' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-forest-800 rounded">
                OPS
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="text-xs text-slate-400 mt-1">Member since {user.memberSince}</p>
        </div>
        {user.role === 'citizen' && !editing && (
          <button
            onClick={() => { setEditing(true); setEditForm({ name: user.name, phone: user.phone || '', area: user.area || '' }); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
        </div>
        <div className="p-5 space-y-4">
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Full Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Phone</label>
                <input
                  value={editForm.phone}
                  onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Area</label>
                <select
                  value={editForm.area}
                  onChange={e => setEditForm(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                >
                  {PUNE_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold transition-colors">
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="space-y-3">
              {user.role === 'citizen' ? (
                <>
                  <ProfileRow icon={User} label="Name" value={user.name} />
                  <ProfileRow icon={Mail} label="Email" value={user.email} />
                  <ProfileRow icon={Phone} label="Phone" value={user.phone || '—'} />
                  <ProfileRow icon={MapPin} label="Area" value={user.area ? `${user.area}, Pune` : '—'} />
                  <ProfileRow icon={Calendar} label="Member Since" value={user.memberSince} />
                </>
              ) : (
                <>
                  <ProfileRow icon={User} label="Name" value={user.name} />
                  <ProfileRow icon={Shield} label="Role" value="Operations Admin" />
                  <ProfileRow icon={Building2} label="Assigned Zone" value={user.assignedZone || '—'} />
                  <ProfileRow icon={BadgeCheck} label="Employee ID" value={user.employeeId || '—'} />
                  <ProfileRow icon={Calendar} label="Member Since" value={user.memberSince} />
                </>
              )}
            </dl>
          )}
        </div>
      </div>

      {/* Saved Locations — Citizen only */}
      {user.role === 'citizen' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Saved Pickup Locations</h3>
            <button
              onClick={() => setShowAddLocation(!showAddLocation)}
              className="flex items-center gap-1.5 text-xs font-medium text-forest-800 hover:text-forest-900"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Location
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {(user.savedLocations || []).map(loc => {
              const Icon = LOCATION_ICONS[loc.label] || MapPin;
              return (
                <div key={loc.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-forest-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900">{loc.label}</div>
                    <div className="text-[11px] text-slate-500 truncate">{loc.address} · {loc.area}</div>
                  </div>
                </div>
              );
            })}
            {(user.savedLocations || []).length === 0 && (
              <div className="px-5 py-6 text-center text-xs text-slate-400">
                No saved locations yet. Add your home or office for faster scheduling.
              </div>
            )}
          </div>

          {/* Add Location Form */}
          {showAddLocation && (
            <div className="px-5 py-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Label</label>
                  <select
                    value={newLocation.label}
                    onChange={e => setNewLocation(prev => ({ ...prev, label: e.target.value as any }))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                  >
                    {['Home', 'College', 'Office', 'Other'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">Area</label>
                  <select
                    value={newLocation.area}
                    onChange={e => setNewLocation(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                  >
                    {PUNE_AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Address</label>
                <input
                  value={newLocation.address}
                  onChange={e => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Flat 402, Green Olive Society"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleAddLocation} className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 text-white rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors">
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => setShowAddLocation(false)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function ProfileRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <dt className="flex items-center gap-2 w-32 shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-500">{label}</span>
      </dt>
      <dd className="text-xs font-medium text-slate-900">{value}</dd>
    </div>
  );
}
