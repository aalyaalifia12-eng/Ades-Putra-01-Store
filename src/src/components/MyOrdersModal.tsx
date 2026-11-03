'use client';

import React, { useState } from 'react';
import {
  X,
  Package,
  CreditCard,
  Truck,
  CheckCircle2,
  Star,
  RotateCcw,
  Clock,
  ExternalLink,
  MessageCircle,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatIDR } from '@/lib/utils';

export type OrderTab =
  | 'semua'
  | 'perlu_dibayar'
  | 'untuk_dikirim'
  | 'akan_diterima'
  | 'untuk_diulas'
  | 'pengembalian';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTab?: OrderTab;
  onConfirmReceived?: (orderId: string) => void;
  onSubmitReview?: (orderId: string, rating: number, review: string) => void;
  onRequestReturn?: (orderId: string, reason: string) => void;
}

export default function MyOrdersModal({
  isOpen,
  onClose,
  orders,
  initialTab = 'semua',
  onConfirmReceived,
  onSubmitReview,
  onRequestReturn,
}: MyOrdersModalProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>(initialTab);
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [copiedDana, setCopiedDana] = useState(false);

  if (!isOpen) return null;

  // Filter orders by tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'perlu_dibayar':
        return orders.filter(
          (o) => o.order_status === 'MENUNGGU_PEMBAYARAN' || (o.payment_method === 'QRIS' && o.payment_status === 'PENDING')
        );
      case 'untuk_dikirim':
        return orders.filter((o) => o.order_status === 'DIPROSES');
      case 'akan_diterima':
        return orders.filter((o) => o.order_status === 'DIKIRIM');
      case 'untuk_diulas':
        return orders.filter((o) => o.order_status === 'SELESAI');
      case 'pengembalian':
        return orders.filter((o) => o.order_status === 'RETUR');
      case 'semua':
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // Tab counts
  const countPerluDibayar = orders.filter(
    (o) => o.order_status === 'MENUNGGU_PEMBAYARAN' || (o.payment_method === 'QRIS' && o.payment_status === 'PENDING')
  ).length;
  const countUntukDikirim = orders.filter((o) => o.order_status === 'DIPROSES').length;
  const countAkanDiterima = orders.filter((o) => o.order_status === 'DIKIRIM').length;
  const countUntukDiulas = orders.filter((o) => o.order_status === 'SELESAI' && !o.is_reviewed).length;
  const countPengembalian = orders.filter((o) => o.order_status === 'RETUR').length;

  const handleReviewSubmit = (orderId: string) => {
    if (onSubmitReview) {
      onSubmitReview(orderId, ratingVal, reviewText);
    }
    setReviewingOrderId(null);
    setReviewText('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'MENUNGGU_PEMBAYARAN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Perlu Dibayar</span>
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-800 border border-sky-300 flex items-center space-x-1">
            <Package className="w-3 h-3" />
            <span>Sedang Dikemas</span>
          </span>
        );
      case 'DIKIRIM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span>Dalam Pengiriman</span>
          </span>
        );
      case 'SELESAI':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Pesanan Selesai</span>
          </span>
        );
      case 'RETUR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300 flex items-center space-x-1">
            <RotateCcw className="w-3 h-3" />
            <span>Pengembalian (Retur Size)</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-zinc-900 to-black text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center space-x-2">
                <span>Pesanan Saya</span>
                <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.2 rounded-full border border-red-800">
                  {orders.length} Total
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Ades Store 01 &bull; Status &amp; Riwayat Belanja Lengkap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Tabs Shopee/Tokopedia Style (Semua, Perlu Dibayar, Untuk Dikirim, Akan Diterima, Untuk Diulas, Pengembalian) */}
        <div className="flex items-center space-x-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs font-black">
          {/* 1. Semua */}
          <button
            type="button"
            onClick={() => setActiveTab('semua')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'semua'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Semua</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'semua' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {orders.length}
            </span>
          </button>

          {/* 2. Perlu Dibayar */}
          <button
            type="button"
            onClick={() => setActiveTab('perlu_dibayar')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'perlu_dibayar'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Perlu Dibayar</span>
            {countPerluDibayar > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'perlu_dibayar' ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                {countPerluDibayar}
              </span>
            )}
          </button>

          {/* 3. Untuk Dikirim */}
          <button
            type="button"
            onClick={() => setActiveTab('untuk_dikirim')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'untuk_dikirim'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Untuk Dikirim</span>
            {countUntukDikirim > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'untuk_dikirim' ? 'bg-white text-red-600' : 'bg-sky-600 text-white'}`}>
                {countUntukDikirim}
              </span>
            )}
          </button>

          {/* 4. Akan Diterima */}
          <button
            type="button"
            onClick={() => setActiveTab('akan_diterima')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'akan_diterima'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Akan Diterima</span>
            {countAkanDiterima > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'akan_diterima' ? 'bg-white text-red-600' : 'bg-purple-600 text-white'}`}>
                {countAkanDiterima}
              </span>
            )}
          </button>

          {/* 5. Untuk Diulas */}
          <button
            type="button"
            onClick={() => setActiveTab('untuk_diulas')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'untuk_diulas'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Untuk Diulas</span>
            {countUntukDiulas > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'untuk_diulas' ? 'bg-white text-red-600' : 'bg-emerald-600 text-white'}`}>
                {countUntukDiulas}
              </span>
            )}
          </button>

          {/* 6. Pengembalian */}
          <button
            type="button"
            onClick={() => setActiveTab('pengembalian')}
            className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'pengembalian'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Pengembalian</span>
            {countPengembalian > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'pengembalian' ? 'bg-white text-red-600' : 'bg-rose-600 text-white'}`}>
                {countPengembalian}
              </span>
            )}
          </button>
        </div>

        {/* Content Body: List of Orders */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-black text-slate-800">
                Belum Ada Pesanan di Tab Ini
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'perlu_dibayar'
                  ? 'Tidak ada tagihan yang belum dibayar. Semua pesanan Anda aman!'
                  : activeTab === 'untuk_dikirim'
                  ? 'Tidak ada pesanan yang sedang dikemas saat ini.'
                  : activeTab === 'akan_diterima'
                  ? 'Tidak ada pesanan yang sedang dalam perjalanan kurir.'
                  : activeTab === 'untuk_diulas'
                  ? 'Semua pesanan selesai telah diulas. Terima kasih atas bintang 5-nya!'
                  : activeTab === 'pengembalian'
                  ? 'Tidak ada riwayat retur ukuran atau pengembalian barang.'
                  : 'Ayo mulai belanja koleksi Sepatu, Sandal & Tas favorit Anda!'}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-red-600 transition-colors shadow-xs"
              >
                Mulai Belanja di Toko
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isUnpaid =
                order.order_status === 'MENUNGGU_PEMBAYARAN' ||
                (order.payment_method === 'QRIS' && order.payment_status === 'PENDING');

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-3 p-4 transition-all hover:border-slate-300"
                >
                  {/* Top Bar of Order Card: Order Number, Date, Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        No. Pesanan:
                      </span>
                      <span className="font-mono font-black text-xs text-slate-900">
                        {order.order_number}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {getStatusBadge(order.order_status)}
                    </div>
                  </div>

                  {/* Item List in Order */}
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-xs text-slate-900 truncate">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.size ? `Size: ${item.size}` : ''} {item.color ? `• Warna: ${item.color}` : ''}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-slate-500">
                              {item.quantity} x {formatIDR(item.price)}
                            </span>
                            <span className="font-black text-slate-900">
                              {formatIDR(item.subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary & Courier Info */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Kurir Ekspedisi:</span>
                      <span className="font-bold text-slate-900 flex items-center space-x-1">
                        <Truck className="w-3.5 h-3.5 text-red-600" />
                        <span>{order.shipping_courier}</span>
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Metode Pembayaran:</span>
                      <span className="font-bold text-slate-900">
                        {order.payment_method === 'COD' ? 'COD (Bayar di Tempat)' : 'DANA / QRIS Instan'}
                      </span>
                    </div>

                    {order.vip_discount > 0 && (
                      <div className="flex justify-between text-amber-800 text-[11px]">
                        <span>Diskon VIP 10%:</span>
                        <span className="font-bold">-{formatIDR(order.vip_discount)}</span>
                      </div>
                    )}

                    {order.points_used > 0 && (
                      <div className="flex justify-between text-amber-800 text-[11px]">
                        <span>Potongan Poin Koin:</span>
                        <span className="font-bold">-{formatIDR(order.points_used)}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                      <span>Total Pembayaran:</span>
                      <span className="text-red-600">{formatIDR(order.total_amount)}</span>
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* TAB 2 ACTIONS: PERLU DIBAYAR                      */}
                  {/* -------------------------------------------------- */}
                  {isUnpaid && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-sky-950 uppercase flex items-center space-x-1">
                          <span>💳 Bayar Tagihan via DANA / QRIS</span>
                        </span>
                        <span className="text-[10px] font-black text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-md">
                          0821-2646-8980
                        </span>
                      </div>

                      <p className="text-[11px] text-sky-900">
                        Silakan transfer sebesar <b>{formatIDR(order.total_amount)}</b> ke akun DANA resmi Ades Store 01:
                      </p>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-sky-300">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">No. DANA Toko</span>
                          <span className="text-sm font-black font-mono text-slate-900">0821-2646-8980</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('082126468980');
                            setCopiedDana(true);
                            setTimeout(() => setCopiedDana(false), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedDana ? 'Tersalin ✓' : 'Salin'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href="https://link.dana.id/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs text-center flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka DANA</span>
                        </a>

                        <a
                          href={`https://wa.me/6282126468980?text=${encodeURIComponent(
                            `Halo Admin Ades Store 01, saya ingin konfirmasi pembayaran pesanan *${order.order_number}* sebesar ${formatIDR(
                              order.total_amount
                            )} via DANA ke 082126468980. Mohon segera diproses ya!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs text-center flex items-center justify-center space-x-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim Bukti WA</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* TAB 3 ACTIONS: UNTUK DIKIRIM (SEDANG DIKEMAS)       */}
                  {/* -------------------------------------------------- */}
                  {order.order_status === 'DIPROSES' && (
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-sky-600 flex-shrink-0" />
                        <div>
                          <p className="font-extrabold text-sky-950">Sedang Dikemas Rapi</p>
                          <p className="text-[11px] text-sky-800">Paket sedang dicek QC &amp; dibungkus bubble wrap.</p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/6282126468980?text=${encodeURIComponent(
                          `Halo Admin, mau tanya status packing pesanan saya *${order.order_number}*. Terima kasih!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-800 font-bold hover:bg-sky-100"
                      >
                        Tanya Admin
                      </a>
                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* TAB 4 ACTIONS: AKAN DITERIMA (DALAM PENGIRIMAN)     */}
                  {/* -------------------------------------------------- */}
                  {order.order_status === 'DIKIRIM' && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-purple-700" />
                          <span className="font-extrabold text-purple-950">
                            Resi {order.shipping_courier}: ADES-{order.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-md">
                          Sedang Diantar
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-900">
                        Kurir sedang membawa paket menuju alamat: <i>{order.customer_address}</i>.
                      </p>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onConfirmReceived && onConfirmReceived(order.id)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center space-x-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pesanan Diterima</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRequestReturn && onRequestReturn(order.id, 'Tukar Ukuran Size')}
                          className="px-3 py-2.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ajukan Retur Size</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* TAB 5 ACTIONS: UNTUK DIULAS (PESANAN SELESAI)       */}
                  {/* -------------------------------------------------- */}
                  {order.order_status === 'SELESAI' && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      {order.is_reviewed ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5 text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>
                              Ulasan Diberikan: <b>{order.user_rating || 5} Bintang ⭐</b>
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                            +1.000 Koin Didapat!
                          </span>
                        </div>
                      ) : reviewingOrderId === order.id ? (
                        /* Review Form */
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5 animate-slide-down">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-amber-950">
                              Beri Rating Sepatu/Sandal/Tas:
                            </span>
                            <div className="flex space-x-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRatingVal(s)}
                                  className="p-1 hover:scale-125 transition-transform"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      s <= ratingVal
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Tulis ulasanmu: Apakah solnya empuk? Ukuran pas? Jahitan rapi?"
                            className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleReviewSubmit(order.id)}
                              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs"
                            >
                              Kirim Ulasan &amp; Klaim Koin
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewingOrderId(null)}
                              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-600 hover:bg-slate-100"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setReviewingOrderId(order.id)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                          >
                            <Star className="w-4 h-4 fill-amber-300 text-slate-950" />
                            <span>Beri Ulasan (+1.000 Koin)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onRequestReturn && onRequestReturn(order.id, 'Tukar Ukuran 7 Hari')}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                          >
                            Tukar Size (Retur)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* TAB 6 ACTIONS: PENGEMBALIAN (RETUR)               */}
                  {/* -------------------------------------------------- */}
                  {order.order_status === 'RETUR' && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                      <div className="flex items-center space-x-2 text-rose-900">
                        <RotateCcw className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <div>
                          <p className="font-black text-xs">Garansi Bebas Tukar Ukuran 7 Hari</p>
                          <p className="text-[11px] text-rose-800">
                            Pengajuan retur size Anda sedang diproses oleh CS Ades Store 01.
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/6282126468980?text=${encodeURIComponent(
                          `Halo Admin, saya ingin konfirmasi proses retur tukar size untuk pesanan *${order.order_number}*. Mohon panduannya!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Hubungi CS Retur WhatsApp (+62 821-2646-8980)</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Layanan Pelanggan WhatsApp: <b>+62 821-2646-8980</b>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
