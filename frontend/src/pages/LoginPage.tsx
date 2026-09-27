import React, { useState } from 'react';
import { Leaf, Eye, EyeOff, AlertCircle, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateRegister }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<'citizen' | 'admin' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleDemoLogin = async (role: 'citizen' | 'admin') => {
    setDemoLoading(role);
    await new Promise(r => setTimeout(r, 400)); // Brief UX delay
    loginAsDemo(role);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center shadow-sm">
          <Leaf className="w-4 h-4 text-emerald-300" />
        </div>
        <span className="font-semibold text-slate-900 text-sm tracking-tight">WasteWise</span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Sign in</h1>
            <p className="text-sm text-slate-500">Smarter Disposal. Smarter Collection.</p>
          </div>

          {/* Demo Access Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Demo Access</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('citizen')}
                disabled={!!demoLoading || loading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-forest-300 hover:bg-forest-50 transition-all text-xs font-medium text-slate-700 hover:text-forest-900 disabled:opacity-60 group"
              >
                {demoLoading === 'citizen'
                  ? <Loader2 className="w-5 h-5 text-forest-700 animate-spin" />
                  : <User className="w-5 h-5 text-slate-500 group-hover:text-forest-700 transition-colors" />
                }
                <span>Continue as Citizen</span>
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={!!demoLoading || loading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-xs font-medium text-slate-700 hover:text-emerald-900 disabled:opacity-60 group"
              >
                {demoLoading === 'admin'
                  ? <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
                  : <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-emerald-700 transition-colors" />
                }
                <span>Continue as Admin</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              citizen@wastewise.demo / demo123 &nbsp;·&nbsp; admin@wastewise.demo / admin123
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or sign in with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-700">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/30 focus:border-forest-600 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-forest-700 focus:ring-forest-600/30"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 bg-[#1B4332] hover:bg-[#15362A] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></>
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-forest-800 font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400">
        WasteWise · Pune Civic Logistics Platform · Hackathon Demo
      </footer>
    </div>
  );
};
