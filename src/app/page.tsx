'use client';

import React, { useState, useEffect } from 'react';
import VisualPromoLanding from '@/components/VisualPromoLanding';
import LoginScreen from '@/components/LoginScreen';
import CustomerNavbar from '@/components/CustomerNavbar';
import ProductCatalog from '@/components/ProductCatalog';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartCheckoutDrawer from '@/components/CartCheckoutDrawer';
import VipModal from '@/components/VipModal';
import UserProfileModal from '@/components/UserProfileModal';
import AdesBot from '@/components/AdesBot';
import { Product, CartItem, User, Order } from '@/types';
import { Crown, Tag, Truck, RotateCcw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type Screen = 'landing' | 'customer_login' | 'store';

export default function ResponsiveAppRoot() {
  // Screen-by-Screen State Navigation (Starts STRICTLY on visual promo landing!)
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  // App Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load User & Cart on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ades_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedCart = localStorage.getItem('ades_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('ades_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Screen Transition Handlers
  const handleOpenCustomerLogin = () => {
    setCurrentScreen('customer_login');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('store');
    showToast(`Selamat datang di Ades Store 01, ${user.name}!`);
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Tamu (Guest)',
      email: 'guest@adesstore.com',
      phone: '081200000000',
      role: 'CUSTOMER',
      isVip: false,
      memberPoints: 0,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(guestUser);
    setCurrentScreen('store');
    showToast('Masuk sebagai Tamu (Guest). Selamat berbelanja!');
  };

  const handleLogout = () => {
    localStorage.removeItem('ades_user');
    setCurrentUser(null);
    setCurrentScreen('landing');
    showToast('Berhasil keluar. Kembali ke halaman utama.');
  };

  // Cart Operations
  const handleAddToCart = (
    product: Product,
    size: number | string,
    color: string,
    qty: number
  ) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].qty += qty;
    } else {
      updatedCart.push({
        product,
        selectedSize: size,
        selectedColor: color,
        qty,
      });
    }

    saveCart(updatedCart);
    showToast(`✓ "${product.name}" (Size ${size}) ditambahkan!`);
  };

  const handleDirectCheckout = (
    product: Product,
    size: number | string,
    color: string,
    qty: number
  ) => {
    handleAddToCart(product, size, color, qty);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: string, size: number | string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          const newQty = item.qty + delta;
          return newQty <= 0 ? null : { ...item, qty: newQty };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const handleRemoveItem = (productId: string, size: number | string) => {
    saveCart(
      cart.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleOrderSuccess = (order: Order, remainingPoints: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, memberPoints: remainingPoints };
      setCurrentUser(updatedUser);
      localStorage.setItem('ades_user', JSON.stringify(updatedUser));
    }
    fetchProducts();
  };

  const handleVipUpgraded = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('ades_user', JSON.stringify(updatedUser));
    showToast('🎉 Selamat! Cashback 50.000 Poin Koin Member telah masuk ke saldo Anda!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 selection:bg-red-600 selection:text-white flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 left-1/2 -translate-x-1/2 max-w-sm w-full px-4">
          <div className="bg-slate-900/95 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-center animate-bounce">
            {toastMessage}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HALAMAN 1: LANDING PAGE VISUAL / BANNER IKLAN PROMO               */}
      {/* (Responsif: HP Portrait memanjang nyaman, Laptop Landscape 2-Kolom) */}
      {/* ------------------------------------------------------------------ */}
      {currentScreen === 'landing' && (
        <VisualPromoLanding
          onOpenCustomerLogin={handleOpenCustomerLogin}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HALAMAN 2: FORM LOGIN CUSTOMER                                     */}
      {/* ------------------------------------------------------------------ */}
      {currentScreen === 'customer_login' && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-zinc-950 to-slate-950">
          <div className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border border-zinc-800">
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onBackToLanding={handleBackToLanding}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HALAMAN 3: BERANDA TOKO & ETALASE PRODUK                          */}
      {/* (Responsif: HP Portrait 2 Kolom, Laptop Landscape 4 Kolom Grid)    */}
      {/* ------------------------------------------------------------------ */}
      {currentScreen === 'store' && (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
          <div>
            {/* Header Atas: Status, Widget Saldo Poin Member (Real-time di pojok kanan atas), dan Keranjang */}
            <CustomerNavbar
              currentUser={currentUser}
              cartCount={cart.reduce((s, i) => s + i.qty, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenVipModal={() => setIsVipModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onLogout={handleLogout}
              onSwitchToLogin={() => setCurrentScreen('customer_login')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Main Content Responsive max-w-6xl */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
              {/* VIP Membership Banner (Rp 50.000 via QRIS with instant 50.000 coins + 10% Cashback) */}
              <div
                onClick={() => setIsVipModalOpen(true)}
                className="cursor-pointer bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-transform hover:scale-[1.005] active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 shadow-inner flex-shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-sm sm:text-base">
                        Program VIP Membership Berbayar (Rp 50.000 via QRIS)
                      </h4>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-red-600">
                        Cashback 10%
                      </span>
                    </div>
                    <p className="text-xs text-amber-100 leading-tight mt-0.5">
                      Daftar sekarang &amp; dapatkan bonus <b>🪙 50.000 Poin Koin Member</b> + <b>Cashback 10%</b> di setiap belanja, ekstra diskon, dan garansi retur size!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md self-start sm:self-center hover:bg-amber-50"
                >
                  Aktivasi VIP Sekarang &rarr;
                </button>
              </div>

              {/* Title Section */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                    Katalog Resmi Ades Store 01
                  </h3>
                  <p className="text-xs text-slate-500">
                    Koleksi Sepatu (Size 36-43), Sandal Slide Empuk, dan Tas Fashion
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {products.length} Produk Tersedia
                </span>
              </div>

              {/* Product Catalog Responsive Grid (HP: 2 Kolom, Laptop: 4 Kolom) */}
              {loading ? (
                <div className="py-24 text-center space-y-2">
                  <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">
                    Memuat Produk Ades Store 01...
                  </p>
                </div>
              ) : (
                <ProductCatalog
                  products={products}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              )}

              {/* Quick Benefits Guarantee Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center space-x-2.5 shadow-2xs">
                  <Tag className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-black text-slate-900">Harga Promo</p>
                    <p className="text-[10px] text-slate-500">Diskon langsung setiap hari</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center space-x-2.5 shadow-2xs">
                  <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-black text-slate-900">Garansi Retur</p>
                    <p className="text-[10px] text-slate-500">Bebas tukar size 7 hari</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center space-x-2.5 shadow-2xs">
                  <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-black text-slate-900">4 Pilihan Kurir</p>
                    <p className="text-[10px] text-slate-500">J&amp;T, JNE, GOTO, Ninja</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center space-x-2.5 shadow-2xs">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-black text-slate-900">COD &amp; QRIS</p>
                    <p className="text-[10px] text-slate-500">Bayar di tempat atau instan</p>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Footer Store */}
          <footer className="bg-black text-slate-400 text-xs py-6 border-t border-zinc-800 mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-zinc-700 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="font-black text-white text-xs">Ades Store 01</span>
                  <span className="text-[10px] text-zinc-500 ml-2">
                    &ldquo;Langkah Nyaman, Gaya Maksimal Setiap Hari&rdquo;
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <button
                  onClick={() => setCurrentScreen('landing')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  &larr; Halaman Promo
                </button>
                <Link
                  href="/admin/login"
                  className="text-zinc-500 hover:text-zinc-300 underline decoration-dotted transition-colors"
                >
                  Akses Admin
                </Link>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODALS & DRAWERS                                                   */}
      {/* ------------------------------------------------------------------ */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onDirectCheckout={handleDirectCheckout}
          onOpenSizeAssistant={() => {
            setSelectedProduct(null);
            const chatTrigger = document.querySelector('button[title*="AdesBot"]') as HTMLButtonElement;
            chatTrigger?.click();
          }}
        />
      )}

      {/* Checkout Drawer (JNE, J&T, GOTO, Ninja, COD/QRIS, Google Maps, WhatsApp) */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onOpenVipModal={() => {
          setIsCartOpen(false);
          setIsVipModalOpen(true);
        }}
      />

      {/* VIP Modal (Rp50.000 via QRIS with instant 50.000 Coins) */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        currentUser={currentUser}
        onVipUpgraded={handleVipUpgraded}
      />

      {/* User Profile Modal (Foto, Nama, WhatsApp, Email, Alamat, Koin & Status VIP) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          localStorage.setItem('ades_user', JSON.stringify(updated));
        }}
        onLogout={handleLogout}
        onOpenVipModal={() => {
          setIsProfileModalOpen(false);
          setIsVipModalOpen(true);
        }}
      />

      {/* Floating AI Shopping Assistant (AdesBot) */}
      <AdesBot
        products={products}
        onOpenProduct={(p) => setSelectedProduct(p)}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />
    </div>
  );
}