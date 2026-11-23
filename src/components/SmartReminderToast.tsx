'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  Radio,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import { formatIDR } from '@/lib/utils';

interface SmartReminderToastProps {
  cart: CartItem[];
  latestProduct: Product | null;
  onOpenCart: () => void;
  onOpenLive: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SmartReminderToast({
  cart,
  latestProduct,
  onOpenCart,
  onOpenLive,
  onSelectProduct,
}: SmartReminderToastProps) {
  const [activeReminder, setActiveReminder] = useState<
    'cart_abandonment' | 'new_product' | 'live_now' | null
  >(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Cart abandonment trigger: If user has items in cart, periodically nudge them
  useEffect(() => {
    if (isDismissed) return;

    // Initial nudge after 6 seconds
    const timer = setTimeout(() => {
      if (cart.length > 0) {
        setActiveReminder('cart_abandonment');
      } else if (latestProduct) {
        setActiveReminder('new_product');
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [cart.length, latestProduct, isDismissed]);

  // Periodic rotation of reminders every 25 seconds
  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setActiveReminder((prev) => {
        if (cart.length > 0 && prev !== 'cart_abandonment') {
          return 'cart_abandonment';
        }
        if (prev === 'cart_abandonment' || prev === null) {
          return 'new_product';
        }
        if (prev === 'new_product') {
          return 'live_now';
        }
        return 'cart_abandonment';
      });
    }, 25000);

    return () => clearInterval(interval);
  }, [cart.length, isDismissed]);

  if (!activeReminder || isDismissed) return null;

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartPrice = cart.reduce((sum, item) => {
    const price = item.product.promo_price || item.product.original_price;
    return sum + price * item.qty;
  }, 0);

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-40 max-w-sm sm:w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-2xl border-2 border-red-500 relative overflow-hidden backdrop-blur-md">
        {/* Glow indicator line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            setIsDismissed(true);
            setActiveReminder(null);
          }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Tutup Pengingat"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* ============================================================== */}
        {/* KONTEN 1: PENGINGAT CHECKOUT KERANJANG (CART ABANDONMENT)       */}
        {/* ============================================================== */}
        {activeReminder === 'cart_abandonment' && cart.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-start space-x-3 pr-6">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {totalCartQty}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                    Pengingat Checkout
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center space-x-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Stok Terbatas</span>
                  </span>
                </div>
                <h4 className="font-black text-xs text-slate-900 mt-1 leading-snug">
                  Ada {totalCartQty} produk di keranjangmu belum di-checkout!
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Total {formatIDR(totalCartPrice)}. Selesaikan sekarang &amp; klaim Garansi Retur Size 7 Hari!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onOpenCart();
                  setActiveReminder(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 flex items-center justify-center space-x-1.5 transition-all transform active:scale-95"
              >
                <span>Checkout Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* KONTEN 2: NOTIFIKASI PRODUK BARU MASUK (NEW PRODUCT ALERT)     */}
        {/* ============================================================== */}
        {activeReminder === 'new_product' && latestProduct && (
          <div className="space-y-3">
            <div className="flex items-start space-x-3 pr-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 shadow-xs">
                <img
                  src={latestProduct.image_url}
                  alt={latestProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Koleksi Baru Rilis</span>
                  </span>
                  <span className="text-[9px] font-bold text-slate-500">
                    Ades Store 01
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 mt-1 truncate">
                  {latestProduct.name}
                </h4>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-black text-red-600 font-mono">
                    {formatIDR(latestProduct.promo_price || latestProduct.original_price)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ready Size {latestProduct.sizes.slice(0, 3).join(', ')}...
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onSelectProduct(latestProduct);
                  setActiveReminder(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center justify-center space-x-1.5 transition-all transform active:scale-95"
              >
                <span>Lihat Detail Produk</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setActiveReminder('cart_abandonment')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* KONTEN 3: PENGINGAT LIVE STREAMING TOKO SEDANG BERLANGSUNG     */}
        {/* ============================================================== */}
        {activeReminder === 'live_now' && (
          <div className="space-y-3">
            <div className="flex items-start space-x-3 pr-6">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Sedang Live</span>
                  </span>
                  <span className="text-[10px] text-red-600 font-bold flex items-center space-x-0.5">
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>248 Penonton</span>
                  </span>
                </div>
                <h4 className="font-black text-xs text-slate-900 mt-1 leading-snug">
                  Spill Sepatu &amp; Tas Langsung dari Toko Cikajang!
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tonton live review &amp; dapatkan diskon live eksklusif sekarang juga.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onOpenLive();
                  setActiveReminder(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 flex items-center justify-center space-x-1.5 transition-all transform active:scale-95"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Tonton Live Sekarang</span>
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
