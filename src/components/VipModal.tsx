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
                  Cashback instan <b>🪙 50.000 Poin Koin Member</b> telah masuk ke akun Anda dan bisa langsung digunakan saat checkout!
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left space-y-1 text-xs">
                <p className="font-extrabold text-amber-950">Benefit VIP Aktif:</p>
                <p className="text-slate-700">✓ Saldo Koin Member: <b>50.000 Poin (Rp 50.000)</b></p>
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
            /* QRIS Payment Step */
            <div className="text-center space-y-4 py-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Tagihan Pendaftaran VIP
                </span>
                <p className="text-3xl font-black text-slate-900">
                  Rp 50.000
                </p>
              </div>

              <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mx-auto flex items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>

              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Scan QRIS di atas via GoPay, OVO, ShopeePay, Dana, atau BCA Mobile.
              </p>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleJoinVip}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Mengaktifkan VIP...' : 'Simulasikan Pembayaran QRIS Sukses'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrisPayment(false)}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
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
                    Bonus 50k Koin!
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
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Bonus Sambutan Langsung 50.000 Koin Member
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      1 Poin = Rp 1. Saldo 50.000 koin langsung masuk ke akun Anda saat aktivasi VIP selesai!
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
