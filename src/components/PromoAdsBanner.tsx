'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Video as VideoIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { BannerAd } from '@/types';

interface PromoAdsBannerProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenVipModal: () => void;
}

const DEFAULT_SLIDES: BannerAd[] = [
  {
    id: 'ramadhan',
    badge: '🌙 SPESIAL RAMADHAN 1447 H',
    tagline: 'Diskon 20% Berkah Lebaran',
    title: 'Spesial Ramadhan & Hari Raya: Diskon 20% Sepatu & Tas Baru!',
    description:
      'Sambut bulan suci & silaturahmi Idul Fitri dengan gaya maksimal! Koleksi Sepatu Pria & Wanita Elegan, Sandal Terawih Empuk, dan Tas Mudik Terbaru.',
    promo_code: 'RAMADHAN20',
    discount_highlight: 'DISKON 20%',
    cta_text: 'Belanja Koleksi Ramadhan →',
    target_category: 'sepatu_pria',
    bg_gradient: 'from-emerald-950 via-teal-900 to-slate-950',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    order: 1,
    created_at: '2026-03-01',
  },
  {
    id: 'video_showcase',
    badge: '🎥 VIDEO PREVIEW PRODUK',
    tagline: 'Spill Langsung dari Store Cikajang',
    title: 'Review Sepatu Sneakers Sport: Sol Empuk & Ringan Bergaransi!',
    description:
      'Tonton video review detail sepatu sneakers kami: sol empuk anti-selip, material breathable, dan jaminan tukar size 7 hari bebas khawatir.',
    promo_code: 'ADESKILAT',
    discount_highlight: 'SUPER EMPUK',
    cta_text: 'Lihat Sneakers Sport →',
    target_category: 'sepatu_olahraga',
    bg_gradient: 'from-rose-950 via-red-900 to-slate-950',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-tying-running-shoes-42994-large.mp4',
    is_active: true,
    order: 2,
    created_at: '2026-03-02',
  },
  {
    id: 'back_to_school',
    badge: '🎒 PROMO BACK TO SCHOOL',
    tagline: 'Tahun Ajaran Baru Semangat Baru',
    title: 'Back to School Hemat s/d 30%: Sepatu, Tas & Alat Tulis Lengkap!',
    description:
      'Paket lengkap sekolah TK, SD, SMP & SMA! Sepatu hitam standar sekolah, tas ransel ergonomis cewek/cowok, dan buku tulis paket hemat.',
    promo_code: 'SEKOLAH30',
    discount_highlight: 'HEMAT 30%',
    cta_text: 'Lihat Perlengkapan Sekolah →',
    target_category: 'tas_sekolah_tk_sd',
    bg_gradient: 'from-blue-950 via-indigo-900 to-slate-950',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    order: 3,
    created_at: '2026-03-03',
  },
];

export default function PromoAdsBanner({
  onSelectCategory,
  onOpenVipModal,
}: PromoAdsBannerProps) {
  const [slides, setSlides] = useState<BannerAd[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch dynamic banners from /api/banners
  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          setSlides(data.banners);
        }
      } catch (e) {
        console.warn('Failed loading banners, using default slides', e);
      }
    }
    loadBanners();
  }, []);

  // Auto rotate slides every 7 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || DEFAULT_SLIDES[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500/60 transition-all duration-500 group">
      {/* Dynamic Background with Gradient */}
      <div
        className={`relative bg-gradient-to-br ${
          slide.bg_gradient || 'from-red-950 via-slate-900 to-black'
        } p-4 sm:p-6 lg:p-7 text-white min-h-[300px] sm:min-h-[280px] flex flex-col justify-between overflow-hidden`}
      >
        {/* Glow ambient background lights */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Badges Bar: Responsive Flex */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm bg-red-600 text-white border border-red-400">
              <Flame className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>{slide.badge || 'PROMO ADES STORE'}</span>
            </span>

            {slide.tagline && (
              <span className="hidden sm:inline-block text-[11px] font-bold text-slate-300 truncate max-w-xs">
                {slide.tagline}
              </span>
            )}
          </div>

          {/* Flash Promo Voucher Box */}
          {slide.promo_code && (
            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15">
              <span className="text-[10px] text-zinc-300 font-medium">Kupon:</span>
              <button
                onClick={() => handleCopyCode(slide.promo_code!)}
                className="font-mono font-black text-xs text-amber-300 hover:text-white underline decoration-dotted transition-colors"
                title="Klik untuk salin kode voucher"
              >
                {copiedCode === slide.promo_code ? 'Tersalin ✓' : slide.promo_code}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid: Text + Media Box (Foto atau Video) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center my-3">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-2 sm:space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] uppercase tracking-wide">
                {slide.discount_highlight || 'SPESIAL'}
              </span>
              <span className="text-[11px] text-amber-200 font-bold flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Terbatas Minggu Ini!</span>
              </span>
            </div>

            <h3 className="text-base sm:text-2xl font-black text-white leading-snug sm:leading-tight tracking-tight">
              {slide.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {slide.description}
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-[11px]">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/10 text-slate-100 border border-white/10">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Garansi Retur Size 7 Hari</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/10 text-slate-100 border border-white/10">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Kurir Kilat Cikajang &amp; Garut</span>
              </span>
            </div>
          </div>

          {/* Right Media Box: Foto atau Video Player */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[280px] sm:max-w-xs aspect-video sm:aspect-square md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
              {slide.media_type === 'video' ? (
                /* VIDEO PLAYER */
                <div className="relative w-full h-full group/video">
                  <video
                    ref={videoRef}
                    src={slide.media_url}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Video Controls Overlay */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-20">
                    <button
                      type="button"
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
                      title={isVideoMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                    >
                      {isVideoMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleVideoPlay}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
                      title={isVideoPlaying ? 'Jeda Video' : 'Putar Video'}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 z-20">
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase bg-red-600/90 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <VideoIcon className="w-2.5 h-2.5" />
                      <span>Video Review</span>
                    </span>
                  </div>
                </div>
              ) : (
                /* FOTO / GAMBAR */
                <div className="relative w-full h-full">
                  <img
                    src={slide.media_url}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 z-20">
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                      <ImageIcon className="w-2.5 h-2.5 text-amber-300" />
                      <span>Ades Store 01</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions & Slider Controls */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (slide.target_category) {
                  onSelectCategory(slide.target_category);
                } else {
                  onSelectCategory('all');
                }
              }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white text-slate-950 hover:bg-amber-50 font-black text-xs shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <span>{slide.cta_text || 'Lihat Promo →'}</span>
            </button>
          </div>

          {/* Slider Prev/Next Controls & Dots */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
              }
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              title="Promo Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  title={`Pindah ke Promo ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              title="Promo Selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
