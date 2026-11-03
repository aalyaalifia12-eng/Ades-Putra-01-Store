'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { User as UserType } from '@/types';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
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
        setError(data.error || 'Gagal masuk akun.');
        setLoading(false);
        return;
      }

      // Store current user session in localStorage
      localStorage.setItem('ades_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: UserType = {
      id: 'guest',
      name: 'Tamu (Guest)',
      email: 'guest@adesstore.com',
      phone: '081200000000',
      role: 'CUSTOMER',
      isVip: false,
      memberPoints: 0,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('ades_user', JSON.stringify(guestUser));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
          </div>
          <div className="text-left">
            <span className="font-black text-2xl text-slate-900 tracking-tight block leading-tight">
              Ades Store 01
            </span>
            <span className="text-[11px] text-red-600 font-extrabold">
              Langkah Nyaman, Gaya Maksimal Setiap Hari
            </span>
          </div>
        </Link>
        <h2 className="text-xl font-black text-slate-900 pt-2">
          {isRegisterMode ? 'Daftar Akun Member Baru' : 'Masuk Akun Member Pelanggan'}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Nikmati kemudahan belanja sepatu, sandal, dan tas dengan harga promo langsung serta cashback koin member.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/90 sm:px-10 space-y-4">
          {/* Tabs Masuk / Daftar */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                !isRegisterMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                isRegisterMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            {isRegisterMode && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nomor WhatsApp atau Alamat Email:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="08123456789 atau nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi:
                </label>
                {!isRegisterMode && (
                  <span className="text-[11px] text-red-600 hover:underline cursor-pointer">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Memproses...' : isRegisterMode ? 'Daftar Akun Baru &rarr;' : 'Masuk Akun Sekarang &rarr;'}</span>
            </button>
          </form>

          {/* Guest Login Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <User className="w-4 h-4 text-amber-500" />
              <span>Masuk sebagai Tamu (Guest)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>

            <Link
              href="/admin/login"
              className="text-slate-700 hover:text-red-600 font-bold flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Akses Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}