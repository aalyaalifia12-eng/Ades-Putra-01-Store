'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Product, Order, ProductCategory } from '@/types';
import { formatIDR, formatIndoDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchProduct, setSearchProduct] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Product Add / Edit Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formCategory, setFormCategory] = useState<ProductCategory>('sepatu');
  const [formName, setFormName] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState(350000);
  const [formPromoPrice, setFormPromoPrice] = useState(250000);
  const [formCostPrice, setFormCostPrice] = useState(150000);
  const [formStock, setFormStock] = useState(20);
  const [formMinStock, setFormMinStock] = useState(5);
  const [formSizes, setFormSizes] = useState<number[]>([36, 37, 38, 39, 40, 41, 42, 43]);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd, resAna] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/admin/analytics').then((r) => r.json()),
      ]);

      if (resProd.success) setProducts(resProd.products || []);
      if (resOrd.success) setOrders(resOrd.orders || []);
      if (resAna.success) setAnalytics(resAna.analytics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormCategory('sepatu');
    setFormName('');
    setFormOriginalPrice(389000);
    setFormPromoPrice(279000);
    setFormCostPrice(150000);
    setFormStock(30);
    setFormMinStock(6);
    setFormSizes([36, 37, 38, 39, 40, 41, 42, 43]);
    setFormColors('Hitam, Putih');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    );
    setFormDescription('Koleksi alas kaki fashion terbaru Ades Store 01 dengan sol empuk.');
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
    setFormSizes(p.sizes || [38, 39, 40]);
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
        sizes: formCategory === 'tas' ? [0] : formSizes,
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

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: newStatus,
          payment_status: newStatus === 'SELESAI' ? 'PAID' : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Status pesanan berhasil diperbarui!');
        fetchData();
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProduct.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const weeklyTrend = analytics?.weeklyTrend || [];
  const maxWeeklyOmzet = Math.max(...weeklyTrend.map((w: any) => w.omzet), 500000);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border flex items-center space-x-2 animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-300 border-rose-800'
              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Ades Putra 01 Store" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-white">
                  Ades Putra <span className="text-red-500">01</span> Store
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white">
                  Admin Backoffice
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Belanja Pasti Tanpa Ragu: Manajemen Produk & Analisis Mingguan
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Toko Customer</span>
            </Link>

            <Link
              href="/admin/login"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Keluar Admin"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-2 border-t border-slate-800/80 py-2">
          {[
            { id: 'products', label: 'Manajemen Produk (CRUD)', icon: Package },
            { id: 'orders', label: `Pesanan Masuk (${orders.length})`, icon: Truck },
            { id: 'analytics', label: 'Analisis Penjualan Mingguan', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 w-full">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <p className="text-2xl font-black text-rose-400 mt-1">
              {formatIDR(analytics?.totalOmzet || 0)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dari {analytics?.totalOrdersCount || 0} pesanan terdaftar
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pesanan Butuh Proses
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {analytics?.pendingOrdersCount || 0} Pesanan
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Perlu pengemasan & resi
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Katalog Produk
            </span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {products.length} SKU
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sepatu, Sandal, & Tas
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Peringatan Stok Menipis
            </span>
            <p className="text-2xl font-black text-rose-500 mt-1">
              {analytics?.lowStockCount || 0} Produk
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Stok &le; batas minimum alert
            </p>
          </div>
        </div>

        {/* ================= TAB 1: MANAJEMEN PRODUK (CRUD) ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center space-x-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Cari nama sepatu, sandal, tas, atau SKU..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="all">Semua Kategori ({products.length})</option>
                  <option value="sepatu">👟 Sepatu</option>
                  <option value="sandal">🩴 Sandal</option>
                  <option value="tas">👜 Tas</option>
                </select>
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Produk Baru</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-extrabold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Info Produk & SKU</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Pilihan Size</th>
                      <th className="py-3 px-4 text-right">Harga Normal</th>
                      <th className="py-3 px-4 text-right">Harga Promo</th>
                      <th className="py-3 px-4 text-center">Stok</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((p) => {
                      const isLowStock = p.stock <= p.min_stock_alert;
                      return (
                        <tr key={p.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-900 flex-shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white text-xs">{p.name}</p>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-900 border border-slate-700 text-rose-300">
                              {p.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {p.category === 'tas' ? (
                              <span className="text-slate-400">One Size</span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-[140px]">
                                {(p.sizes || []).map((s) => (
                                  <span
                                    key={s}
                                    className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] font-bold text-slate-300"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right text-slate-400 font-medium">
                            {formatIDR(p.original_price)}
                          </td>

                          <td className="py-3 px-4 text-right font-black text-rose-400">
                            {p.promo_price ? formatIDR(p.promo_price) : '-'}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                p.stock <= 0
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : isLowStock
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              }`}
                            >
                              {p.stock} pcs
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                title="Edit Produk"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950 transition-colors"
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

        {/* ================= TAB 2: PESANAN MASUK ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-extrabold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">No. Pesanan & Waktu</th>
                      <th className="py-3 px-4">Penerima & Alamat</th>
                      <th className="py-3 px-4">Item & Ukuran</th>
                      <th className="py-3 px-4">Kurir & Ongkir</th>
                      <th className="py-3 px-4 text-right">Total Tagihan</th>
                      <th className="py-3 px-4 text-center">Status Pesanan</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-white">{ord.order_number}</p>
                          <p className="text-[10px] text-slate-400">{formatIndoDate(ord.created_at)}</p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{ord.customer_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{ord.customer_phone}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{ord.customer_address}</p>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {ord.items.map((i, idx) => (
                              <div key={idx} className="text-[11px] text-slate-300">
                                <b>{i.quantity}x</b> {i.name} (Size: <span className="text-amber-300 font-bold">{i.size}</span>)
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-rose-300">{ord.shipping_courier}</span>
                          <p className="text-[10px] text-slate-400">{formatIDR(ord.shipping_cost)}</p>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <p className="font-black text-sm text-emerald-400">{formatIDR(ord.total_amount)}</p>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {ord.payment_method} ({ord.payment_status})
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              ord.order_status === 'SELESAI'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : ord.order_status === 'DIKIRIM'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : ord.order_status === 'DIPROSES'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {ord.order_status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <select
                            value={ord.order_status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none"
                          >
                            <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
                            <option value="DIPROSES">Diproses</option>
                            <option value="DIKIRIM">Dikirim</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="BATAL">Batal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ANALISIS PENJUALAN MINGGUAN ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Weekly Sales Chart (Senin - Minggu) */}
            <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-white">
                    Grafik Tren Transaksi Mingguan (Senin - Minggu)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aktivitas omzet penjualan toko Ades Store 01 sepanjang minggu berjalan
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                  Total Minggu Ini: {formatIDR(analytics?.totalOmzet || 0)}
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="h-56 flex items-end justify-between pt-8 px-4 gap-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                {weeklyTrend.map((d: any, idx: number) => {
                  const heightPercent = maxWeeklyOmzet > 0 ? Math.round((d.omzet / maxWeeklyOmzet) * 100) : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-white text-slate-900 text-[10px] font-black py-1 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-10">
                        {formatIDR(d.omzet)} ({d.count} pesanan)
                      </div>

                      {/* Bar */}
                      <div className="w-full max-w-[50px] bg-slate-800 rounded-t-xl h-40 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${Math.max(heightPercent, 6)}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            d.omzet > 0
                              ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 group-hover:brightness-110'
                              : 'bg-slate-700/60'
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <span className="text-[11px] font-extrabold text-slate-300 mt-2">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Breakdown & Top Bestseller Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Courier Breakdown */}
              <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
                <h4 className="font-black text-sm text-white">
                  Sebaran Kurir Ekspedisi (JNE, J&T, GOTO, Ninja)
                </h4>
                <div className="space-y-3">
                  {Object.entries(analytics?.courierBreakdown || {}).map(([courier, count]: any) => (
                    <div key={courier} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{courier}</span>
                        <span className="text-rose-400">{count} pesanan</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${analytics?.totalOrdersCount > 0 ? (count / analytics.totalOrdersCount) * 100 : 0}%`,
                          }}
                          className="h-full bg-rose-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bestseller Products */}
              <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
                <h4 className="font-black text-sm text-white">
                  Produk Terlaris (Top Bestsellers)
                </h4>
                <div className="space-y-2.5">
                  {(analytics?.topProducts || []).map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-400 uppercase">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-rose-400">{p.qty} terjual</span>
                        <p className="text-[10px] text-slate-400">{formatIDR(p.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL ADD / EDIT PRODUK ================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-black text-white text-sm">
                {editingProduct ? 'Edit Katalog Produk' : 'Tambah Produk Fashion Baru'}
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Kategori Fashion:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sepatu', 'sandal', 'tas'] as ProductCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`py-2 px-3 rounded-xl uppercase font-extrabold border text-center transition-all ${
                        formCategory === cat
                          ? 'border-rose-500 bg-rose-600 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Nama Produk:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ades Aerocushion White Sneakers"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Prices: Cost, Original, Promo */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Harga Modal (HPP):
                  </label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Harga Normal:
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Harga Promo:
                  </label>
                  <input
                    type="number"
                    value={formPromoPrice}
                    onChange={(e) => setFormPromoPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-rose-400 font-extrabold"
                  />
                </div>
              </div>

              {/* Stock and Min Stock Alert */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Sisa Stok:
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Batas Alert Stok Minimum:
                  </label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value) || 5)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Sizes (for shoes/sandals) */}
              {formCategory !== 'tas' && (
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Pilihan Ukuran Size (36 - 43):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[36, 37, 38, 39, 40, 41, 42, 43].map((sz) => {
                      const isChecked = formSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setFormSizes(formSizes.filter((s) => s !== sz));
                            } else {
                              setFormSizes([...formSizes, sz].sort((a, b) => a - b));
                            }
                          }}
                          className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-rose-600 border-rose-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Colors */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Varian Warna (pisahkan koma):
                </label>
                <input
                  type="text"
                  value={formColors}
                  onChange={(e) => setFormColors(e.target.value)}
                  placeholder="Putih, Hitam, Beige"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  URL Foto Produk:
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Deskripsi Produk:
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
                  {formError}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md shadow-rose-600/30"
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
