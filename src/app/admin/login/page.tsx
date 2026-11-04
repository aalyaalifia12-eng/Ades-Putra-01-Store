'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  KeyRound,
  Mail,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
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
        setError(data.error || 'Akses ditolak. Periksa kembali kredensial Anda.');
        setLoading(false);
        return;
      }

      localStorage.setItem('ades_admin', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-red-500 mx-auto shadow-lg shadow-red-500/20 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal Administrator Ades Store 01
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Manajemen Stok &amp; Notifikasi Pesanan Masuk
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border-2 border-red-500 sm:px-10 space-y-5">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ID / Email Administrator / No. HP:
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adesstore01.com atau 082126468980"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 font-mono transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Kata Sandi / PIN Keamanan:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 atau 0101"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 font-mono transition-all"
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
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <span>Masuk Dashboard Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-red-100 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-slate-500 hover:text-red-600 font-bold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Toko Customer</span>
            </Link>

            <span className="text-[10px] text-slate-400 font-mono">
              admin / admin123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
