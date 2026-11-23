'use client';

import React, { useState, useEffect } from 'react';
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
  Bell,
  Radio,
} from 'lucide-react';
import { User as UserType } from '@/types';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

interface CustomerNavbarProps {
  currentUser: UserType | null;
  cartCount: number;
  ordersCount?: number;
  notificationsCount?: number;
  onOpenCart: () => void;
  onOpenVipModal: () => void;
  onOpenProfile?: () => void;
  onOpenOrders?: () => void;
  onOpenGame?: () => void;
  onOpenNotifications?: () => void;
  onOpenLive?: () => void;
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
  notificationsCount = 0,
  onOpenCart,
  onOpenVipModal,
  onOpenProfile,
  onOpenOrders,
  onOpenGame,
  onOpenNotifications,
  onOpenLive,
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
  const [isStoreLive, setIsStoreLive] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ades_store_live_active');
      if (saved !== null) {
        setIsStoreLive(saved === 'true');
      }
    } catch {}

    fetch('/api/live')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.is_active === 'boolean') {
          setIsStoreLive(data.is_active);
          try {
            localStorage.setItem('ades_store_live_active', data.is_active ? 'true' : 'false');
          } catch {}
        }
      })
      .catch(() => {});

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ades_store_live_active');
        if (saved !== null) {
          setIsStoreLive(saved === 'true');
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLiveButtonClick = () => {
    if (!isStoreLive) {
      alert('Admin sedang tidak melakukan siaran langsung.');
      return;
    }
    if (onOpenLive) {
      onOpenLive();
    }
  };

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
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 space-y-2">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Logo & Store Branding */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white p-0.5 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="Ades Store 01"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight leading-none truncate">
                  Ades Store <span className="text-red-600">01</span>
                </span>
                {/* Status Badge */}
                {isVip ? (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs flex-shrink-0">
                    <Crown className="w-2.5 h-2.5 text-amber-100" />
                    <span>VIP</span>
                  </span>
                ) : !isGuest ? (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs flex-shrink-0">
                    <User className="w-2.5 h-2.5" />
                    <span className="hidden xs:inline">Member</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-0.5 text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 flex-shrink-0">
                    <span>Tamu</span>
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5 truncate hidden xs:block">
                Langkah Nyaman, Gaya Maksimal
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {/* Desktop-only: Indikator Saldo Poin Member (Di HP tampil di sub-bar bawah) */}
            <div
              onClick={onOpenVipModal}
              className={`hidden md:flex cursor-pointer items-center space-x-1.5 px-2 py-1 rounded-xl border transition-all shadow-2xs ${
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

            {/* Live Streaming Shopping Button */}
            {onOpenLive && (
              <button
                onClick={handleLiveButtonClick}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all shadow-md group ${
                  isStoreLive
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
                title={
                  isStoreLive
                    ? 'Tonton Live Streaming Ades Store Cikajang & Klaim Diskon Live!'
                    : 'Admin sedang tidak melakukan siaran langsung'
                }
              >
                <span className={`w-2 h-2 rounded-full ${isStoreLive ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  {isStoreLive ? (
                    'LIVE'
                  ) : (
                    <>
                      <span className="hidden sm:inline">Admin Tidak Siaran</span>
                      <span className="sm:hidden">OFFLINE</span>
                    </>
                  )}
                </span>
                {isStoreLive && (
                  <span className="hidden sm:inline text-[9px] font-black bg-black/40 px-1.5 py-0.2 rounded-full text-white">
                    418
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:border-red-400 bg-white text-slate-700 transition-all shadow-2xs"
                title="Pusat Notifikasi & Pengingat Belanja"
              >
                <Bell className="w-4 h-4 text-slate-800" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-bounce">
                    {notificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Desktop-only: Game Candy Crush Button (Di HP tampil di sub-bar bawah) */}
            {onOpenGame && (
              <button
                onClick={onOpenGame}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border-2 border-red-500 bg-white hover:bg-red-50 text-slate-900 transition-all shadow-xs group"
                title="Main Game Candy Crush & Kumpulkan Koin Diskon!"
              >
                <span className="text-sm animate-pulse">🍬</span>
                <span className="text-xs font-black text-red-600">
                  Game Koin
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:border-red-400 bg-white text-slate-700 transition-all shadow-2xs"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop-only: My Orders Button (Di HP tampil di sub-bar bawah) */}
            <button
              onClick={onOpenOrders}
              className="hidden sm:flex relative items-center space-x-1 px-2 py-1.5 rounded-xl border border-slate-200 hover:border-red-400 bg-white text-slate-800 transition-all shadow-2xs group"
              title="Pesanan Saya"
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
                  className="flex items-center space-x-1.5 p-1 sm:px-2 sm:py-1 rounded-xl border border-slate-200 hover:border-red-400 bg-white transition-all shadow-2xs group"
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
                  <span className="hidden lg:inline text-xs font-bold text-slate-800 max-w-[80px] truncate group-hover:text-red-600">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onSwitchToLogin}
                  className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-xs flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="text-[11px] sm:text-xs">Masuk</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Khusus Layar HP (Mobile-Only Quick Action Bar): Saldo Poin, Game Koin, dan Pesanan Saya */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-xs">
          {/* Poin Widget HP */}
          <button
            onClick={onOpenVipModal}
            className={`flex-1 flex items-center justify-center space-x-1 py-1 px-2 rounded-xl border transition-all text-left ${
              isVip
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>🪙</span>
            <span className="text-[10px] font-black truncate">
              {memberPoints.toLocaleString('id-ID')} Poin
            </span>
          </button>

          {/* Game Candy Crush HP */}
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="flex-1 flex items-center justify-center space-x-1 py-1 px-2 rounded-xl bg-white border border-red-500 text-red-600 shadow-2xs"
            >
              <span className="animate-pulse">🍬</span>
              <span className="text-[10px] font-black whitespace-nowrap">Game Koin</span>
            </button>
          )}

          {/* Pesanan Saya HP */}
          <button
            onClick={onOpenOrders}
            className="flex-1 flex items-center justify-center space-x-1 py-1 px-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs"
          >
            <Package className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-[10px] font-black whitespace-nowrap">Pesanan</span>
            {ordersCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari sepatu, sandal, tas sekolah, dompet..."
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