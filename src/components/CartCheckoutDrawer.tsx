'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  MapPin,
  Coins,
  CheckCircle2,
  Share2,
  Crown,
  ExternalLink,
  MessageCircle,
  Copy,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, User, CourierOption, Order } from '@/types';
import { COURIERS } from '@/lib/couriers';
import { formatIDR } from '@/lib/utils';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, size: number | string, delta: number) => void;
  onRemoveItem: (productId: string, size: number | string) => void;
  onClearCart: () => void;
  currentUser: User | null;
  onOrderSuccess: (order: Order, remainingPoints: number) => void;
  onOpenVipModal: () => void;
  onOpenMyOrders?: (tab?: 'semua' | 'perlu_dibayar' | 'untuk_dikirim') => void;
}

export default function CartCheckoutDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOrderSuccess,
  onOpenVipModal,
  onOpenMyOrders,
}: CartCheckoutDrawerProps) {
  // Checkout Form States
  const [recipientName, setRecipientName] = useState(currentUser?.name || 'Alya Alifia');
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '081298765432');
  const [recipientAddress, setRecipientAddress] = useState(currentUser?.address || '');
  const [selectedCourier, setSelectedCourier] = useState<CourierOption>('J&T Express');
  const [useMemberPoints, setUseMemberPoints] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QRIS'>('QRIS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedDana, setCopiedDana] = useState(false);

  // Autofill from user profile when opened
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setRecipientName(currentUser.name);
      if (currentUser.phone) setRecipientPhone(currentUser.phone);
      if (currentUser.address) setRecipientAddress(currentUser.address);
    }
  }, [currentUser, isOpen]);

  // Success completed order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Courier tariff
  const courierObj = COURIERS.find((c) => c.code === selectedCourier) || COURIERS[0];
  const shippingCost = courierObj.cost;

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.promo_price || item.product.original_price;
    return sum + price * item.qty;
  }, 0);

  // VIP discount (10% on products if VIP member)
  const isVip = currentUser?.isVip || false;
  const vipDiscount = isVip ? Math.round(subtotal * 0.1) : 0;

  // Member points discount
  const userPoints = currentUser?.memberPoints || 0;
  const maxPointsDeductible = Math.max(0, subtotal - vipDiscount);
  const pointsUsed = useMemberPoints ? Math.min(userPoints, maxPointsDeductible) : 0;

  // Final Total
  const grandTotal = Math.max(0, subtotal - vipDiscount - pointsUsed + shippingCost);

  // WhatsApp Admin & DANA payment details
  const ADMIN_WHATSAPP_NUMBER = '6282126468980'; // Ades Store 01 (+62 821-2646-8980)
  const ADMIN_DANA_NUMBER = '0821-2646-8980'; // Akun DANA Resmi Ades Store 01

  // Generate WhatsApp Order Message
  const generateWhatsAppMessage = () => {
    let itemsText = '';
    cart.forEach((item, idx) => {
      const price = item.product.promo_price || item.product.original_price;
      itemsText += `${idx + 1}. *${item.product.name}*\n   - Size: *${item.selectedSize}* | Warna: ${item.selectedColor}\n   - Qty: ${item.qty} pcs x ${formatIDR(price)} = ${formatIDR(price * item.qty)}\n`;
    });

    const msg =
      `*HALO ADES PUTRA 01 STORE, SAYA INGIN ORDER FASHION:*\n` +
      `_Visi: Belanja Pasti Tanpa Ragu: Harga Promo, Kualitas Terbaik_\n\n` +
      `*Data Penerima:*\n` +
      `• Nama: ${recipientName}\n` +
      `• No. HP: ${recipientPhone}\n` +
      `• Alamat: ${recipientAddress}\n\n` +
      `*Rincian Barang & Ukuran:*\n` +
      `${itemsText}\n` +
      `*Rincian Pembayaran:*\n` +
      `• Subtotal Belanja : ${formatIDR(subtotal)}\n` +
      `${vipDiscount > 0 ? `• Diskon VIP 10% : -${formatIDR(vipDiscount)}\n` : ''}` +
      `${pointsUsed > 0 ? `• Potong Poin Member : -${formatIDR(pointsUsed)} (🪙 ${pointsUsed} Poin)\n` : ''}` +
      `• Ekspedisi (${selectedCourier}) : ${formatIDR(shippingCost)}\n` +
      `*• TOTAL PEMBAYARAN : ${formatIDR(grandTotal)}*\n` +
      `• Metode Pembayaran: *${paymentMethod === 'COD' ? 'COD (Bayar di Tempat)' : 'QRIS Instan'}*\n\n` +
      `Mohon segera diproses dan dikirimkan resinya ya admin. Terima kasih! ✨`;

    return encodeURIComponent(msg);
  };

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const url = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  // Submit order via API
  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      setErrorMessage('Keranjang belanja kosong.');
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim() || !recipientAddress.trim()) {
      setErrorMessage('Harap lengkapi nama penerima, nomor HP, dan alamat pengiriman.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser?.id,
          customerName: recipientName,
          customerPhone: recipientPhone,
          customerAddress: recipientAddress,
          items: cart.map((item) => ({
            product_id: item.product.id,
            size: item.selectedSize,
            color: item.selectedColor,
            quantity: item.qty,
          })),
          shippingCourier: selectedCourier,
          shippingCost,
          usePoints: useMemberPoints,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal memproses pesanan.');
        setIsSubmitting(false);
        return;
      }

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setCompletedOrder(data.order);
      onOrderSuccess(data.order, data.remainingPoints);
      onClearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center sm:justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
            </div>
            <div>
              <h2 className="font-black text-xs text-slate-900">
                Checkout &mdash; Ades Store 01
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">
                Langkah Nyaman, Gaya Maksimal Setiap Hari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Cart & Checkout Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* If Order Completed, Show Order Confirmation */}
          {completedOrder ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Pesanan Berhasil Dibuat!
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Nomor Pesanan: <b>{completedOrder.order_number}</b>
                </p>
              </div>

              {/* Total Summary Banner */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Penerima:</span>
                  <span className="font-bold text-slate-800">{completedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ekspedisi:</span>
                  <span className="font-bold text-slate-800">{completedOrder.shipping_courier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="font-bold text-slate-800">
                    {completedOrder.payment_method === 'COD' ? 'COD (Bayar di Tempat)' : 'QRIS Instan'}
                  </span>
                </div>
                <div className="border-t border-emerald-200 pt-2 flex justify-between font-black text-sm text-emerald-800">
                  <span>Total Tagihan:</span>
                  <span>{formatIDR(completedOrder.total_amount)}</span>
                </div>
              </div>

              {/* QRIS & DANA Payment Box */}
              {completedOrder.payment_method === 'QRIS' && (
                <div className="bg-gradient-to-b from-sky-50 via-white to-slate-50 p-4 rounded-2xl border border-sky-200 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-600 text-white text-[10px] font-black uppercase shadow-xs">
                      <span>DANA / QRIS RESMI</span>
                    </div>
                    <span className="text-[10px] text-sky-800 font-bold bg-sky-100 px-2 py-0.5 rounded-md">
                      Real-Time Verifikasi
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">
                      Scan QR Barcode DANA / QRIS
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Scan QR di bawah via DANA, BCA Mobile, GoPay, OVO, ShopeePay, atau Bank mana saja
                    </p>
                  </div>

                  {/* QR Barcode DANA 0821-2646-8980 */}
                  <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-md border-2 border-sky-300 mx-auto flex flex-col items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://link.dana.id/m/082126468980`}
                      alt="QR Barcode DANA 0821-2646-8980"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-1.5 py-0.5 rounded bg-white shadow-md border border-sky-400">
                        <span className="text-[9px] font-black text-sky-600 uppercase">DANA</span>
                      </div>
                    </div>
                  </div>

                  {/* Nomor DANA dengan tombol salin */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-left">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                        Nomor Akun DANA:
                      </span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {ADMIN_DANA_NUMBER}
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

                  {/* Tombol Buka Aplikasi DANA */}
                  <a
                    href="https://link.dana.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Aplikasi DANA Langsung</span>
                  </a>
                </div>
              )}

              {/* WhatsApp notification action */}
              <button
                onClick={handleSendWhatsAppOrder}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Bukti / Konfirmasi ke WhatsApp Admin</span>
              </button>

              {/* View Order History & Tracking */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenMyOrders && completedOrder) {
                    onOpenMyOrders(completedOrder.payment_method === 'QRIS' ? 'perlu_dibayar' : 'untuk_dikirim');
                  }
                  setCompletedOrder(null);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>Lihat Pesanan Saya &amp; Lacak Status</span>
              </button>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Selesai & Belanja Lagi
              </button>
            </div>
          ) : (
            <>
              {/* 1. Items in Cart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Daftar Barang ({cart.reduce((s, i) => s + i.qty, 0)} item)
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Kosongkan</span>
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-500">
                      Keranjang belanja masih kosong.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => {
                      const price = item.product.promo_price || item.product.original_price;
                      return (
                        <div
                          key={`${item.product.id}-${item.selectedSize}`}
                          className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs"
                        >
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          />

                          <div className="flex-1 px-3">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-extrabold text-slate-800">
                                {item.product.category === 'tas' ? 'One Size' : `Size: ${item.selectedSize}`}
                              </span>
                              <span>• {item.selectedColor}</span>
                            </div>
                            <p className="text-xs font-black text-rose-600 mt-1">
                              {formatIDR(price)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedSize, -1)}
                              className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedSize, 1)}
                              className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                              className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-1"
                              title="Hapus"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Customer Delivery Info & Live Google Maps Preview */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Alamat Pengiriman & Live Maps Preview</span>
                </span>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Penerima"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Alamat Lengkap (Jalan, No. Rumah, RT/RW, Kecamatan, Kota, Kode Pos)"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />

                  {/* Interactive Live Google Maps Preview Frame */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-28 shadow-2xs group">
                    {/* Simulated live vector map */}
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70 bg-slate-100 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold bg-white/90 px-2 py-0.5 rounded-full shadow-xs text-slate-800">
                          Lokasi Pengantaran Terdeteksi
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-700 shadow-2xs">
                      📍 Google Maps Pin Preview
                    </div>
                  </div>

                  {/* Tombol Cek Lokasi Pengiriman via Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recipientAddress || 'Indonesia')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-[11px] font-black flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cek Lokasi Pengiriman via Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* 3. Expedition Courier Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Pilihan Ekspedisi Kurir:</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {COURIERS.map((c) => {
                    const isSelected = selectedCourier === c.code;
                    return (
                      <div
                        key={c.code}
                        onClick={() => setSelectedCourier(c.code)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">
                            {c.code}
                          </span>
                          {c.badge && (
                            <span className="text-[9px] font-black bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{c.etd}</p>
                        <p className="text-xs font-black text-rose-600 mt-1">
                          {formatIDR(c.cost)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Potong Koin Member Toggle */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs">
                      🪙
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        Potong Koin Member
                      </p>
                      <p className="text-[10px] text-slate-600">
                        Saldo Anda: <b>🪙 {userPoints.toLocaleString('id-ID')} Poin</b> (1 Poin = Rp 1)
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    id="togglePoints"
                    checked={useMemberPoints && userPoints > 0}
                    disabled={userPoints <= 0}
                    onChange={(e) => setUseMemberPoints(e.target.checked)}
                    className="w-5 h-5 rounded-md accent-amber-600 cursor-pointer"
                  />
                </div>

                {userPoints > 0 && useMemberPoints && (
                  <div className="text-[11px] text-amber-900 font-bold bg-amber-200/60 p-2 rounded-xl flex items-center justify-between">
                    <span>Diskon Koin Diterapkan:</span>
                    <span className="text-rose-700 font-black">-{formatIDR(pointsUsed)}</span>
                  </div>
                )}

                {userPoints <= 0 && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-amber-800 font-medium">
                      Belum punya koin? Gabung VIP sekarang dan dapat 50.000 Poin!
                    </span>
                    <button
                      type="button"
                      onClick={onOpenVipModal}
                      className="text-[10px] font-black underline text-amber-900"
                    >
                      Daftar VIP
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Metode Pembayaran:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>COD (Bayar di Tempat)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QRIS Instan</span>
                  </button>
                </div>
              </div>

              {/* Error box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {errorMessage}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer: Price Summary & Two Checkout Buttons */}
        {!completedOrder && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Barang:</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              {vipDiscount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Diskon VIP (10%):</span>
                  <span>-{formatIDR(vipDiscount)}</span>
                </div>
              )}
              {pointsUsed > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Potong Poin Member:</span>
                  <span>-{formatIDR(pointsUsed)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({selectedCourier}):</span>
                <span>{formatIDR(shippingCost)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-base text-slate-900">
                <span>Total Pembayaran:</span>
                <span className="text-rose-600">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            {/* Two Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* WhatsApp Direct Order Button */}
              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                disabled={cart.length === 0}
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
                title="Pesan langsung lewat WhatsApp admin toko"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </button>

              {/* Direct Web Order Button */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={cart.length === 0 || isSubmitting}
                className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pesanan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
