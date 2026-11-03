'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Crown,
  BookOpen,
  Backpack,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Flame,
} from 'lucide-react';

interface PromoAdsBannerProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenVipModal: () => void;
}

export default function PromoAdsBanner({
  onSelectCategory,
  onOpenVipModal,
}: PromoAdsBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const PROMO_SLIDES = [
    {
      id: 'ramadhan',
      badge: '🌙 SPESIAL RAMADHAN 1447 H',
      badgeColor: 'bg-emerald-500 text-white border-emerald-400',
      tagline: 'Diskon 20% Berkah Lebaran',
      title: 'Spesial Ramadhan & Hari Raya: Diskon 20% Sepatu & Tas Baru!',
      description:
        'Sambut bulan suci & silaturahmi Idul Fitri dengan gaya maksimal! Koleksi Sepatu Pria & Wanita Elegan, Sandal Terawih Empuk, dan Tas Mudik Terbaru.',
      code: 'RAMADHAN20',
      discountHighlight: 'DISKON 20%',
      benefits: ['Bisa Bayar via DANA / COD', 'Bonus Gratis Ongkir', 'Garansi Tukar Size 7 Hari'],
      ctaText: 'Belanja Koleksi Ramadhan →',
      ctaCategory: 'sepatu_pria',
      secondaryText: 'Lihat Sepatu Wanita',
      secondaryCategory: 'sepatu_wanita',
      bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
      accentGlow: 'bg-emerald-500/25',
      borderStroke: 'border-emerald-600/50',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'back_to_school',
      badge: '🎒 PROMO BACK TO SCHOOL',
      badgeColor: 'bg-blue-500 text-white border-blue-400',
      tagline: 'Tahun Ajaran Baru Semangat Baru',
      title: 'Back to School Hemat s/d 30%: Sepatu, Tas & Alat Tulis Lengkap!',
      description:
        'Paket lengkap sekolah TK, SD, SMP & SMA! Sepatu hitam polos standar sekolah, tas ransel ergonomis cewek/cowok, dan buku tulis paket hemat isi 10.',
      code: 'SEKOLAH30',
      discountHighlight: 'HEMAT s/d 30%',
      benefits: ['Sepatu Hitam Polos Size 30-43', 'Tas Busa Tebal Anti-Pegal', 'Paket Buku Tulis 1 Pak'],
      ctaText: 'Lihat Sepatu Sekolah →',
      ctaCategory: 'sepatu_sekolah',
      secondaryText: 'Tas Sekolah TK & SD',
      secondaryCategory: 'tas_sekolah_tk_sd',
      bgGradient: 'from-blue-950 via-indigo-900 to-slate-950',
      accentGlow: 'bg-blue-500/25',
      borderStroke: 'border-blue-600/50',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'vip_membership',
      badge: '👑 VIP MEMBERSHIP RESMI',
      badgeColor: 'bg-amber-500 text-slate-950 border-amber-300 font-black',
      tagline: 'Cuma Rp 50.000 Sekali Bayar via QRIS DANA',
      title: 'Bonus Gratis Ongkir + Bonus Sambutan 50.000 Koin Member!',
      description:
        'Aktivasi VIP sekarang via QRIS DANA ke 0821-2646-8980. Nikmati Gratis Ongkir ke seluruh Indonesia, Cashback 10% setiap transaksi, dan ekstra diskon VIP!',
      code: 'VIP50K',
      discountHighlight: 'BONUS 50.000 KOIN',
      benefits: ['🚚 Bonus Gratis Ongkir', '⚡ Cashback 10% Setiap Belanja', '👑 Ekstra Diskon VIP 10%'],
      ctaText: 'Aktivasi VIP Sekarang (Rp 50.000) →',
      isVipAction: true,
      secondaryText: 'Tanya CS WhatsApp',
      secondaryWhatsapp: true,
      bgGradient: 'from-amber-950 via-red-950 to-slate-950',
      accentGlow: 'bg-amber-500/25',
      borderStroke: 'border-amber-500/50',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    },
  ];

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [PROMO_SLIDES.length]);

  const slide = PROMO_SLIDES[currentSlide];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 group">
      {/* Dynamic Background */}
      <div className={`relative bg-gradient-to-r ${slide.bgGradient} p-5 sm:p-7 lg:p-8 text-white min-h-[290px] sm:min-h-[270px] flex flex-col justify-between overflow-hidden border ${slide.borderStroke}`}>
        {/* Glow ambient background lights */}
        <div className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none ${slide.accentGlow}`} />
        <div className={`absolute left-1/3 -bottom-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${slide.accentGlow}`} />

        {/* Top Badges Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm border ${slide.badgeColor}`}>
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>{slide.badge}</span>
            </span>

            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-300">
              {slide.tagline}
            </span>
          </div>

          {/* Flash Promo Voucher Box */}
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15">
            <span className="text-[10px] text-zinc-300 font-medium">Kode Kupon:</span>
            <button
              onClick={() => handleCopyCode(slide.code)}
              className="font-mono font-black text-xs text-amber-300 hover:text-white underline decoration-dotted transition-colors"
              title="Klik untuk salin kode voucher"
            >
              {copiedCode === slide.code ? 'Tersalin ✓' : slide.code}
            </button>
          </div>
        </div>

        {/* Main Content Grid (Text + Visual Card) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-3">
          {/* Left Text */}
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] uppercase tracking-wide">
                {slide.discountHighlight}
              </span>
              <span className="text-xs text-amber-200 font-bold flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Terbatas Minggu Ini!</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight">
              {slide.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              {slide.benefits.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-100 border border-white/10"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Floating Product Preview */}
          <div className="hidden md:flex md:col-span-4 justify-end">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-black text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  Ades Store 01 Official
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Slider Controls */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                if (slide.isVipAction) {
                  onOpenVipModal();
                } else if (slide.ctaCategory) {
                  onSelectCategory(slide.ctaCategory);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-amber-50 font-black text-xs shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <span>{slide.ctaText}</span>
            </button>

            {slide.secondaryWhatsapp ? (
              <a
                href="https://wa.me/6282126468980?text=Halo%20Admin%20Ades%20Store%2001,%20saya%20tertarik%20dengan%20promo%20VIP%20Rp50rb%20Gratis%20Ongkir"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all flex items-center space-x-1"
              >
                <span>{slide.secondaryText}</span>
              </a>
            ) : slide.secondaryCategory ? (
              <button
                onClick={() => onSelectCategory(slide.secondaryCategory!)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all"
              >
                <span>{slide.secondaryText}</span>
              </button>
            ) : null}
          </div>

          {/* Slider Prev/Next Controls & Dots */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)
              }
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              title="Promo Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-1.5">
              {PROMO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  title={`Pindah ke Promo ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              title="Promo Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
