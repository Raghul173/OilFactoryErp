import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export const GoogleOAuthModal = ({ isOpen, onClose }) => {
  const { loginWithGmail } = useAuth();

  const [step, setStep] = useState(1); // 1: Email, 2: Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Enter a valid email address or phone number');
      return;
    }
    setStep(2);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Enter your password');
      return;
    }
    // Perform standard Google authentication flow with specified Gmail
    loginWithGmail(email, password);
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden text-slate-900 dark:text-white">
        
        {/* Top Google Logo */}
        <div className="flex justify-between items-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.05.0 12s.47 3.8 1.29 5.42l3.99-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
          >
            Close
          </button>
        </div>

        {/* STEP 1: Email / Phone Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">to continue to OilSync ERP</p>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/30">
                {error}
              </p>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Email or phone"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-500 transition-all font-medium"
                />
                <div className="mt-2 text-left">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-blue-600 dark:text-amber-400 font-semibold hover:underline">
                    Forgot email?
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                To continue, Google will share your name, email address, language preference, and profile picture with OilSync ERP.
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setError('Account creation managed by Administrator')}
                  className="text-xs text-blue-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Create account
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Password Input */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome</h2>
              <button
                type="button"
                onClick={handleReset}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              >
                <span>{email}</span>
                <span className="text-[10px] text-blue-600 dark:text-amber-400">Change</span>
              </button>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/30">
                {error}
              </p>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full p-4 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-amber-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Show password</span>
                </label>

                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-blue-600 dark:text-amber-400 font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:underline"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 flex justify-between border-t border-slate-100 dark:border-slate-800">
          <span>English (United States)</span>
          <div className="flex gap-3">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Help</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Terms</a>
          </div>
        </div>

      </div>
    </div>
  );
};
