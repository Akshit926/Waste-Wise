import React, { useState } from 'react';
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PUNE_AREAS = [
  'Wakad', 'Hinjewadi', 'Baner', 'Aundh', 'Pimple Saudagar',
  'Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hadapsar', 'Kondhwa', 'Other'
];

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    area: 'Wakad'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.phone.trim()) return 'Phone number is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      area: form.area
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => onRegisterSuccess(), 2200);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-forest-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Account created successfully.</h2>
          <p className="text-sm text-slate-600">Welcome to WasteWise, {form.name.split(' ')[0]}.</p>
          <p className="text-xs text-slate-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4 flex items-center gap-2.5">
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mr-2"
          aria-label="Back to sign in"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center shadow-sm">
          <Leaf className="w-4 h-4 text-emerald-300" />
        </div>
        <span className="font-semibold text-slate-900 text-sm tracking-tight">WasteWise</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Create account</h1>
            <p className="text-sm text-slate-500">Join WasteWise as a Citizen</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700">Full Name</label>
              <input
                id="reg-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Akshit Sharma"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-medium text-slate-700">Email</label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-700">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+91 98221 00000"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all"
              />
            </div>

            {/* Area */}
            <div className="space-y-1.5">
              <label htmlFor="reg-area" className="block text-xs font-medium text-slate-700">Area</label>
              <select
                id="reg-area"
                value={form.area}
                onChange={handleChange('area')}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all appearance-none"
              >
                {PUNE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-confirm" className="block text-xs font-medium text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Re-enter password"
                  required
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 transition-all pr-10 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-slate-300 focus:border-forest-600'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role notice */}
            <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
              <span>New accounts are registered as <strong>Citizens</strong>. Operations Admin access is granted by your municipal coordinator.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></>
                : <span>Create Account</span>
              }
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="text-forest-800 font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
