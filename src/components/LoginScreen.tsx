'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AlertCircle,
  User,
  Sparkles,
  ArrowLeft,
  LogIn,
  ShoppingBag,
} from 'lucide-react';
import { User as UserType } from '@/types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserType) => void;
  onGuestLogin: () => void;
  onBackToLanding: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onGuestLogin,
  onBackToLanding,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Harap masukkan nomor WhatsApp atau alamat email Anda.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          role: 'customer',
          name: isRegisterMode && fullName.trim() ? fullName.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal masuk akun. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      localStorage.setItem('ades_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 text-white select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-28 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Back to Landing button */}
      <div className="relative z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-black">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>AREA MEMBER</span>
        </div>
      </div>

      {/* Main Login Form Container */}
      <main className="relative z-10 flex-1 px-4 py-6 flex flex-col justify-center space-y-4">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-zinc-700 shadow-md mx-auto flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              {isRegisterMode ? 'Daftar Akun Pelanggan' : 'Masuk Akun Pelanggan'}
            </h2>
            <p className="text-[11px] text-zinc-400 font-medium">
              &ldquo;Langkah Nyaman, Gaya Maksimal Setiap Hari&rdquo;
            </p>
          </div>
        </div>

        {/* Tab Toggle: Masuk Akun / Daftar Baru */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              !isRegisterMode
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              isRegisterMode
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Pure Professional Form (NO Dummy Presets, NO Portal Word) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegisterMode && (
            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                Nama Lengkap:
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Nomor WhatsApp atau Email:
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="08123456789 atau nama@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-zinc-300">
                Kata Sandi:
              </label>
              {!isRegisterMode && (
                <span className="text-[10px] text-red-400 hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Memproses...'
                : isRegisterMode
                ? 'Daftar Akun Sekarang'
                : 'Masuk Akun Sekarang'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-black uppercase tracking-wider text-zinc-500 absolute">
            atau
          </span>
        </div>

        {/* Guest Alternative */}
        <button
          type="button"
          onClick={onGuestLogin}
          className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-black text-xs tracking-wide flex items-center justify-center space-x-2 transition-all hover:border-zinc-500"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Belanja Sekarang (Tamu)</span>
        </button>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-3 border-t border-zinc-900 bg-black/60 text-center flex flex-col items-center space-y-1">
        <p className="text-[10px] text-zinc-500">
          Aman &bull; Terenkripsi &bull; Ades Store 01
        </p>
        <Link
          href="/admin/login"
          className="text-[10px] text-zinc-500 hover:text-zinc-300 underline decoration-dotted transition-colors"
        >
          Akses Admin
        </Link>
      </footer>
    </div>
  );
}