'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Coins,
  ChevronRight,
  Tag,
  Award,
  LogIn,
  UserCheck,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { User } from '@/types';

interface HeroBannerProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  onOpenVipModal: () => void;
  onExploreClick: () => void;
}

export default function HeroBanner({
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenVipModal,
  onExploreClick,
}: HeroBannerProps) {
  // Integrated Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setLoginError('Harap masukkan nomor WhatsApp atau email Anda.');
      return;
    }

    setLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          role: 'customer',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Gagal masuk akun.');
        setLoading(false);
        return;
      }

      localStorage.setItem('ades_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      setIdentifier('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HERO SECTION: FULL LANDING PAGE + SEAMLESS INTEGRATED LOGIN FORM */}
      <div
        id="login-section"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-zinc-800"
      >
        {/* Glow ambient background lights */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Branding, Tagline, & Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-zinc-700 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Ades Store 01"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL STORE RESMI</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                Ades Store <span className="text-red-500">01</span>
              </h1>
              {/* Tagline as specified */}
              <p className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-white">
                &ldquo;Langkah Nyaman, Gaya Maksimal Setiap Hari&rdquo;
              </p>
              <p className="text-xs sm:text-sm font-semibold text-zinc-300">
                Visi: <i>Belanja Pasti Tanpa Ragu: Harga Promo, Kualitas Terbaik, Pengiriman Cepat!</i>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-normal leading-relaxed">
              Temukan kurasi terbaik <b>Sepatu Sneakers & Loafer</b> (Size 36 s/d 43), <b>Sandal Slide Empuk</b>, dan <b>Aneka Tas Fashion</b>. Nikmati harga promo langsung, pengiriman kilat (J&T, JNE, GOTO Instant, Ninja), serta garansi bebas tukar ukuran 7 hari.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all flex items-center space-x-2"
              >
                <span>Lihat Showcase Promo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVipModal}
                className="px-5 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-amber-400/40 text-amber-300 font-extrabold text-xs sm:text-sm transition-all flex items-center space-x-2"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Gabung VIP (Cashback 50k Koin)</span>
              </button>
            </div>

            {/* Value bullets */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-zinc-300 font-medium border-t border-zinc-800/80">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-red-500" />
                <span>Garansi Bebas Tukar Size</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-red-500" />
                <span>Bisa COD / QRIS</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-red-500" />
                <span>Instant Courier GOTO 3 Jam</span>
              </span>
            </div>
          </div>

          {/* RIGHT: SEAMLESS INTEGRATED LOGIN FORM CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 text-slate-900">
              {currentUser ? (
                /* Authenticated State in Hero */
                <div className="space-y-4 py-2">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-2xl border border-red-100">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-extrabold text-red-700">
                        {currentUser.isVip ? 'VIP Member Aktif' : 'Member Terdaftar'}
                      </p>
                      <h3 className="font-black text-base text-slate-900 leading-tight">
                        {currentUser.name}
                      </h3>
                      <p className="text-xs text-slate-500">{currentUser.email || currentUser.phone}</p>
                    </div>
                  </div>

                  {/* Member points indicator */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-300 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🪙</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-900">
                          Saldo Koin Member
                        </span>
                        <p className="text-base font-black text-amber-950">
                          {currentUser.memberPoints.toLocaleString('id-ID')} Poin
                        </p>
                      </div>
                    </div>
                    {!currentUser.isVip && (
                      <button
                        onClick={onOpenVipModal}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-xs"
                      >
                        Upgrade VIP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={onExploreClick}
                    className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lanjut ke Etalase & Mulai Belanja &rarr;</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full py-2 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors text-center"
                  >
                    Ganti Akun / Keluar
                  </button>
                </div>
              ) : (
                /* Pure Professional Login Form (Zero Dummy Presets) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-lg text-slate-900">
                        {isRegisterMode ? 'Daftar Member Baru' : 'Masuk Akun Member'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Akses promo belanja & klaim koin member
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <LogIn className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Switch Masuk / Daftar */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setLoginError(null);
                      }}
                      className={`py-1.5 rounded-lg transition-all ${
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
                        setLoginError(null);
                      }}
                      className={`py-1.5 rounded-lg transition-all ${
                        isRegisterMode
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Daftar Baru
                    </button>
                  </div>

                  <form onSubmit={handleSubmitAuth} className="space-y-3">
                    {isRegisterMode && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Nama Lengkap:
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama Lengkap Anda"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-slate-50 focus:bg-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Nomor WhatsApp atau Email:
                      </label>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Contoh: 08123456789 atau nama@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Kata Sandi:
                        </label>
                        {!isRegisterMode && (
                          <span className="text-[10px] text-red-600 hover:underline cursor-pointer">
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>

                    {loginError && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <span>
                        {loading
                          ? 'Memverifikasi...'
                          : isRegisterMode
                          ? 'Daftar Akun Member &rarr;'
                          : 'Masuk Akun Sekarang &rarr;'}
                      </span>
                    </button>
                  </form>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    Aman & Terenkripsi &bull; Ades Store 01
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. VISI & KEUNGGULAN TOKO: BELANJA PASTI TANPA RAGU */}
      <div id="keunggulan-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Visi & Jaminan Toko
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Belanja Pasti Tanpa Ragu di Ades Store 01
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Komitmen kami menghadirkan pengalaman belanja online yang aman, transparan, dan memuaskan untuk setiap pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-red-200 hover:bg-red-50/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-slate-900">1. Harga Promo Terbaik</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diskon potongan harga langsung setiap hari tanpa syarat minimum belanja tersembunyi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-red-200 hover:bg-red-50/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-slate-900">2. Kualitas 100% Terjamin</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Material pilihan: insole memory foam anti-pegal, sol cengkeram kuat, dan bahan tas premium tahan lama.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-red-200 hover:bg-red-50/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-slate-900">3. Pengiriman Cepat</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pilihan kurir terlengkap: GOTO (Instant 3 Jam), J&T Express, JNE Reguler, dan Ninja Xpress Hemat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-red-200 hover:bg-red-50/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-slate-900">4. Garansi Tukar Ukuran</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sepatu atau sandal kekecilan / kebesaran? Bisa langsung tukar size dalam 7 hari dengan bantuan CS kami.
            </p>
          </div>
        </div>
      </div>

      {/* 3. VIP PROGRAM HIGHLIGHT BANNER */}
      <div id="vip-section" className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-red-50 rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 flex-shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-slate-900 text-base">
                Program VIP Membership Berbayar (Hanya Rp 50.000)
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                Cashback 10%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Daftar sekarang dan langsung terima saldo <b>🪙 50.000 Poin Koin Member</b> (bisa langsung dipotong saat checkout), diskon spesial 10%, serta garansi bebas ongkir tukar size!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVipModal}
          className="whitespace-nowrap px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all self-start md:self-center"
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Aktivasi VIP Rp 50.000 &rarr;</span>
        </button>
      </div>
    </div>
  );
}
