'use client';

import React, { useState } from 'react';
import {
  Bell,
  X,
  ShoppingBag,
  Sparkles,
  Radio,
  Clock,
  ArrowRight,
  Package,
  CheckCircle,
  Coins,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import { formatIDR, formatIndoDate } from '@/lib/utils';

interface CustomerNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onOpenCart: () => void;
  onOpenLive: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenOrders: () => void;
  onOpenGame: () => void;
}

export default function CustomerNotificationsModal({
  isOpen,
  onClose,
  cart,
  products,
  onOpenCart,
  onOpenLive,
  onSelectProduct,
  onOpenOrders,
  onOpenGame,
}: CustomerNotificationsModalProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'cart' | 'products' | 'live'>('all');

  if (!isOpen) return null;

  // New products (take top 4 newest from list)
  const newProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.promo_price || item.product.original_price;
    return sum + price * item.qty;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">
                Pusat Notifikasi &amp; Pengingat Belanja
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Ades Store 01 &bull; Info produk baru, keranjang &amp; promo live
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterTab('cart')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1 ${
              filterTab === 'cart'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Pengingat Checkout</span>
            {cartQty > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-black flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterTab('products')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'products'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Koleksi Terbaru
          </button>
          <button
            onClick={() => setFilterTab('live')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1 ${
              filterTab === 'live'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Live Streaming</span>
          </button>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* NOTIFIKASI 1: PENGINGAT CHECKOUT KERANJANG */}
          {(filterTab === 'all' || filterTab === 'cart') && cart.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50/60 to-white border-2 border-red-500 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                        Penting
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Pengingat Keranjang
                      </span>
                    </div>
                    <h4 className="font-black text-xs text-slate-900 mt-0.5">
                      Masih ada {cartQty} barang di keranjangmu belum di-checkout!
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Baru saja</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-red-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Tagihan Sementara:</span>
                  <span className="font-black text-red-600 text-sm font-mono">
                    {formatIDR(cartSubtotal)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm flex items-center space-x-1 transition-all transform active:scale-95"
                >
                  <span>Selesaikan Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* NOTIFIKASI 2: LIVE STREAMING SHOPPING SEDANG TAYANG */}
          {(filterTab === 'all' || filterTab === 'live') && (
            <div className="p-3.5 rounded-2xl bg-white border-2 border-red-500 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>Live Sekarang</span>
                      </span>
                      <span className="text-[10px] text-red-600 font-bold">
                        248 Penonton Aktif
                      </span>
                    </div>
                    <h4 className="font-black text-xs text-slate-900 mt-0.5">
                      Host Alya sedang Spill Sepatu &amp; Tas dari Store Cikajang!
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Sedang Live</span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tonton live review, konsultasi size langsung, dan klaim diskon eksklusif live streaming sekarang juga!
              </p>

              <button
                onClick={() => {
                  onClose();
                  onOpenLive();
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <Radio className="w-4 h-4" />
                <span>Masuk ke Ruang Live Streaming</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* NOTIFIKASI 3: PRODUK-PRODUK TERBARU MASUK KATALOG */}
          {(filterTab === 'all' || filterTab === 'products') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pt-1">
                <h5 className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Koleksi Produk Baru Ter-Upload</span>
                </h5>
                <span className="text-[10px] text-slate-400">Otomatis Update</span>
              </div>

              {newProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="p-3 rounded-2xl bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-400 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Baru
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 truncate mt-0.5">
                        {p.name}
                      </h4>
                      <p className="text-xs font-black text-red-600 font-mono mt-0.5">
                        {formatIDR(p.promo_price || p.original_price)}
                      </p>
                    </div>
                  </div>

                  <div className="pl-2 flex-shrink-0">
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center space-x-0.5">
                      <span>Lihat</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NOTIFIKASI 4: INFO POIN CANDY CRUSH & GARANSI RETUR */}
          {filterTab === 'all' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="font-black text-slate-900">Program Koin Game Ades</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tips Belanja</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mainkan game Candy Crush (+5 poin per menang) dan kumpulkan hingga 10.000 poin untuk potongan harga Rp 1.000 saat checkout!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenGame();
                }}
                className="text-[11px] font-bold text-red-600 hover:underline flex items-center space-x-1"
              >
                <span>Buka Game Candy Crush</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
          >
            Tutup Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
}
