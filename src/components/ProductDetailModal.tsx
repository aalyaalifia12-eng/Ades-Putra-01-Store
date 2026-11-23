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
  Share2,
  Copy,
  ExternalLink,
  Coins,
  Gift,
} from 'lucide-react';
import { Product, User } from '@/types';
import { formatIDR } from '@/lib/utils';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: number | string, color: string, qty: number) => void;
  onDirectCheckout: (product: Product, size: number | string, color: string, qty: number) => void;
  onOpenSizeAssistant: () => void;
  currentUser?: User | null;
  onRewardCommission?: (amount: number, platform: string, productName: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  onOpenSizeAssistant,
  currentUser,
  onRewardCommission,
}: ProductDetailModalProps) {
  const isFootwear = product.category.startsWith('sepatu');
  const availableSizes: (number | string)[] =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : isFootwear
      ? [38, 39, 40, 41, 42]
      : ['All Size'];
  const [selectedSize, setSelectedSize] = useState<number | string>(availableSizes[0] ?? (isFootwear ? 40 : 'All Size'));
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Default');
  const [qty, setQty] = useState<number>(1);
  const [claimedPlatforms, setClaimedPlatforms] = useState<string[]>([]);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const displayPrice = product.promo_price || product.original_price;
  const isOutOfStock = product.stock <= 0;

  // Pre-formatted full share text with product details and link at the bottom
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ades-putra-01-store.vercel.app';
  const shareProductUrl = `${siteUrl}/?product=${encodeURIComponent(product.id)}`;
  const shareFullPost = `👟 *${product.name}*\n` +
    `💰 Harga Promo: ${formatIDR(displayPrice)} (Diskon Langsung)\n` +
    `🚚 Pengiriman Kilat J&T, JNE, Ninja & Kurir Toko Cikajang/Garut\n` +
    `🛡️ Garansi Bebas Tukar Ukuran 7 Hari!\n\n` +
    `👉 Cek Detail & Beli Produk di Sini:\n${shareProductUrl}`;

  // Handle Share to Facebook / Instagram / WhatsApp and earn Rp 1.000 commission
  const handleShareProduct = (platform: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Salin Link') => {
    if (platform === 'Facebook') {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareProductUrl)}&quote=${encodeURIComponent(shareFullPost)}`;
      window.open(fbUrl, '_blank', 'width=600,height=500');
    } else if (platform === 'WhatsApp') {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareFullPost)}`;
      window.open(waUrl, '_blank');
      setShareNotice('✓ Membuka WhatsApp! Produk & link otomatis ter-post di kolom chat.');
    } else if (platform === 'Instagram') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareFullPost}\n\n#AdesStore01 #SepatuCikajang #GarutShopping`);
      }
      window.open('https://www.instagram.com/', '_blank');
      setShareNotice('✓ Teks postingan & link produk berhasil disalin! Silakan tempel di Instagram Story/Feed/DM Anda.');
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareFullPost);
      }
      setShareNotice('✓ Postingan lengkap beserta link produk di bawah berhasil disalin!');
    }

    // Award Rp 1.000 Commission
    if (!claimedPlatforms.includes(platform)) {
      setClaimedPlatforms((prev) => [...prev, platform]);
      if (onRewardCommission) {
        onRewardCommission(1000, platform, product.name);
      }
      setShareNotice(`🎉 Berhasil! Anda mendapatkan komisi Rp 1.000 karena membagikan ke ${platform}!`);
    }

    setTimeout(() => {
      setShareNotice(null);
    }, 4500);
  };

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

          {/* ============================================================== */}
          {/* FITUR KOMISI BAGIKAN KE FACEBOOK, IG & WHATSAPP (+RP 1.000)   */}
          {/* ============================================================== */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-red-50 border-2 border-red-300 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Gift className="w-4 h-4 text-red-600 animate-bounce" />
                <span className="text-xs font-black text-slate-900">
                  Bagikan Link &amp; Dapat Komisi Rp 1.000!
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
                +Rp 1.000 Koin
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              Bagikan produk ini ke Facebook, Instagram, atau WhatsApp. Postingan otomatis terisi data produk beserta <b>link produk di bawahnya</b>. Anda langsung dapat <b>komisi Rp 1.000</b>!
            </p>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {/* Facebook Share Button */}
              <button
                type="button"
                onClick={() => handleShareProduct('Facebook')}
                className="py-2 px-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="truncate">Facebook</span>
                {claimedPlatforms.includes('Facebook') && <Check className="w-3 h-3 text-emerald-300 ml-0.5" />}
              </button>

              {/* Instagram Share Button */}
              <button
                type="button"
                onClick={() => handleShareProduct('Instagram')}
                className="py-2 px-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="truncate">Instagram</span>
                {claimedPlatforms.includes('Instagram') && <Check className="w-3 h-3 text-emerald-300 ml-0.5" />}
              </button>

              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={() => handleShareProduct('WhatsApp')}
                className="py-2 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span className="truncate">WhatsApp</span>
                {claimedPlatforms.includes('WhatsApp') && <Check className="w-3 h-3 text-emerald-300 ml-0.5" />}
              </button>
            </div>

            {/* PREVIEW POSTINGAN OTOMATIS BESERTA LINK PRODUK DI BAWAH */}
            <div className="p-2.5 rounded-xl bg-white border border-red-200 text-left space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-wide flex items-center space-x-1">
                  <span>📋 Otomatis Ter-Post Beserta Link di Bawah:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleShareProduct('Salin Link')}
                  className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Post &amp; Link</span>
                </button>
              </div>

              {/* Box Teks Postingan */}
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-mono leading-relaxed select-all">
                <p className="font-bold text-slate-900">👟 {product.name}</p>
                <p>💰 Harga Promo: {formatIDR(displayPrice)}</p>
                <p>🚚 Pengiriman Kilat J&amp;T, JNE, Ninja &amp; Kurir Toko Cikajang/Garut</p>
                <p>🛡️ Garansi Bebas Tukar Ukuran 7 Hari!</p>
                <p className="pt-1 text-red-600 font-bold break-all">
                  👉 Beli &amp; Cek Produk di Sini: <br />
                  <span className="underline">{shareProductUrl}</span>
                </p>
              </div>
            </div>

            {/* Notice / Feedback Alert */}
            {shareNotice && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[10px] font-bold text-emerald-800 animate-in fade-in duration-200 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{shareNotice}</span>
              </div>
            )}
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

          {/* Return Warranty Badge with Store Address & Courier */}
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-2 text-[11px]">
            <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p>
              <b>Garansi Retur Ukuran 7 Hari</b>: Bisa tukar size jika kekecilan/kebesaran. Penanganan retur cepat langsung di Store Cikajang.
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
