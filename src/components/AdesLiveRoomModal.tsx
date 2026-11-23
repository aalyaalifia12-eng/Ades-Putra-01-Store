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
  // Pinned Product being showcased in the live stream
  const [pinnedProductIndex, setPinnedProductIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | string>(39);
  const [selectedColor, setSelectedColor] = useState<string>('Hitam Putih');

  // Live Stats
  const [viewerCount, setViewerCount] = useState(248);
  const [likesCount, setLikesCount] = useState(1420);
  const [isMuted, setIsMuted] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Live Chat System
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'Siti Rahmawati (Cikajang)',
      message: 'Kak spill sneakers putih size 39 dong!',
      timestamp: '15:10',
    },
    {
      id: 'c2',
      sender: 'Alya (Host Ades Store)',
      message: 'Halo Kak Siti! Ini lagi di-spill ya, empuk banget bahannya & garansi retur 7 hari ya!',
      isHost: true,
      timestamp: '15:11',
    },
    {
      id: 'c3',
      sender: 'Asep Saepuloh (Garut Kota)',
      message: 'Bisa kurir kilat antar ke Samarang min?',
      timestamp: '15:12',
    },
    {
      id: 'c4',
      sender: 'Rina Marlina',
      message: 'Baru aja checkout tas ranselnya min, makasih diskon livenya!',
      isBuyer: true,
      timestamp: '15:12',
    },
    {
      id: 'c5',
      sender: 'Budi Santoso',
      message: 'Sepatu gunungnya solnya anti selip gak min?',
      timestamp: '15:13',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Available showcase products from the store
  const showcaseProducts = products.length > 0 ? products : [];
  const currentProduct = showcaseProducts[pinnedProductIndex] || showcaseProducts[0];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic automatic mock comments streaming in
  useEffect(() => {
    if (!isOpen) return;

    const mockIncomingComments = [
      { sender: 'Dewi Lestari (Bayongbong)', message: 'Kak warna cream ready size 38?' },
      { sender: 'Irfan Hakim', message: 'Keren banget modelnya, cocok buat sekolah & kuliah' },
      { sender: 'Alya (Host Ades Store)', message: 'Semua size 36-43 ready ya kak, langsung klik Beli di Live mumpung diskon!', isHost: true },
      { sender: 'Nurul Hidayah', message: 'Ada bonus koin belanja juga gak min?' },
      { sender: 'Andi Pratama', message: 'Toko fisiknya di Cikajang sebelah mana min?' },
      { sender: 'Alya (Host Ades Store)', message: 'Dekat pasar Cikajang ya kak, bisa ambil di toko juga gratis ongkir!', isHost: true },
      { sender: 'Fitri Handayani', message: 'Wah gratis ongkir, langsung co deh!' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockIncomingComments.length) {
        const item = mockIncomingComments[index];
        setMessages((prev) => [
          ...prev,
          {
            id: `auto-${Date.now()}`,
            sender: item.sender,
            message: item.message,
            isHost: item.isHost,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        // Realistic slight viewer count change
        setViewerCount((v) => v + Math.floor(Math.random() * 5) - 2);
        index++;
      }
    }, 4500);

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

  // Handle Add Like (Floating hearts animation)
  const handleLike = () => {
    setLikesCount((prev) => prev + 1);
    const heartColors = ['#ef4444', '#f43f5e', '#ec4899', '#f59e0b', '#3b82f6'];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      x: Math.floor(Math.random() * 60) - 30,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  // Send User Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: currentUser?.name || 'Anda (Penonton)',
      message: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Host responds after 2.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `host-reply-${Date.now()}`,
          sender: 'Alya (Host Ades Store)',
          message: `Makasih pertanyaannya Kak ${currentUser?.name || 'Tamu'}! Barang siap dikirim via Kurir Kilat Cikajang/Garut atau ekspedisi ya!`,
          isHost: true,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[86vh] bg-slate-950 rounded-3xl overflow-hidden border-2 border-red-500 shadow-2xl flex flex-col justify-between text-white animate-in zoom-in-95 duration-200">
        {/* ================================================================ */}
        {/* TOP BAR OVERLAY: HOST INFO & VIEWER STATS                        */}
        {/* ================================================================ */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-auto">
          {/* Host Profile Info */}
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-white/20">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-500 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
                  alt="Alya Alifia Host"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-black animate-ping" />
            </div>

            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-xs text-white leading-none">
                  Alya &bull; Ades Store 01
                </span>
                <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-red-600 text-white">
                  HOST
                </span>
              </div>
              <p className="text-[9px] text-zinc-300 leading-none mt-0.5">
                Live dari Store Cikajang &bull; Garut
              </p>
            </div>
          </div>

          {/* Right Top Controls */}
          <div className="flex items-center space-x-2">
            {/* Live Badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </div>

            {/* Viewers */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>{viewerCount}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
              title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-red-600 transition-colors"
              title="Keluar dari Live"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MAIN VIDEO BACKGROUND: SHOWROOM STREAMING DISPLAY                */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-b from-slate-900 via-zinc-900 to-black flex items-center justify-center">
          {/* Live Studio Display Mockup with Image & Ambient Effects */}
          {currentProduct && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={currentProduct.image_url}
                alt={currentProduct.name}
                className="w-full h-full object-cover object-center opacity-75 scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

              {/* Dynamic Live Banner Overlay in Center-Top */}
              <div className="absolute top-20 z-20 px-4 text-center space-y-1 pointer-events-none">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sedang Di-Spill Host Langsung</span>
                </span>
                <h3 className="font-black text-lg sm:text-xl text-white drop-shadow-md">
                  {currentProduct.name}
                </h3>
                <p className="text-xs text-amber-300 font-bold drop-shadow">
                  ⚡ Diskon Eksklusif Live &bull; Garansi Retur 7 Hari &bull; Ready Cikajang
                </p>
              </div>
            </div>
          )}

          {/* Floating Floating Hearts Animation */}
          <div className="absolute bottom-40 right-6 pointer-events-none z-40">
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                className="absolute animate-bounce"
                style={{
                  transform: `translate(${h.x}px, -120px) scale(1.4)`,
                  transition: 'all 1.5s ease-out',
                  color: h.color,
                }}
              >
                <Heart className="w-7 h-7 fill-current drop-shadow-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM AREA: LIVE CHAT STREAM, PINNED PRODUCT & CONTROLS         */}
        {/* ================================================================ */}
        <div className="relative z-30 flex flex-col justify-end p-3 sm:p-4 space-y-2 pointer-events-auto">
          {/* Product Switcher Pills (Pilihan Produk Lain yang sedang live) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-black uppercase bg-black/70 px-2 py-1 rounded-lg text-amber-400 border border-amber-400/30 whitespace-nowrap">
              Katalog Live:
            </span>
            {showcaseProducts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setPinnedProductIndex(idx)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                  pinnedProductIndex === idx
                    ? 'bg-red-600 text-white border-red-500 shadow-md scale-105'
                    : 'bg-black/60 text-zinc-300 border-white/20 hover:bg-white/10'
                }`}
              >
                #{idx + 1} {p.name.slice(0, 15)}...
              </button>
            ))}
          </div>

          {/* Chat Comments Stream (Shopee Live / TikTok style) */}
          <div className="h-32 sm:h-36 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/20 mask-radial">
            {messages.map((m) => (
              <div
                key={m.id}
                className="inline-block max-w-[90%] bg-black/65 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/15 text-xs shadow-xs animate-in slide-in-from-bottom-2"
              >
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`font-black text-[11px] ${
                      m.isHost
                        ? 'text-red-400'
                        : m.isBuyer
                        ? 'text-amber-400'
                        : 'text-zinc-200'
                    }`}
                  >
                    {m.sender}
                  </span>
                  {m.isHost && (
                    <span className="text-[8px] font-black uppercase bg-red-600 text-white px-1 rounded">
                      HOST
                    </span>
                  )}
                  {m.isBuyer && (
                    <span className="text-[8px] font-black uppercase bg-amber-500 text-black px-1 rounded">
                      PEMBELI
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/95 leading-snug mt-0.5">
                  {m.message}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* PINNED PRODUCT CARD ("KERANJANG KUNING" PRODUK SEDANG DI-SPILL) */}
          {currentProduct && (
            <div className="bg-white text-slate-900 rounded-3xl p-3 border-2 border-red-500 shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                    📌 Sedang Di-Spill di Live Streaming
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  Stok Siap Kirim
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {currentProduct.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-sm font-black text-red-600 font-mono">
                      {formatIDR(currentProduct.promo_price || currentProduct.original_price)}
                    </span>
                    {currentProduct.promo_price && (
                      <span className="text-[10px] text-slate-400 line-through font-mono">
                        {formatIDR(currentProduct.original_price)}
                      </span>
                    )}
                    <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                      Harga Live
                    </span>
                  </div>

                  {/* Size Options Selector */}
                  <div className="flex items-center space-x-1 mt-1 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-bold text-slate-500 mr-1">
                      Size:
                    </span>
                    {currentProduct.sizes.slice(0, 5).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                          selectedSize === sz
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Direct Checkout */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(currentProduct, selectedSize, selectedColor, 1);
                  }}
                  className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center space-x-1 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDirectCheckout(currentProduct, selectedSize, selectedColor, 1);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 flex items-center justify-center space-x-1 transition-all transform active:scale-95"
                >
                  <span>Beli di Live Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Chat Form & Floating Like Button */}
          <div className="flex items-center space-x-2 pt-1">
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-1.5">
              <input
                type="text"
                placeholder="Tulis komentar atau tanya ukuran..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-black/60 border border-white/20 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Like Floating Heart Button with Count */}
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center space-x-1 px-3 py-2 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white font-black text-xs shadow-lg transition-transform active:scale-125"
              title="Kirim Love ke Host!"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="font-mono text-[11px]">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
