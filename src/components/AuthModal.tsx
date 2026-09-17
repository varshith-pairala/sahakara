import React, { useState } from 'react';
import { ShieldCheck, User, Wrench, Building2, Phone, Lock, MapPin, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Database as DbIcon } from 'lucide-react';
import { UserRole, UserAccount, Language } from '../types';
import { t } from '../translations';

interface AuthModalProps {
  currentLang: Language;
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentLang,
  isOpen,
  onSuccess,
  onClose,
}) => {
  if (!isOpen) return null;
  const strings = t[currentLang];

  // Mode: 'register' (Account Create) or 'login' (Sign In)
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('Hyderabad');
  const [workerTrade, setWorkerTrade] = useState('Electrician');
  const [societyName, setSocietyName] = useState('Telangana Shramik Sahakara Sangham (LCS-HYD)');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const trades = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Domestic Helper',
    'Caregiver',
    'Driver',
    'Gardener',
    'Cleaner',
    'Technician',
  ];

  const handleQuickDemoLogin = (role: UserRole) => {
    let demoUser: UserAccount;
    if (role === 'worker') {
      demoUser = {
        id: 'USR-WRK-101',
        name: 'G. Ravi Kumar (Master Electrician)',
        phone: '+91 94401 82349',
        email: 'ravi.kumar@shramikcoop.in',
        role: 'worker',
        district: 'Hyderabad',
        workerTrade: 'Electrician',
        societyName: 'Telangana Shramik Sahakara Sangham',
        workerId: 'WRK-101',
      };
    } else if (role === 'federation') {
      demoUser = {
        id: 'USR-FED-001',
        name: 'Sri K. Satyanarayana (Deputy Registrar)',
        phone: '+91 94400 12040',
        email: 'coop.commissioner@telangana.gov.in',
        role: 'federation',
        district: 'Telangana State Federation HQ, Hyderabad',
      };
    } else {
      demoUser = {
        id: 'USR-CIT-001',
        name: 'M. Vamsi Krishna (Citizen)',
        phone: '+91 98480 23145',
        email: 'vamsi.krishna@gmail.com',
        role: 'citizen',
        district: 'Hyderabad',
      };
    }

    localStorage.setItem('sahakarseva_user', JSON.stringify(demoUser));
    onSuccess(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMsg('Please enter your Full Name.');
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          setErrorMsg('Please enter your Mobile Number.');
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setErrorMsg('Password is strictly required. Please choose a secure password (at least 6 characters).');
          setLoading(false);
          return;
        }
        if (password.trim().length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match! Please check and confirm your password.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            password: password.trim(),
            role: selectedRole,
            district,
            workerTrade: selectedRole === 'worker' ? workerTrade : undefined,
            societyName: selectedRole === 'worker' ? societyName : undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        localStorage.setItem('sahakarseva_user', JSON.stringify(data.user));
        onSuccess(data.user);
      } else {
        // Login mode
        if (!phone.trim()) {
          setErrorMsg('Please enter your registered Mobile Number or Email.');
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setErrorMsg('Please enter your account password to sign in.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneOrEmail: phone.trim(),
            password: password.trim(),
            role: selectedRole,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem('sahakarseva_user', JSON.stringify(data.user));
        onSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            id="auth-modal-close-btn"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            title="Close and continue as guest"
          >
            ✕
          </button>
        )}

        {/* Cooperative Platform Emblem */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="pr-8">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                {strings.brandName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Cooperative Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Registered Multi-State Labour Cooperative Federation Portal
            </p>
          </div>
        </div>

        {/* Quick Role Switch for Evaluation / Testing */}
        <div className="mb-5 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Portal Roles (1-Click Access)</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Instant Switch</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              id="demo-btn-citizen"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-semibold text-center transition-all cursor-pointer shadow-xs"
            >
              <div className="font-bold text-[11px]">👤 Citizen</div>
              <div className="text-[9px] text-slate-500 truncate">Vamsi Krishna</div>
            </button>
            <button
              type="button"
              id="demo-btn-worker"
              onClick={() => handleQuickDemoLogin('worker')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-semibold text-center transition-all cursor-pointer shadow-xs"
            >
              <div className="font-bold text-[11px]">🛠️ Artisan</div>
              <div className="text-[9px] text-slate-500 truncate">Ravi (Electrician)</div>
            </button>
            <button
              type="button"
              id="demo-btn-federation"
              onClick={() => handleQuickDemoLogin('federation')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-semibold text-center transition-all cursor-pointer shadow-xs"
            >
              <div className="font-bold text-[11px]">🏛️ Federation</div>
              <div className="text-[9px] text-slate-500 truncate">Registrar Officer</div>
            </button>
          </div>
        </div>

        {/* Tab Selector: Create Account vs Login */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'register'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account (Register)
          </button>
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Already a User? Sign In
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Persona Role Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="role-select-citizen"
              onClick={() => setSelectedRole('citizen')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'citizen'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
              <div className="text-[11px]">Household</div>
            </button>
            <button
              type="button"
              id="role-select-worker"
              onClick={() => setSelectedRole('worker')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'worker'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
              <div className="text-[11px]">Coop Worker</div>
            </button>
            <button
              type="button"
              id="role-select-federation"
              onClick={() => setSelectedRole('federation')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'federation'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
              <div className="text-[11px]">Federation</div>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="auth-name-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra / Lakshmi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                id="auth-phone-input"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98490 12345"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                District / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="auth-district-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                >
                  <option value="Hyderabad & Cyberabad">Hyderabad & Cyberabad</option>
                  <option value="Ranga Reddy Cluster">Ranga Reddy Cluster</option>
                  <option value="Visakhapatnam Urban">Visakhapatnam Urban</option>
                  <option value="Vijayawada & Amaravati">Vijayawada & Amaravati</option>
                  <option value="Warangal Tri-Cities">Warangal Tri-Cities</option>
                </select>
              </div>
            </div>
          )}

          {mode === 'register' && selectedRole === 'worker' && (
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">
                  Primary Skilled Trade
                </label>
                <select
                  id="auth-worker-trade"
                  value={workerTrade}
                  onChange={(e) => setWorkerTrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-slate-900 bg-white"
                >
                  {trades.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-emerald-900 mb-1">
                  Primary Labour Cooperative Society (LCS)
                </label>
                <input
                  type="text"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-slate-900 bg-white text-xs"
                />
                <span className="text-[10px] text-emerald-700 block mt-1">
                  ✓ Entitled to 90% direct fair wages + 5% welfare cess accumulation
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">
                Password <span className="text-rose-500 font-bold">*</span>{' '}
                <span className="text-[10px] text-slate-400 font-normal">(Min. 6 characters)</span>
              </label>
              {password.length > 0 && password.length < 6 && (
                <span className="text-[10px] text-rose-600 font-medium">Need {6 - password.length} more chars</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="auth-password-input"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-confirm-password-input"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-slate-900 text-xs focus:outline-hidden focus:ring-2 ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[10px] text-rose-600 mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          {/* Persistent Database Security Notice */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] text-slate-600">
            <DbIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>SQLite Persistent Database Engine Active — Credentials safely encrypted on disk.</span>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-60 mt-4"
          >
            <span>
              {loading
                ? 'Verifying...'
                : mode === 'register'
                ? 'Create SahakarSeva Account'
                : 'Sign In to Cooperative Portal'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle text */}
        <div className="text-center mt-4 text-xs text-slate-500">
          {mode === 'register' ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 font-bold underline hover:text-emerald-800 cursor-pointer"
              >
                Sign In here
              </button>
            </span>
          ) : (
            <span>
              New to SahakarSeva?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold underline hover:text-emerald-800 cursor-pointer"
              >
                Create an Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
