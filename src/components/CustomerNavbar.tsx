'use client';

import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Coins,
  Crown,
  User,
  Search,
  LogOut,
  LogIn,
  Package,
} from 'lucide-react';
import { User as UserType } from '@/types';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

interface CustomerNavbarProps {
  currentUser: UserType | null;
  cartCount: number;
  ordersCount?: number;
  onOpenCart: () => void;
  onOpenVipModal: () => void;
  onOpenProfile?: () => void;
  onOpenOrders?: () => void;
  onOpenGame?: () => void;
  onLogout: () => void;
  onSwitchToLogin?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function CustomerNavbar({
  currentUser,
  cartCount,
  ordersCount = 0,
  onOpenCart,
  onOpenVipModal,
  onOpenProfile,
  onOpenOrders,
  onOpenGame,
  onLogout,
  onSwitchToLogin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: CustomerNavbarProps) {
  const isVip = currentUser?.isVip || false;
  const memberPoints = currentUser?.memberPoints || 0;
  const isGuest = !currentUser || currentUser.id === 'guest';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Promo Ticker */}
      <div className="bg-black text-white text-[10px] font-bold py-1 px-3 text-center tracking-wide flex items-center justify-between border-b border-red-950/60">
        <div className="flex items-center space-x-1.5 truncate">
          <Sparkles className="w-3 h-3 text-red-500 flex-shrink-0" />
          <span className="font-extrabold text-red-500">Ades Store 01:</span>
          <span className="text-zinc-300 truncate">
            Diskon s/d 30% + Garansi Retur Size!
          </span>
        </div>
        <button
          onClick={onOpenVipModal}
          className="text-amber-300 hover:text-white font-extrabold text-[10px] flex-shrink-0 ml-1 underline decoration-amber-400"
        >
          Klaim VIP (Gratis Ongkir) &rarr;
        </button>
      </div>

      {/* Main Responsive Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Store Branding */}
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-white p-0.5 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="Ades Store 01"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base text-slate-900 tracking-tight leading-none">
                  Ades Store <span className="text-red-600">01</span>
                </span>
                {/* Status Badge */}
                {isVip ? (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs">
                    <Crown className="w-2.5 h-2.5 text-amber-100" />
                    <span>VIP</span>
                  </span>
                ) : !isGuest ? (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    <User className="w-2.5 h-2.5" />
                    <span>Member</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    <span>Tamu</span>
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                Langkah Nyaman, Gaya Maksimal
              </p>
            </div>
          </div>

          {/* Right Action Icons & VIP Widget */}
          <div className="flex items-center space-x-1.5">
            {/* Indikator Pojok Kanan Atas: Widget Saldo Poin Member (Real-time) */}
            <div
              onClick={onOpenVipModal}
              className={`cursor-pointer flex items-center space-x-1.5 px-2 py-1 rounded-xl border transition-all shadow-2xs ${
                isVip
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/90 border-amber-300 text-amber-950 hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Status Poin Member — Klik untuk klaim / tambah poin VIP"
            >
              <span className="text-xs">🪙</span>
              <div className="text-left">
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-900 block leading-none">
                  Poin
                </span>
                <p className="font-black text-[11px] text-amber-950 leading-tight">
                  {memberPoints.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Game Candy Crush Button */}
            {onOpenGame && (
              <button
                onClick={onOpenGame}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border-2 border-red-500 bg-white hover:bg-red-50 text-slate-900 transition-all shadow-xs group"
                title="Main Game Candy Crush & Kumpulkan Koin Diskon!"
              >
                <span className="text-sm animate-pulse">🍬</span>
                <span className="hidden sm:inline text-xs font-black text-red-600">
                  Game Koin
                </span>
                <span className="text-[8px] font-black uppercase px-1 rounded bg-red-600 text-white">
                  Diskon
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl border border-slate-200 hover:border-red-400 bg-white text-slate-700 transition-all shadow-2xs"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* My Orders Button */}
            <button
              onClick={onOpenOrders}
              className="relative flex items-center space-x-1 px-2 py-1.5 rounded-xl border border-slate-200 hover:border-red-400 bg-white text-slate-800 transition-all shadow-2xs group"
              title="Pesanan Saya (Semua, Perlu Dibayar, Untuk Dikirim, Akan Diterima, Untuk Diulas, Retur)"
            >
              <Package className="w-4 h-4 text-slate-700 group-hover:text-red-600" />
              <span className="hidden md:inline text-xs font-black">Pesanan</span>
              {ordersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-2xs">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* User Profile Button with Photo & Info */}
            <div className="flex items-center space-x-1">
              {currentUser && !isGuest ? (
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 hover:border-red-400 bg-white transition-all shadow-2xs group"
                  title="Buka Profil Saya & Pengaturan Alamat"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 bg-slate-100 flex-shrink-0">
                    <img
                      src={
                        currentUser.avatar_url ||
                        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate group-hover:text-red-600">
                    {currentUser.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onSwitchToLogin || onLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black transition-colors flex items-center space-x-1 shadow-xs"
                  title="Masuk Akun Member"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Masuk</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari sepatu pria/wanita, tas sekolah TK-SMA, buku, sepatu gunung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Category Navigation Pills (Lengkap 16 Kategori) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/40 ring-1 ring-red-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
                title={cat.description}
              >
                <span>{cat.icon}</span>
                <span>{cat.shortName}</span>
                {cat.badge && (
                  <span
                    className={`text-[8px] uppercase px-1 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}