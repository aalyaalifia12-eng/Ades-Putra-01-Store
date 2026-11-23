'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Eye,
  Heart,
  ShoppingBag,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Camera,
  CheckCircle2,
  Tag,
  Star,
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

export default function AdesLiveRoomModal({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onDirectCheckout,
  currentUser,
}: AdesLiveRoomModalProps) {
  // Live State
  const [isStoreLiveActive, setIsStoreLiveActive] = useState<boolean>(true);
  const [adminLiveFrame, setAdminLiveFrame] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);

  // Viewer & Likes count
  const [viewerCount, setViewerCount] = useState<number>(385);
  const [likesCount, setLikesCount] = useState<number>(2450);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Pinned Product Index (Keranjang Kuning)
  const [pinnedProductIndex, setPinnedProductIndex] = useState(0);
  const [isProductTrayOpen, setIsProductTrayOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | string>(40);
  const [selectedColor, setSelectedColor] = useState<string>('Hitam');

  // Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      sender: 'Siti Aminah (Cikajang)',
      message: 'Min spill sneakers memory foam ukuran 39 dong!',
      timestamp: '15:20',
    },
    {
      id: 'c-2',
      sender: 'Admin Ades Store 01',
      message: 'Halo semua warga Cikajang & Garut! Silakan tanya ukuran & klik Keranjang Kuning ya!',
      isHost: true,
      timestamp: '15:21',
    },
    {
      id: 'c-3',
      sender: 'Dadan Saepuloh',
      message: 'Bisa langsung antar sore ini ke daerah Cisurupan min?',
      timestamp: '15:22',
    },
    {
      id: 'c-4',
      sender: 'Admin Ades Store 01',
      message: 'Bisa banget Kak Dadan! Antar cepat Cikajang & Garut langsung sampai!',
      isHost: true,
      timestamp: '15:22',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync Live Status and Real-time Camera Feed from Admin
  useEffect(() => {
    if (!isOpen) return;

    // 1. Check local storage
    try {
      const savedLive = localStorage.getItem('ades_store_live_active');
      if (savedLive !== null) {
        setIsStoreLiveActive(savedLive === 'true');
      }
      const savedFrame = localStorage.getItem('ades_live_latest_frame');
      if (savedFrame) {
        setAdminLiveFrame(savedFrame);
        setIsConnecting(false);
      }
    } catch {}

    // 2. Fetch from backend API
    fetch('/api/live')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.is_active === 'boolean') {
          setIsStoreLiveActive(data.is_active);
          if (data.latest_frame) {
            setAdminLiveFrame(data.latest_frame);
            setIsConnecting(false);
          }
        }
      })
      .catch(() => {});

    // 3. Listen to real-time BroadcastChannel from AdminLiveStudioModal
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('ades_live_stream_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LIVE_FRAME' && event.data.frame) {
          setAdminLiveFrame(event.data.frame);
          setIsConnecting(false);
          setIsStoreLiveActive(true);
        } else if (event.data?.type === 'LIVE_STOPPED') {
          setIsStoreLiveActive(false);
          setAdminLiveFrame(null);
        }
      };
    } catch {}

    // 4. Poll fallback every 1.5 seconds for multi-device sync
    const pollInterval = setInterval(() => {
      fetch('/api/live')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.is_active === 'boolean') {
            setIsStoreLiveActive(data.is_active);
            if (data.is_active && data.latest_frame) {
              setAdminLiveFrame(data.latest_frame);
              setIsConnecting(false);
            }
          }
        })
        .catch(() => {});
    }, 1500);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ades_store_live_active' && e.newValue !== null) {
        setIsStoreLiveActive(e.newValue === 'true');
      }
      if (e.key === 'ades_live_latest_frame' && e.newValue) {
        setAdminLiveFrame(e.newValue);
        setIsConnecting(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }, [isOpen]);

  const showcaseProducts = products.length > 0 ? products : [];
  const currentProduct = showcaseProducts[pinnedProductIndex] || showcaseProducts[0];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Rolling automatic realistic comments from local shoppers (TikTok style)
  useEffect(() => {
    if (!isOpen || !isStoreLiveActive) return;

    const mockIncomingComments = [
      { sender: 'Dewi Lestari (Bayongbong)', message: 'Kak warna cream ready size 38?' },
      { sender: 'Irfan Hakim', message: 'Keren banget modelnya, cocok buat kerja & kuliah!' },
      { sender: 'Admin Ades Store 01', message: 'Semua size 36-43 ready ya, klik Keranjang Kuning mumpung diskon Live!', isHost: true },
      { sender: 'Nurul Hidayah', message: 'Bisa tukar ukuran kalau kebesaran min?' },
      { sender: 'Admin Ades Store 01', message: 'Bisa banget Kak! Ada garansi retur tukar barang & size 7 hari!', isHost: true },
      { sender: 'Andi Pratama', message: 'Toko fisiknya di Cikajang sebelah mana min?' },
      { sender: 'Admin Ades Store 01', message: 'Jl. Raya Cikajang dekat pasar, depan plang Ades Store 01 ya Kak Andi!', isHost: true },
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
    }, 4500);

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
  // Menampilkan tulisan jelas: "ADMIN SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG"
  // =========================================================================
  if (!isStoreLiveActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200 text-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Offline Icon */}
          <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-500 mx-auto flex items-center justify-center text-red-600 shadow-xl relative">
            <Radio className="w-10 h-10 opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-1 bg-red-600 rotate-45 rounded-full shadow-md" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-[10px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>SIARAN NONAKTIF</span>
            </span>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              ADMIN SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Admin Ades Store 01 saat ini sedang tidak melakukan siaran langsung. Anda tetap dapat melihat dan memesan koleksi sepatu, sandal, dan tas sekolah langsung di katalog etalase toko kami!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>KEMBALI BELANJA DI ETALASE TOKO</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // KONDISI 2: LIVE AKTIF DENGAN 1 KAMERA REAL TIME DARI LIVE ADMIN
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
          sender: 'Admin Ades Store 01 (Host Live)',
          message: `Terima kasih atas pertanyaannya Kak ${currentUser?.name || 'Tamu'}! Pesanan langsung kami proses & siap antar cepat Cikajang & Garut ya!`,
          isHost: true,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  const displayPrice = currentProduct?.promo_price || currentProduct?.price || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* TikTok Live Screen Container (1 Kamera Saja) */}
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[90vh] bg-black sm:rounded-3xl overflow-hidden border-0 sm:border-2 sm:border-red-500 shadow-2xl flex flex-col justify-between text-white animate-in zoom-in-95 duration-200 select-none">
        
        {/* ================================================================ */}
        {/* BACKGROUND: 1 KAMERA REAL-TIME LANGSUNG DARI LIVE ADMIN          */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950 flex items-center justify-center">
          {adminLiveFrame ? (
            /* Video Real-Time Kamera Admin */
            <img
              src={adminLiveFrame}
              alt="Video Siaran Langsung Real Time Admin Ades Store 01"
              className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
            />
          ) : (
            /* Menghubungkan ke Kamera Real-time Admin */
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
                <Camera className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white">
                  Menghubungkan ke Kamera Real-Time Admin...
                </p>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Siaran langsung kamera utama dari Studio Toko Ades Putra 01 Cikajang & Garut.
                </p>
              </div>
            </div>
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 pointer-events-none" />

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
        {/* TOP BAR: HOST INFO, 1 KAMERA REAL-TIME BADGE, & CLOSE            */}
        {/* ================================================================ */}
        <div className="relative z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
          {/* Host Profile Info */}
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-500 bg-white flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Ades Store 01"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black animate-ping" />
            </div>

            <div className="pr-1">
              <div className="flex items-center space-x-1">
                <span className="font-black text-xs text-white leading-none">
                  Ades Putra 01
                </span>
                <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded-full bg-red-600 text-white">
                  ADMIN LIVE
                </span>
              </div>
              <p className="text-[9px] text-zinc-300 leading-none mt-0.5">
                Studio Toko Cikajang, Garut
              </p>
            </div>
          </div>

          {/* Right Top Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Live Indicator Badge (1 Kamera Saja) */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="hidden sm:inline">LIVE KAMERA REAL TIME</span>
              <span className="sm:hidden">LIVE</span>
            </div>

            {/* Viewer Count */}
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>{viewerCount}</span>
            </div>

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

        {/* ================================================================ */}
        {/* BOTTOM AREA: LIVE CHAT STREAM, KERANJANG KUNING & CONTROLS       */}
        {/* ================================================================ */}
        <div className="relative z-30 p-3 sm:p-4 space-y-2.5 flex flex-col justify-end pointer-events-auto">
          
          {/* 1. REAL-TIME COMMENTS STREAM (TIKTOK STYLE AUTO-SCROLL) */}
          <div className="h-28 sm:h-32 overflow-y-auto no-scrollbar space-y-1.5 pr-8">
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
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="font-black text-sm text-red-500">
                      {formatIDR(displayPrice)}
                    </span>
                    {currentProduct.promo_price && (
                      <span className="text-[10px] text-zinc-400 line-through">
                        {formatIDR(currentProduct.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action: Beli Langsung saat Live */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductTrayOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center space-x-1 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 fill-current" />
                  <span>Beli</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. BOTTOM CONTROLS: CHAT INPUT & LIKE HEART BUTTON */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => setIsProductTrayOpen(true)}
              className="relative p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg flex-shrink-0 transition-transform active:scale-90"
              title="Keranjang Kuning Live"
            >
              <ShoppingBag className="w-5 h-5 fill-current" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-white">
                {showcaseProducts.length}
              </span>
            </button>

            <form onSubmit={handleSendMessage} className="flex-1 flex items-center relative">
              <input
                type="text"
                placeholder="Tanya ukuran atau spill produk..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-black/60 border border-white/20 focus:border-red-500 rounded-2xl py-2 pl-3 pr-9 text-xs text-white placeholder-zinc-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={handleLike}
              className="p-2.5 rounded-2xl bg-black/60 border border-white/20 hover:border-red-500 text-rose-500 shadow-lg flex-shrink-0 transition-transform active:scale-90 flex items-center justify-center"
              title="Kirim Love"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TRAY: DAFTAR ETALASE PRODUK LIVE (KERANJANG KUNING TIKTOK)       */}
        {/* ================================================================ */}
        {isProductTrayOpen && (
          <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-slate-900 border-t-2 border-red-500 rounded-t-3xl max-h-[75%] p-4 flex flex-col space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400">🛍️</span>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider">
                    Etalase Keranjang Kuning Live ({showcaseProducts.length})
                  </h4>
                </div>
                <button
                  onClick={() => setIsProductTrayOpen(false)}
                  className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product List */}
              <div className="overflow-y-auto space-y-2.5 max-h-60 pr-1">
                {showcaseProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      pinnedProductIndex === idx
                        ? 'bg-zinc-800 border-amber-400'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-xs text-white truncate">{p.name}</p>
                        <p className="text-xs font-black text-red-500 mt-0.5">
                          {formatIDR(p.promo_price || p.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setPinnedProductIndex(idx);
                          setIsProductTrayOpen(false);
                        }}
                        className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-200"
                      >
                        Pilih
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDirectCheckout(
                            p,
                            p.sizes?.[0] || 40,
                            p.colors?.[0] || 'Hitam',
                            1
                          );
                          setIsProductTrayOpen(false);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase shadow-xs"
                      >
                        Beli Langsung
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
