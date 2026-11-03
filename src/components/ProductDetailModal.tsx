'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Tag,
  Check,
  RotateCcw,
  Ruler,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Product } from '@/types';
import { formatIDR } from '@/lib/utils';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: number | string, color: string, qty: number) => void;
  onDirectCheckout: (product: Product, size: number | string, color: string, qty: number) => void;
  onOpenSizeAssistant: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  onOpenSizeAssistant,
}: ProductDetailModalProps) {
  const isFootwear = product.category.startsWith('sepatu');
  const availableSizes: (number | string)[] =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : isFootwear
      ? [38, 39, 40, 41, 42]
      : ['All Size'];
  const [selectedSize, setSelectedSize] = useState<number | string>(availableSizes[0] ?? (isFootwear ? 40 : 'All Size'));
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [qty, setQty] = useState<number>(1);

  const displayPrice = product.promo_price || product.original_price;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Top Image Frame with close button */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-100 flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-md">
            {product.category}
          </span>

          {product.promo_price && (
            <span className="absolute top-3 left-16 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              Promo Spesial
            </span>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Details */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Header & Pricing */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{product.sku}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                Tersedia {product.stock} pcs
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 leading-snug mt-0.5">
              {product.name}
            </h2>

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-black text-red-600">
                {formatIDR(displayPrice)}
              </span>
              {product.promo_price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatIDR(product.original_price)}
                </span>
              )}
            </div>

            {/* Rating & Review Counter */}
            <div className="flex items-center space-x-2 pt-1.5">
              <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-amber-950">
                  {product.rating || 4.9}
                </span>
                <span className="text-[10px] text-amber-800 font-bold">/ 5.0</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                ({product.review_count || 128} Ulasan Pembeli Terverifikasi)
              </span>
              <span className="text-[11px] text-emerald-600 font-bold ml-auto">
                {product.sold_count || 240}+ Terjual
              </span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Pilih Ukuran {isFootwear ? '(Size Kaki)' : '(Varian / Ukuran)'}:
              </span>
              {isFootwear && (
                <button
                  type="button"
                  onClick={onOpenSizeAssistant}
                  className="text-[10px] text-red-600 font-extrabold flex items-center space-x-1 hover:underline"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Panduan Ukuran (cm)</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`min-w-9 h-8 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">
                Pilihan Warna:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      selectedColor === c
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700">Jumlah Pesanan:</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-black text-xs text-slate-900">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center space-x-1">
                <span>⭐ Penilaian &amp; Ulasan Pembeli</span>
              </span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100/80 px-2 py-0.5 rounded-full">
                100% Asli Terverifikasi
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-800">Siti Rahmawati</span>
                  <span className="text-amber-500 font-black">★★★★★</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  &ldquo;Sol empuk banget dan enteng di kaki! Buat dipakai kerja seharian tetap nyaman anti-pegal.&rdquo;
                </p>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-800">Budi Santoso</span>
                  <span className="text-amber-500 font-black">★★★★★</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  &ldquo;Ukuran pas sesuai panduan size. Bahan premium, pengiriman super kilat! Recommended banget.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Return Warranty Badge */}
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-2 text-[11px]">
            <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p>
              <b>Garansi Retur Ukuran 7 Hari</b>: Bisa tukar size jika kekecilan/kebesaran.
            </p>
          </div>
        </div>

        {/* Action Buttons in Footer of Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => {
              onAddToCart(product, selectedSize, selectedColor, qty);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Keranjang</span>
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => {
              onDirectCheckout(product, selectedSize, selectedColor, qty);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
          >
            <span>Beli Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}