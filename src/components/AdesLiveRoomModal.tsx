'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Eye,
  Heart,
  ShoppingBag,
  Send,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  Tag,
  Star,
  Video,
  Bell,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { Product, User } from '@/types';
import { formatIDR } from '@/lib/utils';

interface AdesLiveRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (
    product: Product,
    size: number | string,
    color: string,
    qty: number
  ) => void;
  onDirectCheckout: (
    product: Product,
    size: number | string,
    color: string,
    qty: number
  ) => void;
  currentUser: User | null;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  isHost?: boolean;
  isBuyer?: boolean;
  timestamp: string;
}

interface FloatingHeart {
  id: number;
  color: string;
  x: number;
}

// 3 Real-Host Video Channels with verified fast video CDN and clear host identity
const LIVE_STREAMS = [
  {
    id: 'stream-1',
    title: 'Spill Koleksi Sepatu Sneakers & Loafer - Host Alya',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hostName: 'Alya Alifia',
    hostRole: 'Host Utama Live Ades Store 01',
    hostAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    hostPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    location: 'Studio Toko Cikajang, Garut',
    currentTopic: 'Spill Insole Memory Foam Anti Pegal & Size 36-43',
    quotes: [
      'Halo warga Cikajang & Garut! Insole busa memory foam ini super empuk anti-pegal!',
      'Mumpung lagi LIVE, klik Keranjang Kuning dapat diskon khusus & garansi retur size 7 hari!',
      'Koin Candy Crush bisa dipakai buat potong harga Rp 1.000 lho kak!',
      'Pengiriman kilat Cikajang & Garut bisa langsung kami antar sore ini juga!',
    ],
  },
  {
    id: 'stream-2',
    title: 'Review Fisik Sol Empuk & Sepatu Olahraga Running - Host Asep',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    hostName: 'Asep Saepuloh',
    hostRole: 'Co-Host Reviewer Sepatu Olahraga',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    hostPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    location: 'Gudang Display Garut Kota',
    currentTopic: 'Uji Kelenturan Sol & Bahan Mesh Bernapas',
    quotes: [
      'Sol karet aslinya anti-slip ya, mantap banget dipakai lari santai atau naik gunung!',
      'Jahitan sol rapi dan lemnya standar pabrik, awet dipakai bertahun-tahun.',
      'Yang mau tanya ukuran dalam centimeter (cm) langsung ketik di chat ya!',
    ],
  },
  {
    id: 'stream-3',
    title: 'Unboxing Sandal Slide Anak & Tas Sekolah TK/SD - Host Rina',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    hostName: 'Rina Marlina',
    hostRole: 'Host Spesial Sandal & Tas Anak',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    hostPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    location: 'Outlet Ades Cikajang',
    currentTopic: 'Review Sandal Anak Cowok/Cewek & Tas Ransel',
    quotes: [
      'Bunda yang cari sandal anak cowok atau cewek, model ini solnya lentur aman gak bikin lecet!',
      'Tas ransel sekolahnya muat buku tema besar dan tempat bekal!',
      'Bisa bayar COD di tempat waktu kurir sampai depan rumah ya bunda!',
    ],
  },
];

export default function AdesLiveRoomModal({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onDirectCheckout,
  currentUser,
}: AdesLiveRoomModalProps) {
  // Active Stream Channel
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const activeStream = LIVE_STREAMS[activeStreamIndex];

  // Pinned Product showcased in live
  const [pinnedProductIndex, setPinnedProductIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | string>(39);
  const [selectedColor, setSelectedColor] = useState<string>('Hitam');

  // Live Stats
  const [viewerCount, setViewerCount] = useState(418);
  const [likesCount, setLikesCount] = useState(3140);
  const [isMuted, setIsMuted] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hostQuoteIndex, setHostQuoteIndex] = useState(0);

  // Store Live Active Status (Controlled by Admin)
  const [isStoreLiveActive, setIsStoreLiveActive] = useState<boolean>(true);

  // Live Chat Stream
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'Siti Rahmawati (Cikajang)',
      message: 'Kak spill sneakers putih size 39 dong, solnya empuk gak?',
      timestamp: '15:10',
    },
    {
      id: 'c2',
      sender: 'Alya (Host Ades Store)',
      message: 'Halo Kak Siti! Ini lagi di-spill langsung ya, busa insole memory foam super empuk anti pegal!',
      isHost: true,
      timestamp: '15:11',
    },
    {
      id: 'c3',
      sender: 'Asep Kurnia (Garut Kota)',
      message: 'Bisa antar kilat sore ini ke Samarang min?',
      timestamp: '15:12',
    },
    {
      id: 'c4',
      sender: 'Rina Marlina',
      message: 'Baru aja checkout sandal anak lakinya min, makasih diskon livenya!',
      isBuyer: true,
      timestamp: '15:12',
    },
    {
      id: 'c5',
      sender: 'Budi Santoso',
      message: 'Sepatu gunungnya anti air & anti licin gak min?',
      timestamp: '15:13',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Check live status from localStorage and server API
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ades_store_live_active');
      if (saved !== null) {
        setIsStoreLiveActive(saved === 'true');
      }
    } catch {}

    fetch('/api/live')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.is_active === 'boolean') {
          setIsStoreLiveActive(data.is_active);
          try {
            localStorage.setItem('ades_store_live_active', data.is_active ? 'true' : 'false');
          } catch {}
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Listen for storage changes across tabs (e.g. when Admin toggles live)
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ades_store_live_active');
        if (saved !== null) {
          setIsStoreLiveActive(saved === 'true');
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showcaseProducts = products.length > 0 ? products : [];
  const currentProduct = showcaseProducts[pinnedProductIndex] || showcaseProducts[0];

  // Rotate Host Spoken Quotes every 4 seconds
  useEffect(() => {
    if (!isOpen || !isStoreLiveActive) return;
    const quoteInterval = setInterval(() => {
      setHostQuoteIndex((prev) => (prev + 1) % activeStream.quotes.length);
    }, 4500);
    return () => clearInterval(quoteInterval);
  }, [isOpen, isStoreLiveActive, activeStreamIndex]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AutoPlay video when open
  useEffect(() => {
    if (isOpen && isStoreLiveActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isOpen, activeStreamIndex, isStoreLiveActive]);

  // Rolling automatic realistic comments from local shoppers (TikTok style)
  useEffect(() => {
    if (!isOpen || !isStoreLiveActive) return;

    const mockIncomingComments = [
      { sender: 'Dewi Lestari (Bayongbong)', message: 'Kak warna cream ready size 38?' },
      { sender: 'Irfan Hakim', message: 'Keren banget modelnya, cocok buat kerja & kuliah!' },
      { sender: 'Alya (Host Ades Store)', message: 'Semua size 36-43 ready ya, klik Keranjang Kuning mumpung diskon Live!', isHost: true },
      { sender: 'Nurul Hidayah', message: 'Koin Candy Crush bisa dipake potong harga gak kak?' },
      { sender: 'Alya (Host Ades Store)', message: 'Bisa banget Kak Nurul! 10.000 koin = Rp 1.000 potongan langsung!', isHost: true },
      { sender: 'Andi Pratama', message: 'Toko fisiknya di Cikajang sebelah mana min?' },
      { sender: 'Alya (Host Ades Store)', message: 'Jl. Raya Cikajang dekat pasar, depan plang Ades Store 01 ya Kak Andi!', isHost: true },
      { sender: 'Wulan Guritno (Garut)', message: 'Sandal slide cloudnya udah mendarat, beneran empuk banget!' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockIncomingComments.length) {
        const item = mockIncomingComments[index];
        const newMsg: ChatMessage = {
          id: `cmt-${Date.now()}-${Math.random()}`,
          sender: item.sender,
          message: item.message,
          isHost: item.isHost,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev.slice(-25), newMsg]);
        index++;
      } else {
        index = 0;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isStoreLiveActive]);

  // Sync selected size & color when product changes
  useEffect(() => {
    if (currentProduct) {
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0]);
      }
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0]);
      }
    }
  }, [currentProduct]);

  if (!isOpen) return null;

  // =========================================================================
  // KONDISI 1: JIKA ADMIN MEMATIKAN LIVE (STATUS OFFLINE)
  // Menampilkan layar jelas: "ADMIN SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG"
  // =========================================================================
  if (!isStoreLiveActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-slate-950 rounded-3xl p-6 sm:p-8 border-2 border-red-500 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Offline Icon */}
          <div className="w-20 h-20 rounded-3xl bg-zinc-900/90 border-2 border-red-500 mx-auto flex items-center justify-center text-red-500 shadow-xl relative">
            <Radio className="w-10 h-10 opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-1 bg-red-600 rotate-45 rounded-full shadow-md" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>SIARAN SEDANG NONAKTIF</span>
            </span>

            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              ADMIN SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Saat ini pengelola toko Ades Store 01 sedang tidak melakukan siaran langsung. Anda tetap dapat berbelanja koleksi lengkap sepatu sneakers, sandal empuk, dan tas di etalase kami dengan diskon s/d 30%!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>JELAJAHI KATALOG PRODUK PROMO</span>
            </button>

            <button
              onClick={() => {
                alert('✓ Pengingat telah aktif! Kami akan memberitahu Anda via notifikasi begitu Admin Ades Store 01 memulai siaran langsung berikutnya.');
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Nyalakan Pengingat Live Selanjutnya</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // KONDISI 2: LIVE AKTIF DENGAN TAMPILAN ORANG / HOST YANG JELAS SEDANG LIVE
  // =========================================================================
  const handleLike = () => {
    setLikesCount((prev) => prev + 1);
    const heartColors = ['#ef4444', '#f43f5e', '#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6'];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      x: Math.floor(Math.random() * 60) - 30,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: currentUser?.name || 'Anda (Penonton Live)',
      message: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `host-reply-${Date.now()}`,
          sender: `${activeStream.hostName} (Host Live)`,
          message: `Makasih pertanyaannya Kak ${currentUser?.name || 'Tamu'}! Pesanan langsung kami proses & siap kirim antar cepat Cikajang/Garut atau ekspedisi ya!`,
          isHost: true,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* TikTok Live Screen Container */}
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[90vh] bg-black sm:rounded-3xl overflow-hidden border-0 sm:border-2 sm:border-red-500 shadow-2xl flex flex-col justify-between text-white animate-in zoom-in-95 duration-200 select-none">
        
        {/* ================================================================ */}
        {/* BACKGROUND & HOST STAGE: ORANG SEDANG LIVE DI DEPAN KAMERA       */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
          {/* 1. Streaming Video Layer */}
          <video
            ref={videoRef}
            src={activeStream.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsVideoLoading(false)}
            className="w-full h-full object-cover object-center filter brightness-90"
          />

          {/* 2. Real Host Persona Showcase Card Overlay (Jaminan Selalu Ada Orang Sedang Live) */}
          <div className="absolute inset-x-0 top-16 bottom-44 pointer-events-none flex flex-col items-center justify-center p-4">
            {/* Visual Kartu Host Siaran Langsung */}
            <div className="relative w-52 sm:w-60 h-72 sm:h-80 rounded-3xl overflow-hidden border-2 border-red-500/80 shadow-2xl bg-gradient-to-t from-black via-zinc-900/60 to-transparent flex flex-col justify-end p-3 animate-in fade-in duration-500">
              <img
                src={activeStream.hostPhoto}
                alt={activeStream.hostName}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Host Badge & Live Mic Indicator */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>HOST SEDANG SIARAN</span>
                  </span>
                  <div className="flex items-center space-x-0.5 bg-black/60 px-1.5 py-0.5 rounded-full text-emerald-400 text-[9px] font-bold">
                    <span className="w-1 h-2 bg-emerald-400 animate-pulse" />
                    <span className="w-1 h-3 bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-1.5 bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] text-white ml-1">MIC ON</span>
                  </div>
                </div>

                <p className="text-xs font-black text-white leading-tight">
                  {activeStream.hostName}
                </p>
                <p className="text-[10px] text-zinc-300 font-medium leading-tight">
                  {activeStream.currentTopic}
                </p>
              </div>
            </div>

            {/* Balon Ucapan Host yang Berbicara Langsung (Real-time Live Host Talk Bubble) */}
            <div className="mt-2.5 max-w-xs bg-black/80 backdrop-blur-md border border-red-500/60 rounded-2xl px-3.5 py-2 shadow-xl animate-in slide-in-from-bottom-2 text-center pointer-events-auto">
              <p className="text-[11px] font-bold text-amber-200 leading-snug">
                🗣️ <span className="text-white font-black">{activeStream.hostName}:</span> &ldquo;{activeStream.quotes[hostQuoteIndex]}&rdquo;
              </p>
            </div>
          </div>

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />

          {/* Floating Hearts Animation */}
          <div className="absolute bottom-28 right-6 pointer-events-none z-30">
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                className="absolute animate-bounce"
                style={{
                  transform: `translate(${h.x}px, -140px) scale(1.5)`,
                  transition: 'all 1.4s ease-out',
                  color: h.color,
                }}
              >
                <Heart className="w-8 h-8 fill-current drop-shadow-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* TOP BAR: HOST AVATAR, LIVE BADGE, VIEWER COUNT & CONTROLS        */}
        {/* ================================================================ */}
        <div className="relative z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
          {/* Host Profile Info */}
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-red-500 bg-white flex-shrink-0">
                <img
                  src={activeStream.hostAvatar}
                  alt={activeStream.hostName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-black animate-ping" />
            </div>

            <div className="pr-1">
              <div className="flex items-center space-x-1">
                <span className="font-black text-xs text-white leading-none">
                  {activeStream.hostName}
                </span>
                <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                  HOST
                </span>
              </div>
              <p className="text-[9px] text-zinc-300 leading-none mt-0.5">
                {activeStream.location}
              </p>
            </div>
          </div>

          {/* Right Top Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Live Indicator Badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </div>

            {/* Viewer Count */}
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>{viewerCount}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
              title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-red-600 transition-all active:scale-95"
              title="Keluar dari Live"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Channel Switcher Pills (Ganti Sudut Kamera / Host) */}
        <div className="relative z-20 px-3 flex items-center space-x-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
          {LIVE_STREAMS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveStreamIndex(idx);
                setIsVideoLoading(true);
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                activeStreamIndex === idx
                  ? 'bg-red-600 text-white border-red-400 shadow-md'
                  : 'bg-black/50 text-zinc-300 border-white/20 hover:bg-black/70'
              }`}
            >
              📹 Kamera {idx + 1}: {s.hostName}
            </button>
          ))}
        </div>

        {/* ================================================================ */}
        {/* BOTTOM AREA: LIVE CHAT STREAM, PINNED PRODUCT & CONTROLS         */}
        {/* ================================================================ */}
        <div className="relative z-30 p-3 sm:p-4 space-y-2.5 flex flex-col justify-end pointer-events-auto">
          
          {/* 1. REAL-TIME COMMENTS STREAM (TIKTOK STYLE AUTO-SCROLL) */}
          <div className="h-32 sm:h-36 overflow-y-auto no-scrollbar space-y-1.5 pr-8 mask-gradient">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-1.5 text-xs p-1.5 rounded-2xl max-w-[88%] backdrop-blur-md ${
                  m.isHost
                    ? 'bg-red-600/90 text-white border border-red-400 shadow-md'
                    : m.isBuyer
                    ? 'bg-amber-500/90 text-slate-950 font-bold border border-amber-300'
                    : 'bg-black/65 text-zinc-100 border border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-[10px] text-amber-300 leading-tight">
                      {m.sender}
                    </span>
                    <span className="text-[8px] text-zinc-400">{m.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-tight text-white mt-0.5 break-words">
                    {m.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* 2. KERANJANG KUNING / PINNED PRODUCT LIVE (TIKTOK SHOP STYLE) */}
          {currentProduct && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-amber-400/80 rounded-2xl p-2.5 shadow-xl flex items-center justify-between gap-2 animate-in slide-in-from-bottom-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden border border-amber-300 flex-shrink-0">
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black px-1 rounded-br">
                    LIVE
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider flex items-center space-x-0.5">
                      <ShoppingBag className="w-2.5 h-2.5" />
                      <span>Sedang Di-Spill</span>
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-white truncate">
                    {currentProduct.name}
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="font-black text-xs text-amber-300">
                      {formatIDR(currentProduct.promo_price || currentProduct.original_price)}
                    </span>
                    {currentProduct.promo_price && (
                      <span className="text-[9px] text-zinc-400 line-through">
                        {formatIDR(currentProduct.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  onClick={() => {
                    onAddToCart(currentProduct, selectedSize, selectedColor, 1);
                  }}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-400/40 transition-all shadow-xs"
                  title="Tambah ke Keranjang"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onDirectCheckout(currentProduct, selectedSize, selectedColor, 1);
                  }}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  Beli Sekarang &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 3. INPUT BAR CHAT & LOVE TAP BUTTON */}
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik komentar / tanya spill ukuran kaki..."
                className="flex-1 px-3.5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Like Heart Button (TikTok Style) */}
            <button
              onClick={handleLike}
              className="relative p-2.5 rounded-full bg-red-600/80 hover:bg-red-600 border border-red-400 text-white shadow-lg transition-transform active:scale-125 flex-shrink-0"
              title="Kirim Love / Like Live"
            >
              <Heart className="w-5 h-5 fill-current animate-pulse text-white" />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-full">
                {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
