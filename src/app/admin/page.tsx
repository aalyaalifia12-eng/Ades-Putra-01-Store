'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  TrendingUp,
  BarChart3,
  DollarSign,
  Truck,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  ShoppingBag,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Eye,
  Bell,
  MessageCircle,
  ChevronRight,
  Send,
  AlertTriangle,
  Minus,
  Check,
} from 'lucide-react';
import { Product, Order, ProductCategory } from '@/types';
import { formatIDR, formatIndoDate } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchProduct, setSearchProduct] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'empty'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Real-time Order Notification System
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  const previousOrdersCountRef = useRef<number>(0);
  const [hasAudioPermission, setHasAudioPermission] = useState(true);

  // Quick Stock Updating State (Product ID -> loading bool)
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  // Tracking Number Modal State
  const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
  const [inputTrackingNumber, setInputTrackingNumber] = useState<string>('');

  // Product Add / Edit Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formCategory, setFormCategory] = useState<ProductCategory>('sepatu_pria');
  const [formName, setFormName] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState(350000);
  const [formPromoPrice, setFormPromoPrice] = useState(250000);
  const [formCostPrice, setFormCostPrice] = useState(150000);
  const [formStock, setFormStock] = useState(20);
  const [formMinStock, setFormMinStock] = useState(5);
  const [formSizes, setFormSizes] = useState<(number | string)[]>([39, 40, 41, 42, 43]);
  const [formColors, setFormColors] = useState('Hitam, Putih');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Play Pleasant Notification Bell Sound via Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // First bell chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Second bell chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.55);
    } catch {
      // Audio context error or blocked by browser policy
    }
  }, []);

  const fetchData = async (isBackgroundPoll = false) => {
    if (!isBackgroundPoll) setLoading(true);
    try {
      const [resProd, resOrd, resAna] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/admin/analytics').then((r) => r.json()),
      ]);

      if (resProd.success) setProducts(resProd.products || []);

      if (resOrd.success) {
        const newOrders: Order[] = resOrd.orders || [];

        // Check if a new order arrived while on dashboard
        if (
          previousOrdersCountRef.current > 0 &&
          newOrders.length > previousOrdersCountRef.current
        ) {
          const latestOrder = newOrders[0];
          setNewOrderNotification(latestOrder);
          playNotificationSound();
          showToast(`🔔 Pesanan Baru Masuk dari ${latestOrder.customer_name}!`);
        }

        previousOrdersCountRef.current = newOrders.length;
        setOrders(newOrders);
      }

      if (resAna.success) setAnalytics(resAna.analytics || null);
    } catch (e) {
      console.error(e);
    } finally {
      if (!isBackgroundPoll) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-polling every 6 seconds for new orders notification
    const interval = setInterval(() => {
      fetchData(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Quick Stock Increment / Decrement
  const handleQuickStockChange = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingStockId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
        showToast(`Stok diperbarui: ${newStock} pcs`);
      } else {
        showToast(data.error || 'Gagal mengubah stok', 'error');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setUpdatingStockId(null);
    }
  };

  // Open Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormCategory('sepatu_pria');
    setFormName('');
    setFormOriginalPrice(389000);
    setFormPromoPrice(279000);
    setFormCostPrice(150000);
    setFormStock(25);
    setFormMinStock(5);
    setFormSizes([39, 40, 41, 42, 43]);
    setFormColors('Hitam, Putih');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    );
    setFormDescription('Koleksi alas kaki & fashion premium Ades Store 01.');
    setFormError(null);
    setIsAddEditModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormCategory(p.category);
    setFormName(p.name);
    setFormOriginalPrice(p.original_price);
    setFormPromoPrice(p.promo_price || 0);
    setFormCostPrice(p.cost_price);
    setFormStock(p.stock);
    setFormMinStock(p.min_stock_alert);
    setFormSizes(p.sizes || [39, 40, 41]);
    setFormColors(p.colors ? p.colors.join(', ') : 'Hitam, Putih');
    setFormImageUrl(p.image_url);
    setFormDescription(p.description);
    setFormError(null);
    setIsAddEditModalOpen(true);
  };

  // Save Product (Create / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        category: formCategory,
        name: formName,
        original_price: Number(formOriginalPrice),
        promo_price: formPromoPrice ? Number(formPromoPrice) : undefined,
        cost_price: Number(formCostPrice),
        stock: Number(formStock),
        min_stock_alert: Number(formMinStock),
        sizes: formCategory.startsWith('sepatu')
          ? formSizes.length > 0
            ? formSizes
            : [39, 40, 41]
          : ['All Size'],
        colors: formColors.split(',').map((c) => c.trim()).filter(Boolean),
        image_url: formImageUrl,
        description: formDescription,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Gagal menyimpan produk.');
        setFormSubmitting(false);
        return;
      }

      showToast(editingProduct ? 'Produk berhasil diupdate!' : 'Produk baru berhasil ditambahkan!');
      setIsAddEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Hapus produk "${product.name}" dari katalog toko?`)) return;

    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Produk berhasil dihapus.');
        fetchData();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus.', 'error');
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: newStatus,
          payment_status: newStatus === 'SELESAI' || newStatus === 'DIPROSES' || newStatus === 'DIKIRIM' ? 'PAID' : undefined,
          tracking_number: trackingNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Status pesanan berhasil diubah menjadi "${newStatus}"!`);
        fetchData(true);
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // Save Tracking Number & Mark as 'DIKIRIM'
  const handleSaveShipping = async () => {
    if (!shippingModalOrder) return;
    await handleUpdateOrderStatus(
      shippingModalOrder.id,
      'DIKIRIM',
      inputTrackingNumber.trim() || `JT-${Date.now().toString().slice(-8)}`
    );
    setShippingModalOrder(null);
    setInputTrackingNumber('');
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduct.toLowerCase());
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'empty'
        ? p.stock <= 0
        : p.stock <= p.min_stock_alert && p.stock > 0;
    return matchesCat && matchesSearch && matchesStock;
  });

  // Filtered Orders List
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.order_status === orderStatusFilter;
  });

  const pendingOrdersCount = orders.filter(
    (o) => o.order_status === 'MENUNGGU_PEMBAYARAN' || o.order_status === 'DIPROSES'
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.min_stock_alert).length;
  const emptyStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border-2 flex items-center space-x-2 animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-500'
              : 'bg-emerald-50 text-emerald-800 border-emerald-500'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Pop-up Live Alert Pesanan Masuk (Real-time Notification) */}
      {newOrderNotification && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-3xl border-2 border-red-500 shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center animate-bounce shadow-md">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider block">
                  Pesanan Baru Masuk! 🔔
                </span>
                <p className="font-black text-xs text-slate-900">
                  {newOrderNotification.customer_name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNewOrderNotification(null)}
              className="text-slate-400 hover:text-red-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 p-2.5 rounded-2xl bg-slate-50 border border-red-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono font-bold">#{newOrderNotification.order_number}</span>
              <span className="font-black text-red-600">{formatIDR(newOrderNotification.total_amount)}</span>
            </div>
            <p className="text-[10px] text-slate-600 truncate">
              {newOrderNotification.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
            </p>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderStatusFilter('all');
                setNewOrderNotification(null);
              }}
              className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs text-center shadow-xs transition-colors"
            >
              Lihat &amp; Proses Pesanan &rarr;
            </button>
            <button
              onClick={() => setNewOrderNotification(null)}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Admin Top Header: Clean White dengan Red Line Accent */}
      <header className="bg-white border-b-2 border-red-500 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-0.5 border-2 border-red-500 flex items-center justify-center overflow-hidden shadow-xs">
              <img src="/logo.png" alt="Ades Putra 01 Store" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-slate-900 leading-tight">
                  Ades Putra <span className="text-red-600">01</span> Store
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
                  Admin Panel
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                Pusat Kontrol Stok Produk, Pesanan Masuk &amp; Manajemen Status
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Indicator Alert */}
            <div
              onClick={() => {
                setActiveTab('orders');
                setOrderStatusFilter('MENUNGGU_PEMBAYARAN');
              }}
              className="cursor-pointer flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-2xs"
              title="Pesanan Menunggu Proses"
            >
              <Bell className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span className="text-xs font-black">
                {pendingOrdersCount} Pesanan Baru
              </span>
            </div>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Toko</span>
            </Link>

            <Link
              href="/admin/login"
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
              title="Keluar Admin"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs (White Background with Red Active Line) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-2 border-t border-slate-100 py-2 overflow-x-auto scrollbar-none">
          {[
            {
              id: 'orders',
              label: `Status Pesanan Masuk (${orders.length})`,
              icon: Truck,
              badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Baru` : undefined,
            },
            {
              id: 'products',
              label: `Katalog & Stok (${products.length} SKU)`,
              icon: Package,
              badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined,
            },
            {
              id: 'analytics',
              label: 'Laporan Penjualan',
              icon: BarChart3,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 border border-red-600'
                    : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                      isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex-1 space-y-5 w-full">
        {/* Top Metric Cards: Clean White dengan Garis Merah */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-3xl border border-red-200 hover:border-red-500 transition-colors shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Total Omzet Penjualan
            </span>
            <p className="text-xl sm:text-2xl font-black text-red-600 mt-1">
              {formatIDR(analytics?.totalOmzet || 0)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dari {analytics?.totalOrdersCount || orders.length} transaksi
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-red-200 hover:border-red-500 transition-colors shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Pesanan Butuh Proses
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xl sm:text-2xl font-black text-amber-600">
                {pendingOrdersCount} Pesanan
              </p>
              {pendingOrdersCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Perlu konfirmasi &amp; kirim
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-red-200 hover:border-red-500 transition-colors shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Katalog Produk Aktif
            </span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {products.length} Produk
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              16 Kategori Sepatu &amp; Tas
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-red-200 hover:border-red-500 transition-colors shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Peringatan Stok Toko
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <p className="text-xl sm:text-2xl font-black text-red-600">
                {lowStockCount} Menipis
              </p>
              {emptyStockCount > 0 && (
                <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                  {emptyStockCount} Habis
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Perlu restok barang segera
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: STATUS PESANAN VERSI ADMIN (ORDER WORKFLOW & REALTIME NOTIF) */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Tabs Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-red-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-red-600" />
                  <span>Kelola Status Pesanan Masuk (Workflow Admin):</span>
                </div>
                <button
                  onClick={() => fetchData()}
                  className="text-red-600 hover:text-red-700 font-extrabold flex items-center space-x-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Segarkan</span>
                </button>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: `Semua Pesanan (${orders.length})` },
                  {
                    id: 'MENUNGGU_PEMBAYARAN',
                    label: `Menunggu Pembayaran (${orders.filter((o) => o.order_status === 'MENUNGGU_PEMBAYARAN').length})`,
                    badgeColor: 'text-amber-700',
                  },
                  {
                    id: 'DIPROSES',
                    label: `Perlu Dikemas (${orders.filter((o) => o.order_status === 'DIPROSES').length})`,
                    badgeColor: 'text-blue-700',
                  },
                  {
                    id: 'DIKIRIM',
                    label: `Sedang Dikirim (${orders.filter((o) => o.order_status === 'DIKIRIM').length})`,
                    badgeColor: 'text-purple-700',
                  },
                  {
                    id: 'SELESAI',
                    label: `Selesai (${orders.filter((o) => o.order_status === 'SELESAI').length})`,
                    badgeColor: 'text-emerald-700',
                  },
                  {
                    id: 'RETUR',
                    label: `Retur/Tukar Size (${orders.filter((o) => o.order_status === 'RETUR').length})`,
                    badgeColor: 'text-red-700',
                  },
                  {
                    id: 'BATAL',
                    label: `Batal (${orders.filter((o) => o.order_status === 'BATAL').length})`,
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      orderStatusFilter === st.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards / Table List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-red-200 text-center space-y-2">
                <Truck className="w-12 h-12 text-slate-300 mx-auto" />
                <h5 className="font-black text-sm text-slate-800">
                  Tidak Ada Pesanan di Status Ini
                </h5>
                <p className="text-xs text-slate-500">
                  Semua pesanan pada filter ini sudah diproses atau belum ada transaksi baru.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => {
                  const whatsappMessage = encodeURIComponent(
                    `Halo Kak ${ord.customer_name},\nKami dari *Ades Putra 01 Store* ingin mengonfirmasi pesanan Anda *#${ord.order_number}* sebesar ${formatIDR(ord.total_amount)}.\n\nStatus saat ini: *${ord.order_status}*.\nTerima kasih telah berbelanja di Ades Store 01!`
                  );
                  const cleanPhone = ord.customer_phone.replace(/^0/, '62').replace(/\D/g, '');

                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl border border-red-200 hover:border-red-400 p-4 sm:p-5 shadow-2xs transition-all space-y-3.5"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono font-black text-sm text-slate-900">
                            #{ord.order_number}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            &bull; {formatIndoDate(ord.created_at)}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                              ord.order_status === 'SELESAI'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : ord.order_status === 'DIKIRIM'
                                ? 'bg-purple-50 text-purple-700 border-purple-300'
                                : ord.order_status === 'DIPROSES'
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : ord.order_status === 'RETUR'
                                ? 'bg-red-50 text-red-700 border-red-400 font-black'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            {ord.order_status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Customer WhatsApp Chat Button */}
                        <div className="flex items-center space-x-2">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition-colors"
                            title="Chat WhatsApp Pembeli Langsung"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WA: {ord.customer_phone}</span>
                          </a>
                        </div>
                      </div>

                      {/* Middle Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        {/* Customer & Address */}
                        <div className="md:col-span-4 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Penerima &amp; Alamat Kirim
                          </span>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {ord.customer_name}
                          </p>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {ord.shipping_address || ord.customer_address || 'Alamat belum diinput'}
                          </p>
                          {ord.notes && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-1">
                              Catatan: &ldquo;{ord.notes}&rdquo;
                            </p>
                          )}
                          {ord.return_reason && (
                            <div className="p-2 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs mt-1">
                              <b>Alasan Retur:</b> {ord.return_reason}
                            </div>
                          )}
                        </div>

                        {/* Items Purchased */}
                        <div className="md:col-span-4 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Produk yang Dibeli ({ord.items.length} Barang)
                          </span>
                          <div className="space-y-1">
                            {ord.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200"
                              >
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-white flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 truncate">
                                    {item.name}
                                  </p>
                                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                                    <span className="font-bold text-red-600">
                                      {item.quantity}x
                                    </span>
                                    <span>&bull;</span>
                                    <span>Size: <b>{item.size}</b></span>
                                    {item.color && (
                                      <>
                                        <span>&bull;</span>
                                        <span>{item.color}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment Summary */}
                        <div className="md:col-span-4 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Kurir &amp; Pembayaran
                          </span>
                          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Ekspedisi:</span>
                              <span className="font-bold text-slate-800">
                                {ord.shipping_courier}
                              </span>
                            </div>

                            {ord.tracking_number ? (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Nomor Resi:</span>
                                <span className="font-mono font-black text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                                  {ord.tracking_number}
                                </span>
                              </div>
                            ) : null}

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Metode Bayar:</span>
                              <span className="font-bold text-slate-800">
                                {ord.payment_method} ({ord.payment_status === 'PAID' ? 'LUNAS' : 'PENDING'})
                              </span>
                            </div>

                            <div className="border-t border-slate-200 pt-1 flex justify-between items-center">
                              <span className="font-black text-slate-900 text-xs">Total Tagihan:</span>
                              <span className="font-black text-red-600 text-sm">
                                {formatIDR(ord.total_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Workflow Buttons (Versi Admin) */}
                      <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <span>Ubah Status Cepat:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Jika Menunggu Pembayaran -> Konfirmasi Bayar & Proses */}
                          {ord.order_status === 'MENUNGGU_PEMBAYARAN' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'DIPROSES')}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Konfirmasi Bayar &amp; Proses</span>
                            </button>
                          )}

                          {/* 2. Jika Diproses -> Input Resi & Kirim */}
                          {ord.order_status === 'DIPROSES' && (
                            <button
                              onClick={() => {
                                setShippingModalOrder(ord);
                                setInputTrackingNumber(ord.tracking_number || '');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition-colors flex items-center space-x-1"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Input Resi &amp; Kirim Paket</span>
                            </button>
                          )}

                          {/* 3. Jika Sedang Dikirim -> Tandai Selesai */}
                          {ord.order_status === 'DIKIRIM' && (
                            <>
                              <button
                                onClick={() => {
                                  setShippingModalOrder(ord);
                                  setInputTrackingNumber(ord.tracking_number || '');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                              >
                                Edit Resi
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'SELESAI')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-colors flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Tandai Selesai (Diterima)</span>
                              </button>
                            </>
                          )}

                          {/* 4. Jika Retur -> Selesaikan Tukar Size */}
                          {ord.order_status === 'RETUR' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'SELESAI')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-colors"
                            >
                              Terima Retur &amp; Selesaikan
                            </button>
                          )}

                          {/* Dropdown status manual */}
                          <select
                            value={ord.order_status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-white border-2 border-red-200 text-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold focus:border-red-500 focus:outline-none"
                          >
                            <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
                            <option value="DIPROSES">Diproses (Kemas)</option>
                            <option value="DIKIRIM">Dikirim</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="RETUR">Retur / Komplain</option>
                            <option value="BATAL">Dibatalkan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MANAJEMEN PRODUK & KONTROL STOK LENGKAP                   */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar: Search, Category Filter, Stock Alert Filter & Add Button */}
            <div className="bg-white p-4 rounded-3xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Cari nama barang atau SKU..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Semua Kategori ({products.length})</option>
                  {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-bold focus:outline-none ${
                    stockFilter !== 'all'
                      ? 'bg-red-50 border-red-400 text-red-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">Semua Level Stok</option>
                  <option value="low">⚠️ Stok Menipis ({lowStockCount})</option>
                  <option value="empty">❌ Stok Habis ({emptyStockCount})</option>
                </select>
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Produk Baru</span>
              </button>
            </div>

            {/* Products Table with Quick Stock Control */}
            <div className="bg-white rounded-3xl border border-red-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-red-200">
                    <tr>
                      <th className="py-3 px-4">Info Produk &amp; SKU</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4 text-center">Kontrol Stok Cepat</th>
                      <th className="py-3 px-4 text-right">Harga Normal</th>
                      <th className="py-3 px-4 text-right">Harga Promo</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isLowStock = p.stock <= p.min_stock_alert && p.stock > 0;
                      const isEmptyStock = p.stock <= 0;
                      const isStockUpdating = updatingStockId === p.id;

                      const catObj = PRODUCT_CATEGORIES.find((c) => c.id === p.category);
                      const catLabel = catObj ? catObj.shortName : p.category;

                      return (
                        <tr key={p.id} className="hover:bg-red-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-11 h-11 rounded-2xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <p className="font-extrabold text-slate-900 text-xs line-clamp-1">{p.name}</p>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full uppercase font-bold text-[10px] bg-slate-100 border border-slate-200 text-slate-700">
                              {catLabel}
                            </span>
                          </td>

                          {/* Quick Stock Controls (+ / - Buttons) */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex flex-col items-center space-y-1">
                              {/* Stock Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                                  isEmptyStock
                                    ? 'bg-red-100 text-red-700 border-red-300'
                                    : isLowStock
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                {isEmptyStock
                                  ? 'Habis (0)'
                                  : isLowStock
                                  ? `Menipis (${p.stock})`
                                  : `Aman (${p.stock} pcs)`}
                              </span>

                              {/* Quick +/- Buttons */}
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  disabled={isStockUpdating || p.stock <= 0}
                                  onClick={() => handleQuickStockChange(p.id, p.stock, -1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-colors disabled:opacity-30"
                                  title="Kurangi Stok -1"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono font-black text-xs text-slate-900 min-w-[28px] text-center">
                                  {p.stock}
                                </span>
                                <button
                                  type="button"
                                  disabled={isStockUpdating}
                                  onClick={() => handleQuickStockChange(p.id, p.stock, 1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-colors disabled:opacity-30"
                                  title="Tambah Stok +1"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isStockUpdating}
                                  onClick={() => handleQuickStockChange(p.id, p.stock, 5)}
                                  className="px-1.5 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 border border-slate-300 text-slate-600 text-[10px] font-extrabold transition-colors"
                                  title="Tambah Stok +5"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-medium text-slate-500">
                            {formatIDR(p.original_price)}
                          </td>

                          <td className="py-3 px-4 text-right font-black text-red-600">
                            {p.promo_price ? formatIDR(p.promo_price) : '-'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors"
                                title="Edit Detail Produk"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700 border border-slate-200 transition-colors"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: LAPORAN PENJUALAN MINGGUAN                                */}
        {/* ================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-red-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    Grafik Tren Omzet 7 Hari Terakhir
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ades Store 01 &bull; Performa Omzet Harian
                  </p>
                </div>
                <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
                  Total: {formatIDR(analytics?.totalOmzet || 0)}
                </span>
              </div>

              {/* Bar Chart Visual */}
              <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
                {(analytics?.weeklyTrend || []).map((day: any, idx: number) => {
                  const maxOmzet = Math.max(...(analytics?.weeklyTrend || []).map((d: any) => d.omzet), 100000);
                  const heightPercent = Math.max(8, Math.round((day.omzet / maxOmzet) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full space-y-2">
                      <span className="text-[10px] font-bold text-red-600 line-clamp-1">
                        {day.omzet > 0 ? `${Math.round(day.omzet / 1000)}k` : '0'}
                      </span>
                      <div
                        className="w-full max-w-[36px] bg-gradient-to-t from-red-600 to-rose-400 rounded-t-xl transition-all duration-500 shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center">
                        {day.date.slice(-5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL INPUT NOMOR RESI PENGIRIMAN (DIKIRIM)                      */}
      {/* ================================================================= */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-red-500 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-red-100 pb-2">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-sm text-slate-900">
                  Input Nomor Resi Pengiriman
                </h4>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-black text-slate-900">
                Pesanan #{shippingModalOrder.order_number}
              </p>
              <p className="text-slate-500">
                Penerima: <b>{shippingModalOrder.customer_name}</b> ({shippingModalOrder.shipping_courier})
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Masukkan Nomor Resi Ekspedisi (J&amp;T / JNE / Ninja):
              </label>
              <input
                type="text"
                value={inputTrackingNumber}
                onChange={(e) => setInputTrackingNumber(e.target.value)}
                placeholder="Contoh: JT82126468980ID"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 font-mono text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShippingModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveShipping}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs"
              >
                Simpan &amp; Kirim Paket &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL ADD / EDIT PRODUK                                           */}
      {/* ================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-white border-b-2 border-red-500 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">
                {editingProduct ? 'Edit Katalog Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-3 text-xs">
              {/* Category */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Kategori Produk (16 Kategori Lengkap):
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full py-2 px-3 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-xs focus:border-red-500 focus:outline-none"
                >
                  {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Produk:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ades Sneaker Casual Air..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Harga Normal (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Harga Promo (Rp):
                  </label>
                  <input
                    type="number"
                    value={formPromoPrice}
                    onChange={(e) => setFormPromoPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Harga Modal (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-red-50/50 rounded-2xl border border-red-200">
                <div>
                  <label className="font-black text-red-700 block mb-1">
                    Jumlah Stok Fisik:
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-red-300 text-slate-900 font-black focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Batas Alert Stok Menipis:
                  </label>
                  <input
                    type="number"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value) || 5)}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sizes (for shoes/sandals) */}
              {formCategory.startsWith('sepatu') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pilihan Ukuran Size Kaki:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[18, 20, 22, 26, 28, 30, 32, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((sz) => {
                      const isChecked = formSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setFormSizes(formSizes.filter((s) => s !== sz));
                            } else {
                              setFormSizes([...formSizes, sz]);
                            }
                          }}
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center border transition-all text-xs ${
                            isChecked
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Image URL */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  URL Foto Produk:
                </label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deskripsi Produk:
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-600/30 transition-all"
                >
                  {formSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
