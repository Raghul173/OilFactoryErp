import React from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, X, User } from 'lucide-react';

export const JWTInspectorModal = () => {
  const { jwtToken, user, showJWTModal, setShowJWTModal } = useAuth();

  if (!showJWTModal || !jwtToken) return null;

  const parts = jwtToken.split('.');
  let header = {};
  let payload = {};
  try {
    header = parts[0] ? JSON.parse(atob(parts[0])) : {};
    payload = parts[1] ? JSON.parse(atob(parts[1])) : {};
  } catch (err) {
    console.warn('Could not decode JWT parts:', err);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={() => setShowJWTModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
            <KeyRound className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Active JWT Bearer Token Inspector
              <span className="text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Verified
              </span>
            </h3>
            <p className="text-xs text-slate-500">Authenticated via OilSync Node.js Auth Service</p>
          </div>
        </div>

        {/* User Identity Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-xs">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Decoded Token Structure */}
        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-600 font-sans font-semibold mb-1 block">Header (Alg & Typ)</label>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-blue-300 overflow-x-auto">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>

          <div>
            <label className="text-slate-600 font-sans font-semibold mb-1 block">Payload (User Identity & Claims)</label>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-300 overflow-x-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          <div>
            <label className="text-slate-600 font-sans font-semibold mb-1 block">Raw Encoded JWT String</label>
            <p className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 break-all select-all">
              {jwtToken}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowJWTModal(false)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
