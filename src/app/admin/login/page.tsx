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
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-zinc-700 mx-auto shadow-xl shadow-red-600/30 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Akses Administrator Ades Store 01
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Sistem Manajemen Internal & Analisis Penjualan Toko
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-6 shadow-2xl rounded-3xl border border-zinc-800 sm:px-10 space-y-5">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Email / ID Administrator:
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adesstore01.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Kata Sandi / PIN Keamanan:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Memverifikasi Akses...' : 'Masuk Dashboard Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white font-medium flex items-center space-x-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Lihat Toko Pelanggan</span>
            </Link>

            <Link
              href="/login"
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Area Member Pelanggan &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
