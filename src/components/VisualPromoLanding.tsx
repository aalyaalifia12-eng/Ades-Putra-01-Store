'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface VisualPromoLandingProps {
  onOpenCustomerLogin: () => void;
  onExploreAsGuest: () => void;
}

export default function VisualPromoLanding({
  onOpenCustomerLogin,
  onExploreAsGuest,
}: VisualPromoLandingProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-slate-950 text-white flex flex-col justify-between selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-28 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-zinc-700 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="Ades Store 01"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl text-white tracking-tight uppercase leading-none">
                  Ades Store <span className="text-red-500">01</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white shadow-xs">
                  Official
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-none mt-1">
                Langkah Nyaman, Gaya Maksimal Setiap Hari
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">OFFICIAL FASHION RETAIL</span>
            <span className="sm:hidden">OFFICIAL</span>
          </div>
        </div>
      </header>

      {/* Main Content: Responsive Split Layout */}
      {/* Di HP (Portrait): Tampilan pas satu layar ponsel memanjang ke bawah */}
      {/* Di Laptop/Desktop (Landscape): Layout melebar proporsional split 2 kolom */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* SISI KIRI (Poster Promo & Koleksi Produk Visual) */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-black border border-zinc-700/80 shadow-2xl p-4 sm:p-5 space-y-3">
              {/* Badge Promo Utama */}
              <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-center shadow-lg shadow-red-600/30">
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-1 sm:space-x-2">
                  <span>🔥 Diskon s/d 30%</span>
                  <span className="opacity-75">|</span>
                  <span>Garansi Tukar Ukuran 100%</span>
                </p>
              </div>

              {/* Showcase 3 Koleksi Produk (Sepatu, Sandal, Tas) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {/* 1. Sepatu Sneakers & Loafer */}
                <div className="relative rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 aspect-square group">
                  <img
                    src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
                    alt="Sepatu Sneakers Ades Store 01"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-[10px] sm:text-xs font-black text-amber-300">👟 Sepatu</span>
                    <span className="text-[9px] font-bold text-zinc-300">Size 36-43</span>
                  </div>
                </div>

                {/* 2. Sandal Slide */}
                <div className="relative rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 aspect-square group">
                  <img
                    src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80"
                    alt="Sandal Slide Ades Store 01"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-[10px] sm:text-xs font-black text-rose-300">🩴 Sandal</span>
                    <span className="text-[9px] font-bold text-zinc-300">Cloud Foam</span>
                  </div>
                </div>

                {/* 3. Tas Fashion */}
                <div className="relative rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 aspect-square group">
                  <img
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
                    alt="Tas Fashion Ades Store 01"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-[10px] sm:text-xs font-black text-emerald-300">👜 Tas</span>
                    <span className="text-[9px] font-bold text-zinc-300">Modern Style</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
                <p className="text-[11px] sm:text-xs text-zinc-300 font-medium">
                  Sepatu Sneakers/Loafer (Size 36-43) &bull; Sandal Slide Empuk &bull; Tas Modern &bull; Garansi Retur 7 Hari
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN (Teks Pengenalan & Tombol Aksi Langsung Naik) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            {/* Tagline & Deskripsi */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
                Official Ritel Fashion
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Koleksi Pilihan <span className="text-red-500">Ades Store 01</span>
              </h1>
              <p className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-white">
                &ldquo;Langkah Nyaman, Gaya Maksimal Setiap Hari&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed pt-1">
                Belanja Pasti Tanpa Ragu: Nikmati harga promo langsung setiap hari, jaminan mutu material insole empuk anti-pegal, garansi bebas tukar ukuran 7 hari, serta ekspedisi kilat (J&amp;T, JNE, GOTO Instant 3 Jam, Ninja Xpress).
              </p>
            </div>

            {/* Tombol Aksi Langsung Naik Rapi Setelah Teks Deskripsi (NOL Box Alamat Toko Fisik) */}
            <div className="space-y-3 pt-2">
              {/* Tombol 1: MASUK / LOGIN */}
              <button
                onClick={onOpenCustomerLogin}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/40 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>MASUK / LOGIN</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Tombol 2: BELANJA SEKARANG (TAMU) */}
              <button
                onClick={onExploreAsGuest}
                className="w-full py-4 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all hover:border-zinc-500 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span>BELANJA SEKARANG (TAMU)</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer dengan Tautan Admin Tersembunyi di Pojok Bawah */}
      <footer className="relative z-10 w-full px-4 py-3.5 border-t border-zinc-900 bg-black/80 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© 2026 Ades Store 01 &bull; Ritel Sepatu, Sandal &amp; Tas</p>
          
          {/* Teks kecil di pojok bawah: Akses Admin */}
          <Link
            href="/admin/login"
            className="text-xs text-zinc-500 hover:text-zinc-300 underline decoration-dotted transition-colors font-medium flex items-center space-x-1"
            title="Khusus Pengelola Toko Ades Store 01"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Akses Admin</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}