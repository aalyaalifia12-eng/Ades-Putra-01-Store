'use client';

import React, { useState } from 'react';
import {
  Crown,
  X,
  CheckCircle2,
  Coins,
  RotateCcw,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '@/types';
import { formatIDR } from '@/lib/utils';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onVipUpgraded: (updatedUser: User) => void;
}

export default function VipModal({
  isOpen,
  onClose,
  currentUser,
  onVipUpgraded,
}: VipModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successUpgraded, setSuccessUpgraded] = useState(false);
  const [showQrisPayment, setShowQrisPayment] = useState(false);
  const [copiedDana, setCopiedDana] = useState(false);

  if (!isOpen) return null;

  const handleJoinVip = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/vip/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        setSuccessUpgraded(true);
        onVipUpgraded(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 text-white p-4 pb-6 overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-amber-300 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="font-black text-sm text-amber-200 leading-tight">
                  VIP Membership Ades Store 01
                </h3>
                <p className="text-[10px] text-amber-300/80 leading-tight">
                  Langkah Nyaman, Gaya Maksimal Setiap Hari
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 -mt-4 bg-white rounded-t-3xl flex-1 space-y-5">
          {successUpgraded ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Crown className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Selamat! Anda Resmi Jadi VIP Member
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Benefit <b>🚚 Bonus Gratis Ongkir</b> dan <b>⚡ Cashback 10%</b> telah aktif di akun Anda dan bisa langsung dinikmati saat checkout!
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left space-y-1 text-xs">
                <p className="font-extrabold text-amber-950">Benefit VIP Aktif:</p>
                <p className="text-slate-700">✓ <b>Bonus Gratis Ongkir</b> ke seluruh Indonesia</p>
                <p className="text-slate-700">✓ <b>Cashback 10% Koin</b> di setiap order</p>
                <p className="text-slate-700">✓ Diskon Eksklusif VIP 10% di setiap transaksi</p>
                <p className="text-slate-700">✓ Garansi Bebas Tukar Ukuran Sepatu/Sandal 7 Hari</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Mulai Belanja & Pakai Poin
              </button>
            </div>
          ) : showQrisPayment ? (
            /* QRIS & DANA Payment Step */
            <div className="text-center space-y-3.5 py-1">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Tagihan Pendaftaran VIP Ades Store 01
                </span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  Rp 50.000
                </p>
              </div>

              {/* QR Barcode DANA 0821-2646-8980 */}
              <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-md border-2 border-sky-300 mx-auto flex flex-col items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://link.dana.id/m/082126468980"
                  alt="QR Barcode DANA +62 821-2646-8980"
                  className="w-36 h-36 object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-1.5 py-0.5 rounded bg-white shadow-md border border-sky-400">
                    <span className="text-[9px] font-black text-sky-600 uppercase">DANA</span>
                  </div>
                </div>
              </div>

              {/* Nomor DANA Penerima */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                    Nomor DANA Penerima:
                  </span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    0821-2646-8980
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    A/N Ades Store 01
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('082126468980');
                    setCopiedDana(true);
                    setTimeout(() => setCopiedDana(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedDana ? 'Tersalin ✓' : 'Salin No'}</span>
                </button>
              </div>

              {/* Tombol Langsung Buka DANA */}
              <a
                href="https://link.dana.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Aplikasi DANA Langsung</span>
              </a>

              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleJoinVip}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Mengaktifkan VIP...' : 'Konfirmasi Pembayaran DANA / Aktivasi VIP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrisPayment(false)}
                  className="w-full py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  &larr; Kembali ke Rincian Benefit
                </button>
              </div>
            </div>
          ) : (
            /* Benefit List Screen */
            <>
              {/* Cost Banner */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Biaya Bergabung VIP
                  </span>
                  <p className="text-2xl font-black text-amber-950">
                    Rp 50.000 <span className="text-xs font-normal text-amber-800">/ Sekali Bayar</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-2xs">
                    Cashback 10%
                  </span>
                  <p className="text-[11px] text-amber-800 font-bold mt-1">
                    Bonus Gratis Ongkir!
                  </p>
                </div>
              </div>

              {/* 3 Key Benefits */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    🪙
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Cashback 10% Koin Member di Setiap Belanja
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dapatkan pengembalian 10% dalam bentuk koin belanja di setiap order yang langsung bisa dipakai untuk potongan harga order berikutnya!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    🚚
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Bonus Gratis Ongkir ke Seluruh Indonesia
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bebas biaya ongkos kirim tanpa syarat minimal belanja untuk semua pilihan kurir (JNE, J&amp;T, GOTO 3 Jam, Ninja Xpress)!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Diskon Tambahan 10% Khusus Member VIP
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Otomatis mendapatkan potongan harga ekstra 10% untuk semua koleksi sepatu, sandal, dan tas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Garansi Bebas Retur Ukuran (Size Exchange)
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kekecilan atau kebesaran? Khusus member VIP, biaya retur tukar size ditanggung toko dalam 7 hari.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setShowQrisPayment(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all"
              >
                <Crown className="w-4 h-4 text-amber-200" />
                <span>Bayar Rp 50.000 & Klaim 50.000 Poin &rarr;</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
