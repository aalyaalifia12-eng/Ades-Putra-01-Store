'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Eye,
  Heart,
  MessageSquare,
  ShoppingBag,
  Send,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Crown,
  Tag,
  Star,
  Video,
  Play,
  RotateCcw,
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

// Preset live streaming video channels showing real persons showcasing shoes & fashion live
const LIVE_STREAMS = [
  {
    id: 'stream-1',
    title: 'Spill Langsung Sepatu Sneakers & Sandal Anak - Host Alya',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-tying-her-sneakers-shoes-42993-large.mp4',
    hostName: 'Alya Alifia',
    hostRole: 'Host Live Ades Store 01',
    hostAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    location: 'Studio Toko Cikajang, Garut',
  },
  {
    id: 'stream-2',
    title: 'Review Fisik Sol Empuk & Sepatu Olahraga Running',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-tying-running-shoes-42994-large.mp4',
    hostName: 'Asep Saepuloh',
    hostRole: 'Co-Host Reviewer Toko',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: 'Gudang Display Garut',
  },
  {
    id: 'stream-3',
    title: 'Unboxing Sepatu Sekolah & Tas Ransel TK/SD/SMA',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-pair-of-shoes-42996-large.mp4',
    hostName: 'Alya & Tim',
    hostRole: 'Spill Paket Back to School',
    hostAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    location: 'Store Cikajang Garut',
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
  const [viewerCount, setViewerCount] = useState(382);
  const [likesCount, setLikesCount] = useState(2840);
  const [isMuted, setIsMuted] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

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

  const showcaseProducts = products.length > 0 ? products : [];
  const currentProduct = showcaseProducts[pinnedProductIndex] || showcaseProducts[0];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Video Loading & AutoPlay
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy might require muted initially
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isOpen, activeStreamIndex]);

  // Incoming automatic realistic comments rolling in (like TikTok Live)
  useEffect(() => {
    if (!isOpen) return;

    const mockIncomingComments = [
      { sender: 'Dewi Lestari (Bayongbong)', message: 'Kak warna cream ready size 38?' },
      { sender: 'Irfan Hakim', message: 'Keren banget modelnya, cocok buat kerja & kuliah!' },
      { sender: 'Alya (Host Ades Store)', message: 'Semua size 36-43 ready ya, klik Keranjang Kuning mumpung diskon Live!', isHost: true },
      { sender: 'Nurul Hidayah', message: 'Koin Candy Crush bisa dipake potong harga gak kak?' },
      { sender: 'Alya (Host Ades Store)', message: 'Bisa banget Kak Nurul! 10.000 koin = Rp 1.000 potongan langsung!', isHost: true },
      { sender: 'Andi Pratama', message: 'Toko fisiknya di Cikajang sebelah mana min?' },
      { sender: 'Alya (Host Ades Store)', message: 'Dekat pasar Cikajang ya kak, bisa ambil di toko juga gratis ongkir!', isHost: true },
      { sender: 'Fitri Handayani', message: 'Wah gratis ongkir, langsung CO sepatu sekolah anak!' },
      { sender: 'Rizky Ramadhan', message: 'Garansi retur kalau kekecilan ada kan min?' },
      { sender: 'Alya (Host Ades Store)', message: 'Garansi retur 7 hari bebas tukar size Kak Rizky, belanja tenang!', isHost: true },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockIncomingComments.length) {
        const item = mockIncomingComments[index];
        setMessages((prev) => [
          ...prev,
          {
            id: `auto-${Date.now()}-${Math.random()}`,
            sender: item.sender,
            message: item.message,
            isHost: item.isHost,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        // Viewer count fluctuation
        setViewerCount((v) => Math.max(120, v + Math.floor(Math.random() * 7) - 3));
        // Random like burst
        setLikesCount((l) => l + Math.floor(Math.random() * 4) + 1);
        index++;
      } else {
        index = 0; // Loop comments
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isOpen]);

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

  // Handle Add Like (Floating hearts animation like TikTok)
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

  // Send User Chat
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

    // Host responds in real-time
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `host-reply-${Date.now()}`,
          sender: 'Alya (Host Ades Store)',
          message: `Makasih pertanyaannya Kak ${currentUser?.name || 'Tamu'}! Pesanan langsung kami proses & siap kirim antar cepat Cikajang/Garut atau ekspedisi ya!`,
          isHost: true,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* TikTok Live Screen Container */}
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[90vh] bg-black sm:rounded-3xl overflow-hidden border-0 sm:border-2 sm:border-red-500 shadow-2xl flex flex-col justify-between text-white animate-in zoom-in-95 duration-200 select-none">
        
        {/* ================================================================ */}
        {/* BACKGROUND: REAL LIVE STREAMING VIDEO (ORANG SEDANG LIVE)         */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={activeStream.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsVideoLoading(false)}
            className="w-full h-full object-cover object-center filter brightness-95"
          />

          {/* Fallback gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />

          {/* Loading Indicator */}
          {isVideoLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 space-y-2">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-white">Menghubungkan ke Live Host...</p>
            </div>
          )}

          {/* Floating Hearts Animation Container (TikTok Style) */}
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
        {/* TOP BAR OVERLAY: HOST PROFILE, LIVE BADGE & VIEWER COUNTER        */}
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
              <span className="w-2 h-2 rounded-full bg-white" />
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
          <div className="h-36 sm:h-40 overflow-y-auto no-scrollbar space-y-1.5 pr-8 mask-gradient">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-1.5 text-xs p-1.5 rounded-2xl max-w-[85%] backdrop-blur-md ${
                  m.isHost
                    ? 'bg-red-950/80 border border-red-500/80 text-white'
                    : m.isBuyer
                    ? 'bg-emerald-950/80 border border-emerald-500/80 text-white'
                    : 'bg-black/50 text-zinc-100 border border-white/10'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] flex-shrink-0 font-bold">
                  {m.isHost ? '👑' : m.isBuyer ? '🛍️' : '💬'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`font-black text-[10px] truncate ${
                        m.isHost ? 'text-amber-300' : m.isBuyer ? 'text-emerald-300' : 'text-zinc-300'
                      }`}
                    >
                      {m.sender}
                    </span>
                    {m.isHost && (
                      <span className="text-[7px] font-black uppercase px-1 py-0.2 rounded bg-red-600 text-white">
                        HOST
                      </span>
                    )}
                    {m.isBuyer && (
                      <span className="text-[7px] font-black uppercase px-1 py-0.2 rounded bg-emerald-600 text-white">
                        BELI
                      </span>
                    )}
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
                      {formatIDR(currentProduct.promo_price || currentProduct.price)}
                    </span>
                    {currentProduct.promo_price && (
                      <span className="text-[9px] text-zinc-400 line-through">
                        {formatIDR(currentProduct.price)}
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
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-xs shadow-lg transition-all active:scale-95 flex items-center space-x-1 whitespace-nowrap"
                >
                  <span>Beli Langsung</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. INTERACTION BAR: CHAT INPUT & LIKE BUTTON (TIKTOK STYLE) */}
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya ukuran / spill sepatu di komentar..."
                className="flex-1 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Big Heart Like Button */}
            <button
              onClick={handleLike}
              className="relative p-2.5 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-lg active:scale-125 transition-transform group flex items-center justify-center flex-shrink-0"
              title="Kirim Like Hati"
            >
              <Heart className="w-5 h-5 fill-current animate-pulse text-white" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-black px-1 rounded-full border border-red-400">
                {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
