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
    <div className="min-h-screen flex flex-col justify-between bg-black text-white select-none relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Back button */}
      <div className="relative z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
          <span>SISTEM PENGELOLA</span>
        </div>
      </div>

      {/* Form Card */}
      <main className="relative z-10 flex-1 px-4 py-8 flex flex-col justify-center space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-zinc-700 shadow-md mx-auto flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Akses Pengelola Toko
            </h2>
            <p className="text-[11px] text-zinc-400 font-medium">
              Manajemen Produk, Stok &amp; Analisis Penjualan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Email Administrator:
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adesstore01.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Kata Sandi Admin:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Memverifikasi...' : 'Masuk Dashboard Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-3 border-t border-zinc-900 bg-black/80 text-center">
        <p className="text-[10px] text-zinc-600">
          Ades Store 01 &bull; Internal Control
        </p>
      </footer>
    </div>
  );
}