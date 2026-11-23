'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  RotateCw,
  ShoppingBag,
  Send,
  Eye,
  Heart,
  Flame,
  CheckCircle2,
  Sparkles,
  Play,
  Square,
  Users,
  Settings,
  AlertCircle,
  Video,
} from 'lucide-react';
import { Product } from '@/types';
import { formatIDR } from '@/lib/utils';

interface AdminLiveStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  isLiveActive: boolean;
  onToggleLive: (active: boolean) => void;
}

interface LiveComment {
  id: string;
  sender: string;
  message: string;
  isHost?: boolean;
  time: string;
}

export default function AdminLiveStudioModal({
  isOpen,
  onClose,
  products,
  isLiveActive,
  onToggleLive,
}: AdminLiveStudioModalProps) {
  // Live Broadcast Duration Timer
  const [liveDuration, setLiveDuration] = useState(0);

  // Camera & Mic Controls
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCameraError, setHasCameraError] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // Live Stats
  const [viewerCount, setViewerCount] = useState(384);
  const [likesCount, setLikesCount] = useState(2910);
  const [ordersDuringLive, setOrdersDuringLive] = useState(6);

  // Pinned Product
  const [pinnedProductId, setPinnedProductId] = useState<string>(
    products[0]?.id || ''
  );

  // Live Chat
  const [hostReplyText, setHostReplyText] = useState('');
  const [comments, setComments] = useState<LiveComment[]>([
    {
      id: 'lc-1',
      sender: 'Dewi Sartika (Cikajang)',
      message: 'Min spill sandal anak cowok yang model gunung dong!',
      time: '15:20',
    },
    {
      id: 'lc-2',
      sender: 'Budi Santoso',
      message: 'Ada diskon live gak buat sneakers aerocushion?',
      time: '15:21',
    },
    {
      id: 'lc-3',
      sender: 'Rina Marlina (Garut Kota)',
      message: 'Udah CO 2 pasang min, kirim hari ini ya!',
      time: '15:22',
    },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Live Duration Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveActive) {
      timer = setInterval(() => {
        setLiveDuration((d) => d + 1);
      }, 1000);
    } else {
      setLiveDuration(0);
    }
    return () => clearInterval(timer);
  }, [isLiveActive]);

  // Camera Stream Setup
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      return;
    }

    if (cameraActive && !isSimulationMode) {
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, cameraActive, facingMode, isSimulationMode]);

  // Start Camera Function
  const startCamera = async () => {
    stopCameraStream();
    setHasCameraError(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: micActive,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setHasCameraError(true);
        setIsSimulationMode(true);
      }
    } catch (err) {
      console.warn('[AdminLive] Camera access error or blocked:', err);
      setHasCameraError(true);
      setIsSimulationMode(true);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

  // Flip Camera (User <-> Environment)
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    setCameraActive((prev) => !prev);
  };

  // Toggle Mic
  const handleToggleMic = () => {
    setMicActive((prev) => {
      const next = !prev;
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  // Realistic simulated incoming viewer comments when live
  useEffect(() => {
    if (!isOpen || !isLiveActive) return;

    const mockMessages = [
      { sender: 'Asep Saepuloh', message: 'Keren banget min gambarnya jernih!' },
      { sender: 'Siti Nurhaliza', message: 'Spill ukuran 39 min warna putih' },
      { sender: 'Rian Bayongbong', message: 'Bisa COD bayar di tempat kan min?' },
      { sender: 'Putri Ayu', message: 'Udah checkout ya min, minta dikirim hari ini' },
      { sender: 'Deden Cikajang', message: 'Toko buka sampai jam berapa min?' },
      { sender: 'Maya Melati', message: 'Sandal anak laki ada model apa aja min?' },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < mockMessages.length) {
        const msg = mockMessages[idx];
        setComments((prev) => [
          ...prev,
          {
            id: `admin-c-${Date.now()}-${Math.random()}`,
            sender: msg.sender,
            message: msg.message,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setViewerCount((v) => v + Math.floor(Math.random() * 6) - 2);
        setLikesCount((l) => l + Math.floor(Math.random() * 5) + 1);
        if (Math.random() > 0.6) {
          setOrdersDuringLive((o) => o + 1);
        }
        idx++;
      } else {
        idx = 0;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isLiveActive]);

  // Real-time camera frame broadcaster to Customer view (BroadcastChannel + LocalStorage + API)
  useEffect(() => {
    if (!isOpen || !isLiveActive) {
      try {
        localStorage.removeItem('ades_live_latest_frame');
      } catch {}
      return;
    }

    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 640;
    let ctx = canvas.getContext('2d');

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('ades_live_stream_channel');
    } catch {}

    let lastApiPost = 0;

    const frameTimer = setInterval(() => {
      const vid = videoRef.current;
      if (!vid || vid.readyState < 2 || !ctx || !canvas) return;

      try {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.55);

        // 1. BroadcastChannel (0ms delay to open viewer tabs)
        if (channel) {
          channel.postMessage({
            type: 'LIVE_FRAME',
            frame: frameData,
            timestamp: Date.now(),
          });
        }

        // 2. LocalStorage for same-browser viewers
        try {
          localStorage.setItem('ades_live_latest_frame', frameData);
        } catch {}

        // 3. API server sync every 2 seconds for multi-device viewers
        const now = Date.now();
        if (now - lastApiPost > 2000) {
          lastApiPost = now;
          fetch('/api/live', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              active: true,
              title: 'Live Streaming Ades Store 01',
              host: 'Admin Ades Store 01',
              frame: frameData,
            }),
          }).catch(() => {});
        }
      } catch (e) {
        // ignore cross-origin draw exceptions if external video
      }
    }, 120);

    return () => {
      clearInterval(frameTimer);
      canvas = null;
      ctx = null;
      if (channel) {
        try {
          channel.postMessage({ type: 'LIVE_STOPPED' });
          channel.close();
        } catch {}
      }
    };
  }, [isOpen, isLiveActive, cameraActive, isSimulationMode]);

  // Host Sends Message in Live
  const handleSendHostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostReplyText.trim()) return;

    const newComment: LiveComment = {
      id: `host-${Date.now()}`,
      sender: 'Alya (Host Ades Store 01)',
      message: hostReplyText.trim(),
      isHost: true,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setComments((prev) => [...prev, newComment]);
    setHostReplyText('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentPinnedProduct = products.find((p) => p.id === pinnedProductId) || products[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[94vh] sm:h-[88vh] bg-slate-950 rounded-3xl overflow-hidden border-2 border-red-500 shadow-2xl flex flex-col justify-between text-white animate-in zoom-in-95 duration-200">
        
        {/* ================================================================ */}
        {/* HEADER: LIVE STUDIO CONTROLLER STATUS                            */}
        {/* ================================================================ */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-black via-zinc-900 to-red-950 border-b border-red-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  Ades Live Studio Admin
                </h3>
                {isLiveActive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>ON AIR: {formatTimer(liveDuration)}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-black text-[9px] uppercase tracking-wider flex items-center space-x-1">
                    <span>⚪ SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-300">
                {isLiveActive
                  ? 'Siaran Langsung Kamera Aktif & Terhubung ke Penonton'
                  : 'Status Offline: Kamera Siap / Siaran Toko Sedang Nonaktif'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Start / End Live Broadcast Button */}
            {!isLiveActive ? (
              <button
                onClick={() => onToggleLive(true)}
                className="px-3 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all flex items-center space-x-1.5 active:scale-95 animate-pulse"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Siaran Langsung</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleLive(false)}
                className="px-3 sm:px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 font-black text-xs border border-red-500/50 transition-all flex items-center space-x-1.5 active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Akhiri Siaran (Matikan Live)</span>
              </button>
            )}

            <button
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Tutup Live Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MAIN BODY: 2-COLUMN LAYOUT (CAMERA VIEW & STUDIO CONTROLS)       */}
        {/* ================================================================ */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* COLUMN 1 (7 COLS): LIVE CAMERA FEED WITH TIKTOK OVERLAY */}
          <div className="lg:col-span-7 relative bg-black flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
            {/* Live Camera Video Stream */}
            {cameraActive && !isSimulationMode ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover filter brightness-100 contrast-105"
              />
            ) : isSimulationMode ? (
              /* Simulation Video Stream (Orang Sedang Live) when physical camera is off/error */
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-tying-her-sneakers-shoes-42993-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter brightness-95"
              />
            ) : (
              <div className="text-center space-y-2 p-6">
                <CameraOff className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-xs font-bold text-zinc-400">Kamera Dinonaktifkan</p>
                <p className="text-[10px] text-zinc-600">Klik tombol kamera di bawah untuk menyalakan</p>
              </div>
            )}

            {/* Overlay Status: Sedang Tidak Melakukan Siaran Langsung */}
            {!isLiveActive && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20 space-y-3 pointer-events-none animate-in fade-in">
                <div className="w-14 h-14 rounded-3xl bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-2xl">
                  <Radio className="w-7 h-7 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-black text-[10px] uppercase tracking-wider">
                    ⚪ SEDANG TIDAK MELAKUKAN SIARAN LANGSUNG
                  </span>
                  <p className="text-sm font-black text-white">
                    Siaran Toko Saat Ini Sedang Nonaktif / Offline
                  </p>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                    Kamera dalam mode pratinjau (standby). Klik tombol merah <b>&ldquo;Mulai Siaran Langsung&rdquo;</b> di atas untuk mulai live ke penonton.
                  </p>
                </div>
              </div>
            )}

            {/* TikTok Live Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none p-3 sm:p-4 flex flex-col justify-between">
              {/* Top Viewfinder Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase">
                    {isLiveActive ? 'SIARAN LANGSUNG' : 'PREVIEW KAMERA'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-[10px] font-bold">
                    <Eye className="w-3.5 h-3.5 text-zinc-300" />
                    <span>{viewerCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-[10px] font-bold text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{likesCount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Pinned Product Tag on Camera */}
              {currentPinnedProduct && (
                <div className="bg-black/75 backdrop-blur-md p-2 rounded-xl border border-amber-400/60 max-w-xs flex items-center space-x-2 shadow-lg">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-300 bg-white flex-shrink-0">
                    <img
                      src={currentPinnedProduct.image_url}
                      alt={currentPinnedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-black uppercase text-amber-400 block leading-tight">
                      📌 Produk Di-Spill Sekarang
                    </span>
                    <p className="font-black text-xs text-white truncate">
                      {currentPinnedProduct.name}
                    </p>
                    <p className="text-[10px] font-black text-amber-300">
                      {formatIDR(currentPinnedProduct.promo_price || currentPinnedProduct.price)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Floating Control Bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <button
                onClick={handleToggleCamera}
                className={`p-2 rounded-full transition-all ${
                  cameraActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-600 text-white'
                }`}
                title={cameraActive ? 'Matikan Kamera' : 'Nyalakan Kamera'}
              >
                {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleMic}
                className={`p-2 rounded-full transition-all ${
                  micActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-600 text-white'
                }`}
                title={micActive ? 'Mute Mic' : 'Nyalakan Mic'}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={handleFlipCamera}
                className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-all"
                title="Ganti Kamera Depan/Belakang"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSimulationMode(!isSimulationMode)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                  isSimulationMode
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
                title="Alihkan antara Kamera Webcam Asli atau Video Simulasi Host"
              >
                {isSimulationMode ? 'Simulasi Host On' : 'Pakai Webcam'}
              </button>
            </div>
          </div>

          {/* COLUMN 2 (5 COLS): STUDIO TOOLS, PRODUCT PINNER & LIVE CHAT */}
          <div className="lg:col-span-5 bg-slate-900 flex flex-col justify-between overflow-hidden">
            
            {/* Top Stat Pills */}
            <div className="p-3 bg-slate-950/80 border-b border-zinc-800 grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-400 font-bold block uppercase">Penonton</span>
                <span className="text-sm font-black text-white">{viewerCount}</span>
              </div>
              <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-400 font-bold block uppercase">Total Likes</span>
                <span className="text-sm font-black text-rose-400">{likesCount}</span>
              </div>
              <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-400 font-bold block uppercase">CO di Live</span>
                <span className="text-sm font-black text-emerald-400">{ordersDuringLive} Pasang</span>
              </div>
            </div>

            {/* Pinned Product Selector Section */}
            <div className="p-3 border-b border-zinc-800 space-y-2 bg-slate-900/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 flex items-center space-x-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pilih Produk Untuk Di-Spill (Pin)</span>
                </span>
                <span className="text-[9px] text-zinc-400 font-bold">
                  {products.length} Produk Toko
                </span>
              </div>

              {/* Product Dropdown Selector */}
              <select
                value={pinnedProductId}
                onChange={(e) => setPinnedProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatIDR(p.promo_price || p.price)} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Chat Monitor (Admin View) */}
            <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80">
                <span className="text-[10px] font-black uppercase text-zinc-300">
                  💬 Komentar Penonton Real-Time
                </span>
                <span className="text-[9px] text-zinc-500">
                  {comments.length} pesan
                </span>
              </div>

              {/* Chat Scroll Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-2 pr-1">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-2 rounded-xl text-xs ${
                      c.isHost
                        ? 'bg-red-950/70 border border-red-500/60 ml-3'
                        : 'bg-zinc-800/80 border border-zinc-700/60 mr-3'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-black text-[10px] ${
                          c.isHost ? 'text-amber-300' : 'text-zinc-200'
                        }`}
                      >
                        {c.sender}
                      </span>
                      <span className="text-[8px] text-zinc-400">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-white mt-0.5 leading-snug">
                      {c.message}
                    </p>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>

              {/* Host Quick Reply Input */}
              <form onSubmit={handleSendHostMessage} className="pt-2 flex items-center space-x-1.5">
                <input
                  type="text"
                  value={hostReplyText}
                  onChange={(e) => setHostReplyText(e.target.value)}
                  placeholder="Ketik balasan Host untuk penonton live..."
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={!hostReplyText.trim()}
                  className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-40 flex items-center space-x-1 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
