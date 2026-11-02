'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white flex flex-col justify-between items-center p-6 sm:p-12 relative select-none">
      {/* Ambient background glow effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Subtle Header Badge */}
      <div className="relative z-10 pt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL FASHION STORE</span>
        </div>
      </div>

      {/* Center Hero: Official Logo, Store Name & Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md my-auto">
        {/* Official Logo Frame with glow */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700 animate-pulse" />
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center border border-zinc-200">
            <img
              src="/logo.png"
              alt="Ades Store 01"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Store Title & Official Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase font-sans text-white">
            Ades Store <span className="text-red-500">01</span>
          </h1>
          <p className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-white max-w-sm mx-auto leading-snug">
            &ldquo;Langkah Nyaman, Gaya Maksimal Setiap Hari&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom Action Button: Mulai / Masuk */}
      <div className="relative z-10 w-full max-w-sm pb-6">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/40 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Mulai / Masuk</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-[11px] text-zinc-500 text-center font-medium mt-3">
          Sepatu &bull; Sandal &bull; Tas &bull; Garansi Retur Size 7 Hari
        </p>
      </div>
    </div>
  );
}
