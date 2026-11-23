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
  MapPin,
  AlertCircle,
  ShieldCheck,
  Send,
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
  onRequestReturn?: (
    orderId: string,
    reason: string,
    courier?: string,
    targetSize?: string | number,
    trackingNo?: string
  ) => void;
}

// Alamat Resmi Toko Ades Store 01 untuk Retur Barang
const STORE_RETURN_ADDRESS = {
  name: 'Ades Store 01 (Alya Alifia / CS Retur)',
  phone: '0821-2646-8980',
  address:
    'Jl. Raya Cikajang No. 45 (Samping Toko Sepatu Ades, Depan Pasar Cikajang), RT 02 / RW 04, Desa Cikajang, Kecamatan Cikajang, Kabupaten Garut, Jawa Barat 44171',
};

const RETURN_COURIERS = [
  'J&T Express',
  'JNE Reguler / YES',
  'GOTO (Kurir Cikajang & Garut Kilat)',
  'Ninja Xpress',
  'Antar Langsung ke Toko Cikajang (Bebas Ongkir)',
];

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
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Return Modal State
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Tukar Ukuran (Kekecilan/Kebesaran)');
  const [returnTargetSize, setReturnTargetSize] = useState<string>('Size 40');
  const [returnCourier, setReturnCourier] = useState<string>('J&T Express');
  const [returnTrackingNo, setReturnTrackingNo] = useState<string>('');
  const [returnNotes, setReturnNotes] = useState<string>('');
  const [agreeHandlingFee, setAgreeHandlingFee] = useState<boolean>(true);

  if (!isOpen) return null;

  // Filter orders by tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'perlu_dibayar':
        return orders.filter(
          (o) =>
            o.order_status === 'MENUNGGU_PEMBAYARAN' ||
            (o.payment_method === 'QRIS' && o.payment_status === 'PENDING')
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
    (o) =>
      o.order_status === 'MENUNGGU_PEMBAYARAN' ||
      (o.payment_method === 'QRIS' && o.payment_status === 'PENDING')
  ).length;
  const countUntukDikirim = orders.filter((o) => o.order_status === 'DIPROSES').length;
  const countAkanDiterima = orders.filter((o) => o.order_status === 'DIKIRIM').length;
  const countUntukDiulas = orders.filter(
    (o) => o.order_status === 'SELESAI' && !o.is_reviewed
  ).length;
  const countPengembalian = orders.filter((o) => o.order_status === 'RETUR').length;

  const handleReviewSubmit = (orderId: string) => {
    if (onSubmitReview) {
      onSubmitReview(orderId, ratingVal, reviewText);
    }
    setReviewingOrderId(null);
    setReviewText('');
  };

  // Open Return Form
  const handleOpenReturnModal = (order: Order) => {
    setSelectedReturnOrder(order);
    const item = order.items[0];
    if (item && item.size) {
      setReturnTargetSize(`Size ${Number(item.size) + 1 || 40}`);
    } else {
      setReturnTargetSize('Size 40');
    }
  };

  // Submit Return Form
  const handleSubmitReturnForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;

    if (onRequestReturn) {
      onRequestReturn(
        selectedReturnOrder.id,
        returnReason,
        returnCourier,
        returnTargetSize,
        returnTrackingNo
      );
    }

    // Prepare WhatsApp Message
    const waText = `Halo Admin Ades Store 01, saya ingin konfirmasi pengajuan retur barang:\n\n` +
      `• No. Pesanan: *${selectedReturnOrder.order_number}*\n` +
      `• Nama Pembeli: ${selectedReturnOrder.customer_name}\n` +
      `• Alasan Retur: ${returnReason}\n` +
      `• Ukuran Pengganti yang Diminta: ${returnTargetSize}\n` +
      `• Kurir Retur yang Dipilih: ${returnCourier}\n` +
      `• No. Resi Pengembalian: ${returnTrackingNo || 'Akan dikirim / Antar ke Toko'}\n` +
      `• Biaya Penanganan Retur: Rp 10.000 (Setuju)\n` +
      `• Alamat Kirim Retur: Jl. Raya Cikajang No. 45 Garut\n\n` +
      `Mohon bantuannya ya admin. Terima kasih!`;

    const waUrl = `https://wa.me/6282126468980?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

    setSelectedReturnOrder(null);
    setActiveTab('pengembalian');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'MENUNGGU_PEMBAYARAN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
            Perlu Dibayar
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">
            Sedang Dikemas
          </span>
        );
      case 'DIKIRIM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300">
            Dalam Pengiriman
          </span>
        );
      case 'SELESAI':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
            Selesai
          </span>
        );
      case 'RETUR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
            Pengajuan Retur
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-zinc-900 to-red-950 text-white flex items-center justify-between border-b border-red-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-red-400 flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Pesanan Saya &bull; Ades Store 01
              </h3>
              <p className="text-[10px] text-zinc-300 leading-tight">
                Lacak Status, Pembayaran DANA/QRIS, Garansi Retur 7 Hari &amp; Ulasan
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

        {/* 6 Tab Status Navigation */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-2 sm:px-4 flex space-x-1 overflow-x-auto no-scrollbar py-2 text-xs">
          {[
            { id: 'semua', label: 'Semua', count: orders.length },
            { id: 'perlu_dibayar', label: 'Perlu Dibayar', count: countPerluDibayar },
            { id: 'untuk_dikirim', label: 'Untuk Dikirim', count: countUntukDikirim },
            { id: 'akan_diterima', label: 'Akan Diterima', count: countAkanDiterima },
            { id: 'untuk_diulas', label: 'Untuk Diulas', count: countUntukDiulas },
            { id: 'pengembalian', label: 'Pengembalian / Retur', count: countPengembalian },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OrderTab)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders List Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-slate-50">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-black text-sm text-slate-700">Tidak Ada Pesanan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeTab === 'perlu_dibayar'
                  ? 'Tidak ada tagihan yang belum dibayar. Semua transaksi Anda lancar!'
                  : activeTab === 'untuk_dikirim'
                  ? 'Tidak ada paket yang sedang dikemas saat ini.'
                  : activeTab === 'akan_diterima'
                  ? 'Tidak ada paket yang sedang dalam perjalanan kurir.'
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
                            Resi {order.shipping_courier}: {order.tracking_number || `ADES-${order.id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-md">
                          Sedang Diantar
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-900">
                        Kurir sedang membawa paket menuju alamat: <i>{order.customer_address || order.shipping_address}</i>.
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
                          onClick={() => handleOpenReturnModal(order)}
                          className="px-3 py-2.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ajukan Retur / Tukar</span>
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
                            onClick={() => handleOpenReturnModal(order)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                          >
                            Tukar Size (Retur)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* TAB 6 ACTIONS: PENGEMBALIAN (RETUR LENGKAP)       */}
                  {/* -------------------------------------------------- */}
                  {order.order_status === 'RETUR' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-2 border-red-300 space-y-3">
                      <div className="flex items-center justify-between border-b border-red-200 pb-2">
                        <div className="flex items-center space-x-2 text-rose-950">
                          <RotateCcw className="w-4 h-4 text-red-600 flex-shrink-0 animate-spin" />
                          <div>
                            <p className="font-black text-xs">Status Retur: DALAM PROSES</p>
                            <p className="text-[10px] text-slate-600">
                              Alasan: <b>{order.return_reason || 'Tukar Ukuran Size 7 Hari'}</b>
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                          Biaya Penanganan: Rp 10.000
                        </span>
                      </div>

                      {/* Detail Info Retur */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-red-100 space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">
                            Kurir Retur Pengembalian:
                          </span>
                          <p className="font-black text-slate-900 flex items-center space-x-1">
                            <Truck className="w-3.5 h-3.5 text-red-600" />
                            <span>{order.return_courier || 'J&T Express'}</span>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Resi: {order.return_tracking_number || 'Akan dikirim / Antar langsung'}
                          </p>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-red-100 space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">
                            Ukuran Pengganti yang Diminta:
                          </span>
                          <p className="font-black text-red-600">
                            {order.return_target_size || 'Sesuai Request Pembeli'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Biaya Penanganan Retur: <b>Rp 10.000</b>
                          </p>
                        </div>
                      </div>

                      {/* Alamat Toko Tujuan Retur */}
                      <div className="bg-white p-2.5 rounded-xl border border-red-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-red-700 uppercase flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Alamat Toko Tujuan Kirim Retur:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${STORE_RETURN_ADDRESS.name}\n${STORE_RETURN_ADDRESS.phone}\n${STORE_RETURN_ADDRESS.address}`
                              );
                              setCopiedAddress(true);
                              setTimeout(() => setCopiedAddress(false), 2000);
                            }}
                            className="text-[10px] font-bold text-red-600 hover:underline flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedAddress ? 'Alamat Tersalin ✓' : 'Salin Alamat'}</span>
                          </button>
                        </div>
                        <p className="font-bold text-slate-800 text-[11px]">
                          {STORE_RETURN_ADDRESS.name} ({STORE_RETURN_ADDRESS.phone})
                        </p>
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          {STORE_RETURN_ADDRESS.address}
                        </p>
                      </div>

                      {/* WhatsApp CS Button */}
                      <a
                        href={`https://wa.me/6282126468980?text=${encodeURIComponent(
                          `Halo Admin Ades Store 01, saya ingin konfirmasi proses retur tukar size untuk pesanan *${order.order_number}*. Kurir: ${order.return_courier || 'J&T'}, Biaya Penanganan: Rp 10.000. Mohon segera diproses ya!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat WhatsApp Admin CS Retur (+62 821-2646-8980)</span>
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

      {/* ================================================================= */}
      {/* MODAL FORM PENGAJUAN RETUR BARANG DENGAN ALAMAT TOKO & KURIR     */}
      {/* ================================================================= */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-red-500 flex flex-col max-h-[92vh]">
            {/* Header Form Retur */}
            <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-black text-white flex items-center justify-between border-b border-red-900/60">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="font-black text-sm text-white">
                    Form Pengajuan Retur / Tukar Barang
                  </h4>
                  <p className="text-[10px] text-zinc-300">
                    Garansi Bebas Tukar Ukuran 7 Hari &bull; Ades Store 01
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReturnOrder(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitReturnForm} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              {/* Order Info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">No. Pesanan:</span>
                  <span className="font-mono font-black text-xs text-slate-900">
                    {selectedReturnOrder.order_number}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Produk:</span>
                  <span className="font-black text-red-600">
                    {selectedReturnOrder.items.length} Barang
                  </span>
                </div>
              </div>

              {/* 1. Alamat Tujuan Pengembalian Toko */}
              <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-red-900 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Alamat Toko Tujuan Pengembalian Barang:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${STORE_RETURN_ADDRESS.name}\n${STORE_RETURN_ADDRESS.phone}\n${STORE_RETURN_ADDRESS.address}`
                      );
                      setCopiedAddress(true);
                      setTimeout(() => setCopiedAddress(false), 2000);
                    }}
                    className="text-[10px] font-bold text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedAddress ? 'Tersalin ✓' : 'Salin Alamat'}</span>
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-red-200 text-slate-800 space-y-0.5">
                  <p className="font-black text-slate-900 text-[11px]">
                    {STORE_RETURN_ADDRESS.name}
                  </p>
                  <p className="font-bold text-slate-700 text-[10px]">
                    WhatsApp: {STORE_RETURN_ADDRESS.phone}
                  </p>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    {STORE_RETURN_ADDRESS.address}
                  </p>
                </div>
              </div>

              {/* 2. Pemilihan Kurir Retur */}
              <div className="space-y-1">
                <label className="font-black text-slate-800 block text-[11px]">
                  Pilih Kurir Pengembalian (Kurir Retur):
                </label>
                <select
                  value={returnCourier}
                  onChange={(e) => setReturnCourier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                >
                  {RETURN_COURIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500">
                  Pilih ekspedisi yang akan Anda gunakan untuk mengirim paket kembali ke toko Cikajang.
                </p>
              </div>

              {/* Nomor Resi Pengembalian (Opsional) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">
                  Nomor Resi Kirim Retur (Opsional jika sudah dikirim):
                </label>
                <input
                  type="text"
                  value={returnTrackingNo}
                  onChange={(e) => setReturnTrackingNo(e.target.value)}
                  placeholder="Contoh: JT123456789ID (Kosongkan jika belum dikirim / antar toko)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* 3. Alasan Retur & Ukuran Pengganti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-black text-slate-800 block text-[11px]">
                    Alasan Pengembalian:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="Tukar Ukuran (Kekecilan)">Tukar Ukuran (Kekecilan)</option>
                    <option value="Tukar Ukuran (Kebesaran)">Tukar Ukuran (Kebesaran)</option>
                    <option value="Cacat / Rusak Pabrik">Cacat / Rusak Pabrik</option>
                    <option value="Salah Warna / Model">Salah Warna / Model</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-black text-slate-800 block text-[11px]">
                    Ukuran Pengganti yang Diminta:
                  </label>
                  <input
                    type="text"
                    required
                    value={returnTargetSize}
                    onChange={(e) => setReturnTargetSize(e.target.value)}
                    placeholder="Contoh: Size 40 / Warna Putih"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* 4. Rincian Biaya Penanganan Retur Rp 10.000 */}
              <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-950 font-black">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Biaya Penanganan Retur:</span>
                  </div>
                  <span className="font-black text-sm text-red-600">
                    Rp 10.000
                  </span>
                </div>

                <p className="text-[10px] text-amber-900 leading-relaxed">
                  Biaya penanganan sebesar <b>Rp 10.000</b> mencakup administrasi pergantian ukuran, quality check (QC) barang pengembalian, dan pengemasan ulang paket baru. Pembayaran dapat ditransfer via <b>DANA (0821-2646-8980)</b> atau diserahkan saat tukar barang.
                </p>

                <div className="flex items-center space-x-2 pt-1 border-t border-amber-200/80">
                  <input
                    type="checkbox"
                    id="agreeHandling"
                    checked={agreeHandlingFee}
                    onChange={(e) => setAgreeHandlingFee(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="agreeHandling" className="font-bold text-[11px] text-slate-900 cursor-pointer">
                    Saya menyetujui biaya penanganan retur Rp 10.000
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReturnOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!agreeHandlingFee}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pengajuan Retur &amp; WhatsApp CS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
