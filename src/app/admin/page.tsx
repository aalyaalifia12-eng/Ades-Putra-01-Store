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
  Video,
  Image as ImageIcon,
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Product, Order, ProductCategory, BannerAd } from '@/types';
import { formatIDR, formatIndoDate } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'banners'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<BannerAd[]>([]);
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

  // Banner Ads State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerAd | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerTagline, setBannerTagline] = useState('');
  const [bannerBadge, setBannerBadge] = useState('PROMO ADES STORE');
  const [bannerDescription, setBannerDescription] = useState('');
  const [bannerMediaType, setBannerMediaType] = useState<'image' | 'video'>('image');
  const [bannerMediaUrl, setBannerMediaUrl] = useState('');
  const [bannerTargetCategory, setBannerTargetCategory] = useState<ProductCategory>('sepatu_pria');
  const [bannerCtaText, setBannerCtaText] = useState('Lihat Promo →');
  const [bannerPromoCode, setBannerPromoCode] = useState('');
  const [bannerDiscountHighlight, setBannerDiscountHighlight] = useState('DISKON 20%');
  const [bannerBgGradient, setBannerBgGradient] = useState('from-red-950 via-rose-900 to-slate-950');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);

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
      const [resProd, resOrd, resAna, resBan] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/admin/analytics').then((r) => r.json()),
        fetch('/api/banners?all=true').then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (resProd.success) setProducts(resProd.products || []);
      if (resBan && resBan.success) setBanners(resBan.banners || []);

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

  // =========================================================================
  // BANNER ADS HANDLERS (FOTO & VIDEO BERANDA)
  // =========================================================================
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerTagline('Diskon Spesial');
    setBannerBadge('🔥 PROMO TERBARU');
    setBannerDescription('');
    setBannerMediaType('image');
    setBannerMediaUrl('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80');
    setBannerTargetCategory('sepatu_pria');
    setBannerCtaText('Lihat Promo →');
    setBannerPromoCode('ADESKILAT');
    setBannerDiscountHighlight('DISKON 20%');
    setBannerBgGradient('from-red-950 via-rose-900 to-slate-950');
    setBannerIsActive(true);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: BannerAd) => {
    setEditingBanner(b);
    setBannerTitle(b.title);
    setBannerTagline(b.tagline || '');
    setBannerBadge(b.badge || '');
    setBannerDescription(b.description || '');
    setBannerMediaType(b.media_type || 'image');
    setBannerMediaUrl(b.media_url);
    setBannerTargetCategory(b.target_category || 'sepatu_pria');
    setBannerCtaText(b.cta_text || 'Lihat Promo →');
    setBannerPromoCode(b.promo_code || '');
    setBannerDiscountHighlight(b.discount_highlight || 'DISKON 20%');
    setBannerBgGradient(b.bg_gradient || 'from-red-950 via-rose-900 to-slate-950');
    setBannerIsActive(b.is_active);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerMediaUrl.trim()) {
      showToast('Judul iklan dan URL media (foto/video) wajib diisi.', 'error');
      return;
    }

    setBannerSubmitting(true);
    try {
      const payload = {
        title: bannerTitle,
        tagline: bannerTagline,
        badge: bannerBadge,
        description: bannerDescription,
        media_type: bannerMediaType,
        media_url: bannerMediaUrl,
        target_category: bannerTargetCategory,
        cta_text: bannerCtaText,
        promo_code: bannerPromoCode,
        discount_highlight: bannerDiscountHighlight,
        bg_gradient: bannerBgGradient,
        is_active: bannerIsActive,
      };

      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menyimpan iklan.', 'error');
        return;
      }

      showToast(editingBanner ? 'Iklan berhasil diperbarui!' : 'Iklan beranda baru berhasil ditambahkan!');
      setIsBannerModalOpen(false);
      fetchData(true);
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setBannerSubmitting(false);
    }
  };

  const handleDeleteBanner = async (b: BannerAd) => {
    if (!confirm(`Hapus iklan "${b.title}" dari beranda?`)) return;
    try {
      const res = await fetch(`/api/banners/${b.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Iklan berhasil dihapus.');
        fetchData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus iklan.', 'error');
    }
  };

  const handleToggleBannerActive = async (b: BannerAd) => {
    try {
      const res = await fetch(`/api/banners/${b.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !b.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Iklan ${!b.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`);
        fetchData(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status.', 'error');
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
            {
              id: 'banners',
              label: `Iklan Beranda (${banners.length} Media)`,
              icon: Film,
              badge: banners.filter((b) => b.is_active).length > 0 ? `${banners.filter((b) => b.is_active).length} Aktif` : undefined,
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
        {/* TAB 3: LAPORAN PENJUALAN MINGGUAN & ANALYTICS                     */}
        {/* ================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards Header */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Omzet Kotor
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatIDR(analytics?.totalOmzet || 0)}
                </h3>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Dari seluruh pesanan aktif</span>
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Est. Keuntungan Bersih
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-700">
                  {formatIDR(analytics?.cleanProfit || Math.round((analytics?.totalOmzet || 0) * 0.35))}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Margin keuntungan bersih rata-rata ~35%
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Pesanan
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {analytics?.totalOrdersCount || orders.length || 0}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Pesanan masuk di sistem Ades Store
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Garansi Retur / Tukar
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-800">
                  {analytics?.returOrdersCount || 0}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Garansi tukar size 7 hari terlayani
                </p>
              </div>
            </div>

            {/* Grafik Tren Omzet Harian 7 Hari */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-red-500 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
                <div>
                  <h4 className="font-black text-base text-slate-900 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                    <span>Grafik Tren Penjualan 7 Hari Terakhir</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ades Store 01 &bull; Cikajang & Garut &bull; Performa Omzet Harian
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                    Omzet: {formatIDR(analytics?.totalOmzet || 0)}
                  </span>
                  <button
                    onClick={fetchData}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200"
                    title="Refresh Data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bar Chart Visual */}
              <div className="grid grid-cols-7 gap-2 pt-6 items-end h-52">
                {(analytics?.weeklyTrend || []).map((day: any, idx: number) => {
                  const maxOmzet = Math.max(...(analytics?.weeklyTrend || []).map((d: any) => d.omzet), 100000);
                  const heightPercent = Math.max(10, Math.round((day.omzet / maxOmzet) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full space-y-2 group">
                      <span className="text-[10px] font-black text-red-600 line-clamp-1 group-hover:scale-110 transition-transform">
                        {day.omzet > 0 ? `${Math.round(day.omzet / 1000)}k` : '0'}
                      </span>
                      <div
                        className="w-full max-w-[42px] bg-gradient-to-t from-red-600 via-rose-500 to-rose-400 rounded-t-xl transition-all duration-500 shadow-sm group-hover:from-red-700 group-hover:to-rose-500"
                        style={{ height: `${heightPercent}%` }}
                        title={`${day.day || day.date}: ${formatIDR(day.omzet)} (${day.count || 0} transaksi)`}
                      />
                      <span className="text-[11px] font-bold text-slate-600 truncate w-full text-center">
                        {day.day || day.date || `Hari ${idx + 1}`}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {day.count || 0} order
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid 2 Kolom: Distribusi Ekspedisi Kurir & Produk Terlaris */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Kolom 1: Distribusi Ekspedisi & Antar Cepat Garut */}
              <div className="bg-white p-5 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-red-600" />
                    <h4 className="font-black text-sm text-slate-900">
                      Distribusi Kurir &amp; Pengiriman
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    Cikajang, Garut &amp; Nasional
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(analytics?.courierBreakdown || {
                    '⚡ Kurir Kilat Ades (Cikajang & Garut)': 0,
                    '🏪 Ambil di Toko Offline (Pick-up Store)': 0,
                    'J&T Express': 0,
                    'JNE': 0,
                    'Ninja Xpress': 0,
                  }).map(([courierName, count]: any) => {
                    const totalDeliveries = Math.max(1, Object.values(analytics?.courierBreakdown || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0) as number);
                    const pct = Math.round((Number(count) / totalDeliveries) * 100);

                    return (
                      <div key={courierName} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 line-clamp-1">
                            {courierName}
                          </span>
                          <span className="font-mono font-black text-red-600">
                            {count} paket ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="bg-red-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom 2: Top 5 Produk Paling Laris */}
              <div className="bg-white p-5 rounded-3xl border-2 border-red-500/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-red-600" />
                    <h4 className="font-black text-sm text-slate-900">
                      Top 5 Produk Terlaris
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    Paling Banyak Dibeli
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(analytics?.topProducts && analytics.topProducts.length > 0) ? (
                    analytics.topProducts.map((tp: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-red-50/50 border border-slate-200 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                            <img
                              src={tp.image || '/logo.png'}
                              alt={tp.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-slate-900 truncate">
                              {tp.name}
                            </p>
                            <span className="text-[10px] text-slate-500 capitalize">
                              {tp.category || 'Fashion'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 pl-2">
                          <p className="text-xs font-black text-red-600">
                            {tp.qty} Terjual
                          </p>
                          <p className="text-[10px] font-mono text-slate-500">
                            {formatIDR(tp.revenue || 0)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      <Package className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                      <span>Belum ada data produk terjual</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: KELOLA IKLAN BERANDA (FOTO & VIDEO)                       */}
        {/* ================================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Header Tab Iklan */}
            <div className="bg-white p-5 rounded-3xl border-2 border-red-500 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Film className="w-5 h-5 text-red-600" />
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Manajemen Iklan Beranda &bull; Foto &amp; Video
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur banner promo beranda toko: bisa upload foto produk atau video review sepatu/tas.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddBanner}
                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Iklan Baru</span>
              </button>
            </div>

            {/* Grid Daftar Iklan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className={`bg-white rounded-3xl border-2 transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                    b.is_active ? 'border-red-500/80 hover:border-red-600' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    {/* Media Container: Foto atau Video */}
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      {b.media_type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            src={b.media_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2.5 left-2.5 inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-md">
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={b.media_url}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2.5 left-2.5 inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/70 text-white shadow-md backdrop-blur-xs">
                            <ImageIcon className="w-3 h-3 text-amber-300" />
                            <span>Foto</span>
                          </span>
                        </div>
                      )}

                      {/* Active Status Badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md ${
                          b.is_active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {b.is_active ? '● Tayang di Beranda' : '○ Nonaktif'}
                      </span>
                    </div>

                    {/* Content Detail */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 truncate">
                          {b.badge || 'PROMO'}
                        </span>
                        {b.discount_highlight && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {b.discount_highlight}
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-sm text-slate-900 leading-snug line-clamp-2">
                        {b.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {b.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-600">
                        {b.promo_code && (
                          <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Kupon: <b>{b.promo_code}</b>
                          </span>
                        )}
                        {b.target_category && (
                          <span className="font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 capitalize">
                            Kategori: {b.target_category.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBannerActive(b)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                        b.is_active
                          ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {b.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBanner(b)}
                        className="p-1.5 rounded-xl bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
                        title="Edit Iklan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(b)}
                        className="p-1.5 rounded-xl bg-white text-slate-700 hover:text-red-600 hover:bg-red-100 border border-slate-200 transition-colors"
                        title="Hapus Iklan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* ================================================================= */}
      {/* MODAL ADD / EDIT IKLAN BERANDA (FOTO & VIDEO)                     */}
      {/* ================================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-white border-b-2 border-red-500 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {editingBanner ? 'Edit Iklan Beranda' : 'Tambah Iklan Beranda Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {/* Media Type Selector: Foto vs Video */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Pilih Format Media Iklan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBannerMediaType('image')}
                    className={`py-2 px-3 rounded-xl border-2 font-black flex items-center justify-center space-x-1.5 transition-all ${
                      bannerMediaType === 'image'
                        ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Foto / Gambar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBannerMediaType('video')}
                    className={`py-2 px-3 rounded-xl border-2 font-black flex items-center justify-center space-x-1.5 transition-all ${
                      bannerMediaType === 'video'
                        ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video (MP4 / Web Video)</span>
                  </button>
                </div>
              </div>

              {/* Media URL Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    URL {bannerMediaType === 'video' ? 'Video (MP4)' : 'Foto / Gambar'}:
                  </label>
                  {/* Preset quick buttons */}
                  <div className="flex items-center space-x-1">
                    {bannerMediaType === 'video' ? (
                      <button
                        type="button"
                        onClick={() =>
                          setBannerMediaUrl(
                            'https://assets.mixkit.co/videos/preview/mixkit-hands-tying-running-shoes-42994-large.mp4'
                          )
                        }
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Contoh Video
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setBannerMediaUrl(
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Contoh Foto
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="url"
                  required
                  value={bannerMediaUrl}
                  onChange={(e) => setBannerMediaUrl(e.target.value)}
                  placeholder={
                    bannerMediaType === 'video'
                      ? 'https://.../video.mp4'
                      : 'https://images.unsplash.com/...'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Live Media Preview Box */}
              {bannerMediaUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 relative">
                  {bannerMediaType === 'video' ? (
                    <video
                      src={bannerMediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={bannerMediaUrl}
                      alt="Preview Iklan"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                    Live Preview ({bannerMediaType})
                  </span>
                </div>
              )}

              {/* Title & Tagline */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Judul Iklan Promo:
                </label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Contoh: Spesial Ramadhan Diskon 20% Sepatu & Tas!"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Badge Teks (Pill):
                  </label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    placeholder="Contoh: 🌙 SPESIAL RAMADHAN"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Tagline Subtitle:
                  </label>
                  <input
                    type="text"
                    value={bannerTagline}
                    onChange={(e) => setBannerTagline(e.target.value)}
                    placeholder="Contoh: Diskon Berkah Lebaran"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-medium focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Deskripsi Singkat:
                </label>
                <textarea
                  rows={2}
                  value={bannerDescription}
                  onChange={(e) => setBannerDescription(e.target.value)}
                  placeholder="Jelaskan penawaran menarik kepada pembeli..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Target Category & Promo Code */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Kategori Terkait (Link Klik):
                  </label>
                  <select
                    value={bannerTargetCategory}
                    onChange={(e) => setBannerTargetCategory(e.target.value as ProductCategory)}
                    className="w-full py-2 px-3 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-xs focus:border-red-500 focus:outline-none"
                  >
                    {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Kode Kupon (Opsional):
                  </label>
                  <input
                    type="text"
                    value={bannerPromoCode}
                    onChange={(e) => setBannerPromoCode(e.target.value)}
                    placeholder="Contoh: RAMADHAN20"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-mono font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Discount Highlight & CTA Text */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Highlight Diskon:
                  </label>
                  <input
                    type="text"
                    value={bannerDiscountHighlight}
                    onChange={(e) => setBannerDiscountHighlight(e.target.value)}
                    placeholder="Contoh: DISKON 20%"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Teks Tombol Aksi (CTA):
                  </label>
                  <input
                    type="text"
                    value={bannerCtaText}
                    onChange={(e) => setBannerCtaText(e.target.value)}
                    placeholder="Contoh: Belanja Sekarang →"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="toggleBannerActive"
                  checked={bannerIsActive}
                  onChange={(e) => setBannerIsActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                />
                <label htmlFor="toggleBannerActive" className="font-bold text-slate-800 cursor-pointer">
                  Tayangkan Iklan ini di Beranda Toko (Aktif)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={bannerSubmitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-600/30 transition-all flex items-center space-x-1.5"
                >
                  <span>{bannerSubmitting ? 'Menyimpan...' : 'Simpan Iklan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
