'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Lock,
  KeyRound,
} from 'lucide-react';

interface AdminLoginScreenProps {
  onBackToLanding: () => void;
}

export default function AdminLoginScreen({ onBackToLanding }: AdminLoginScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Harap masukkan email dan kata sandi admin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password, role: 'admin' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Kredensial Admin tidak cocok.');
        setLoading(false);
        return;
      }

      localStorage.setItem('ades_admin', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 select-none relative overflow-hidden font-sans">
      {/* Top Header with Back button */}
      <div className="relative z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b-2 border-red-500 bg-white shadow-xs">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
            Portal Admin Resmi
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-red-500 p-6 sm:p-8 shadow-xl shadow-red-500/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-red-500 mx-auto shadow-md flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Login Administrator Toko
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ades Putra 01 Store &bull; Kelola Stok &amp; Pesanan Masuk
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ID / Email Admin / No. HP:
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adesstore01.com atau 082126468980"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-100 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Kata Sandi (PIN):
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 atau 0101"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-100 transition-all font-mono"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk Dashboard Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-red-100 text-center">
            <p className="text-[11px] text-slate-400">
              Default ID: <b className="text-slate-700">admin</b> | PIN: <b className="text-slate-700">admin123</b>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        &copy; 2026 Ades Store 01. Hak Cipta Dilindungi.
      </div>
    </div>
  );
}
