import fs from 'fs';
import path from 'path';
import { Product, User, Order, BannerAd } from '@/types';
import { ALL_SEEDED_PRODUCTS } from '@/lib/products_seed';

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  banners: BannerAd[];
  meta: {
    last_order_counter: number;
    last_order_date: string;
  };
}

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production');
const DB_DIR = IS_SERVERLESS ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'ades_database.json');
const DB_TMP_FILE = path.join(DB_DIR, 'ades_database.tmp.json');

// Initial seed products for Ades Store 01 across all 16 categories
const initialProducts: Product[] = ALL_SEEDED_PRODUCTS;

// Initial seed users: Admin & Customers
const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator Ades Store',
    email: 'admin@adesstore01.com',
    phone: '082126468980',
    role: 'ADMIN',
    isVip: true,
    memberPoints: 999999,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-alya',
    name: 'Alya Alifia (VIP Member)',
    email: 'alya@customer.com',
    phone: '081298765432',
    role: 'CUSTOMER',
    isVip: true,
    memberPoints: 50000, // VIP Welcome Bonus Cashback
    vipJoinedAt: '2026-10-25T10:00:00.000Z',
    created_at: '2026-10-25T09:30:00.000Z',
  },
  {
    id: 'user-budi',
    name: 'Budi Santoso (Member Reguler)',
    email: 'budi@customer.com',
    phone: '085712345678',
    role: 'CUSTOMER',
    isVip: false,
    memberPoints: 0,
    created_at: '2026-10-28T14:15:00.000Z',
  },
];

// Seed weekly orders (Monday to Sunday) for analysis
const initialOrders: Order[] = [
  {
    id: 'ord-101',
    order_number: 'ADES-ORD-20261027-001',
    customer_id: 'user-budi',
    customer_name: 'Budi Santoso',
    customer_phone: '085712345678',
    customer_address: 'Jl. Kaliurang KM 5 No. 12, Sleman, D.I. Yogyakarta',
    items: [
      {
        product_id: 'prod-sep-pria-01',
        name: 'Ades Classic Penny Loafer Pria Kulit Formal Brown',
        category: 'sepatu_pria',
        size: 42,
        color: 'Tan Cokelat',
        price: 299000,
        quantity: 1,
        subtotal: 299000,
        image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 299000,
    shipping_courier: 'J&T Express',
    shipping_cost: 15000,
    points_used: 0,
    vip_discount: 0,
    total_amount: 314000,
    payment_method: 'QRIS',
    payment_status: 'PAID',
    order_status: 'SELESAI',
    created_at: '2026-10-27T08:30:00.000Z', // Senin
  },
  {
    id: 'ord-102',
    order_number: 'ADES-ORD-20261028-002',
    customer_id: 'user-alya',
    customer_name: 'Alya Alifia',
    customer_phone: '081298765432',
    customer_address: 'Apartemen Mataram City Tower A Lt. 8, Yogyakarta',
    items: [
      {
        product_id: 'prod-tas-wan-01',
        name: 'Ades Celine Quilted Leather Shoulder Bag Wanita Chic',
        category: 'tas_wanita',
        size: 'All Size',
        color: 'Hitam Rantai Emas',
        price: 239000,
        quantity: 1,
        subtotal: 239000,
        image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80',
      },
      {
        product_id: 'prod-aks-01',
        name: 'Ades Kaos Kaki Katun Premium Anti-Bakteri & Anti-Bau',
        category: 'aksesoris',
        size: 'All Size',
        color: 'Hitam-Putih-Abu',
        price: 45000,
        quantity: 1,
        subtotal: 45000,
        image_url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 284000,
    shipping_courier: 'GOTO (Instant)',
    shipping_cost: 25000,
    points_used: 20000, // Used 20k points!
    vip_discount: 28400, // 10% VIP discount
    total_amount: 260600,
    payment_method: 'QRIS',
    payment_status: 'PAID',
    order_status: 'DIKIRIM',
    created_at: '2026-10-28T11:45:00.000Z', // Selasa
  },
  {
    id: 'ord-103',
    order_number: 'ADES-ORD-20261029-003',
    customer_id: 'user-budi',
    customer_name: 'Budi Santoso',
    customer_phone: '085712345678',
    customer_address: 'Jl. Solo Km 8 No. 12, Sleman, D.I. Yogyakarta',
    items: [
      {
        product_id: 'prod-sep-sek-01',
        name: 'Ades Back-to-School All Black Sepatu Sekolah Standar',
        category: 'sepatu_sekolah',
        size: 40,
        color: 'Hitam Polos',
        price: 165000,
        quantity: 1,
        subtotal: 165000,
        image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 165000,
    shipping_courier: 'JNE',
    shipping_cost: 16000,
    points_used: 0,
    vip_discount: 0,
    total_amount: 181000,
    payment_method: 'COD',
    payment_status: 'PENDING',
    order_status: 'DIPROSES',
    created_at: '2026-10-29T14:20:00.000Z', // Rabu
  },
  {
    id: 'ord-104',
    order_number: 'ADES-ORD-20261031-004',
    customer_id: 'user-alya',
    customer_name: 'Alya Alifia',
    customer_phone: '081298765432',
    customer_address: 'Apartemen Mataram City Tower A Lt. 8, Yogyakarta',
    items: [
      {
        product_id: 'prod-bku-01',
        name: 'Paket Back-to-School: Buku Tulis Kiky 58 Lembar (1 Pak Isi 10 Buku)',
        category: 'buku_alat_tulis',
        size: 'Standard',
        color: 'Motif Campur Sekolah',
        price: 48000,
        quantity: 2,
        subtotal: 96000,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 96000,
    shipping_courier: 'Ninja Xpress',
    shipping_cost: 13000,
    points_used: 10000,
    vip_discount: 9600,
    total_amount: 89400,
    payment_method: 'QRIS',
    payment_status: 'PENDING',
    order_status: 'MENUNGGU_PEMBAYARAN',
    created_at: '2026-10-31T16:10:00.000Z', // Jumat
  },
];

export const initialBanners: BannerAd[] = [
  {
    id: 'banner-ramadhan',
    title: 'Spesial Ramadhan: Diskon 20% Sepatu & Tas Baru!',
    tagline: 'Diskon 20% Berkah Lebaran',
    badge: '🌙 SPESIAL RAMADHAN 1447 H',
    description:
      'Sambut bulan suci & silaturahmi dengan gaya maksimal! Koleksi Sepatu Pria & Wanita Elegan, Sandal Terawih Empuk, dan Tas Mudik Terbaru.',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    target_category: 'sepatu_pria',
    cta_text: 'Belanja Koleksi Ramadhan →',
    promo_code: 'RAMADHAN20',
    discount_highlight: 'DISKON 20%',
    bg_gradient: 'from-emerald-950 via-teal-900 to-slate-950',
    is_active: true,
    order: 1,
    created_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'banner-video-showcase',
    title: 'Video Review: Sneakers Sport Sol Empuk Anti Selip',
    tagline: 'Spill Langsung dari Toko Cikajang',
    badge: '🎥 VIDEO PREVIEW PRODUK',
    description:
      'Lihat detail sol empuk, jahitan kuat, dan kenyamanan melangkah dengan sepatu sneakers sport Ades Store 01. Garansi retur 7 hari!',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-tying-running-shoes-42994-large.mp4',
    target_category: 'sepatu_olahraga',
    cta_text: 'Lihat Sneakers Olahraga →',
    promo_code: 'ADESKILAT',
    discount_highlight: 'SUPER EMPUK',
    bg_gradient: 'from-rose-950 via-red-900 to-slate-950',
    is_active: true,
    order: 2,
    created_at: '2026-03-02T00:00:00.000Z',
  },
  {
    id: 'banner-back-to-school',
    title: 'Back to School Hemat s/d 30%: Sepatu, Tas & Buku!',
    tagline: 'Tahun Ajaran Baru Semangat Baru',
    badge: '🎒 PROMO BACK TO SCHOOL',
    description:
      'Paket lengkap sekolah TK, SD, SMP & SMA! Sepatu hitam standar sekolah, tas ransel ergonomis cewek/cowok, dan buku tulis paket hemat.',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    target_category: 'tas_sekolah_tk_sd',
    cta_text: 'Belanja Perlengkapan Sekolah →',
    promo_code: 'SEKOLAH30',
    discount_highlight: 'HEMAT 30%',
    bg_gradient: 'from-blue-950 via-indigo-900 to-slate-950',
    is_active: true,
    order: 3,
    created_at: '2026-03-03T00:00:00.000Z',
  },
];

function getInitialDatabase(): DatabaseSchema {
  return {
    users: initialUsers,
    products: initialProducts,
    orders: initialOrders,
    banners: initialBanners,
    meta: {
      last_order_counter: 4,
      last_order_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    },
  };
}

let inMemoryDb: DatabaseSchema | null = null;
let isWriting = false;

export function getDb(): DatabaseSchema {
  if (inMemoryDb) {
    if (!inMemoryDb.banners || inMemoryDb.banners.length === 0) {
      inMemoryDb.banners = [...initialBanners];
    }
    return inMemoryDb;
  }

  // 1. Try reading from writable DB_FILE (e.g. /tmp in Vercel or local data dir)
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
      if (!inMemoryDb!.banners || inMemoryDb!.banners.length === 0) {
        inMemoryDb!.banners = [...initialBanners];
      }
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn('[DB] Failed reading DB_FILE:', (err as Error).message);
  }

  // 2. Try reading from project seed file if available
  try {
    const seedFile = path.join(process.cwd(), 'data', 'ades_database.json');
    if (fs.existsSync(seedFile)) {
      const content = fs.readFileSync(seedFile, 'utf-8');
      inMemoryDb = JSON.parse(content);
      if (!inMemoryDb!.banners || inMemoryDb!.banners.length === 0) {
        inMemoryDb!.banners = [...initialBanners];
      }
      try {
        if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
        fs.writeFileSync(DB_FILE, content, 'utf-8');
      } catch {}
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn('[DB] Failed reading project seed file:', (err as Error).message);
  }

  // 3. Fallback to initial fashion database in memory
  const initial = getInitialDatabase();
  inMemoryDb = initial;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Operating in-memory (disk write bypassed):', (err as Error).message);
  }
  return inMemoryDb;
}

function saveDbAtomically(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_TMP_FILE, jsonStr, 'utf-8');
    fs.renameSync(DB_TMP_FILE, DB_FILE);
  } catch (err) {
    console.warn('[DB] Atomic save to disk skipped, updated in-memory:', (err as Error).message);
  }
}

export async function runInTransaction<T>(
  callback: (db: DatabaseSchema) => Promise<T> | T
): Promise<T> {
  while (isWriting) {
    await new Promise((r) => setTimeout(r, 10));
  }

  isWriting = true;
  const currentDb = getDb();
  const workingCopy: DatabaseSchema = JSON.parse(JSON.stringify(currentDb));

  try {
    const result = await callback(workingCopy);
    saveDbAtomically(workingCopy);
    return result;
  } catch (err) {
    console.warn('[TRANSACTION ROLLBACK]:', (err as Error).message);
    throw err;
  } finally {
    isWriting = false;
  }
}

export function generateOrderNumber(db: DatabaseSchema): string {
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  if (db.meta.last_order_date !== todayStr) {
    db.meta.last_order_date = todayStr;
    db.meta.last_order_counter = 1;
  } else {
    db.meta.last_order_counter += 1;
  }
  const padded = String(db.meta.last_order_counter).padStart(4, '0');
  return `ADES-ORD-${todayStr}-${padded}`;
}
