import fs from 'fs';
import path from 'path';
import { Product, User, Order } from '@/types';

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  meta: {
    last_order_counter: number;
    last_order_date: string;
  };
}

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production');
const DB_DIR = IS_SERVERLESS ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'ades_database.json');
const DB_TMP_FILE = path.join(DB_DIR, 'ades_database.tmp.json');

// Initial seed products for Ades Store 01
const initialProducts: Product[] = [
  // --- SEPATU ---
  {
    id: 'prod-sep-01',
    category: 'sepatu',
    name: 'Ades Aerocushion White Sneakers Kasual',
    sku: 'ADES-SNK-01',
    barcode: '8991001001011',
    original_price: 389000,
    promo_price: 279000,
    cost_price: 160000,
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    colors: ['Putih Bersih', 'Putih Aksen Sage', 'Putih Aksen Navy'],
    stock: 45,
    min_stock_alert: 8,
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    description: 'Sneakers putih klasik dengan sol insole memory foam ultra-empuk. Anti-pegal untuk kuliah, jalan santai, maupun ngantor kasual seharian.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-sep-02',
    category: 'sepatu',
    name: 'Ades Chunky Retro Platform Sneaker Black-Pink',
    sku: 'ADES-SNK-02',
    barcode: '8991001001028',
    original_price: 429000,
    promo_price: 319000,
    cost_price: 185000,
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ['Hitam Pink Pastel', 'All Black', 'Cream Beige'],
    stock: 28,
    min_stock_alert: 6,
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    description: 'Sepatu platform retro gaya Korea dengan sol tebal 4.5cm yang menambah tinggi seketika dan tetap sangat ringan digunakan.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-sep-03',
    category: 'sepatu',
    name: 'Ades Urban Runner Cloud-Walk Breathable',
    sku: 'ADES-SNK-03',
    barcode: '8991001001035',
    original_price: 359000,
    promo_price: 269000,
    cost_price: 150000,
    sizes: [38, 39, 40, 41, 42, 43],
    colors: ['Abu-Abu Mist', 'Hitam Karbon', 'Navy Blue'],
    stock: 35,
    min_stock_alert: 8,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Sepatu lari dan aktivitas outdoor dengan sirkulasi udara jaring breathable. Outsole karet cengkeram anti-selip.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-sep-04',
    category: 'sepatu',
    name: 'Ades Classic Penny Loafer Leather Formal Tan',
    sku: 'ADES-LFR-01',
    barcode: '8991001001042',
    original_price: 399000,
    promo_price: 299000,
    cost_price: 170000,
    sizes: [39, 40, 41, 42, 43],
    colors: ['Tan Cokelat', 'Hitam Mengkilap'],
    stock: 18,
    min_stock_alert: 5,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    description: 'Loafer kulit sintetis premium dengan siluet rapi elegan. Cocok untuk acara formal, semi-formal, dan pertemuan bisnis.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-sep-05',
    category: 'sepatu',
    name: 'Ades Grace Pointy Block Heels 5cm Nude Velvet',
    sku: 'ADES-HLS-01',
    barcode: '8991001001059',
    original_price: 349000,
    promo_price: 249000,
    cost_price: 135000,
    sizes: [36, 37, 38, 39, 40],
    colors: ['Nude Krem', 'Hitam Midnight', 'Blush Pink'],
    stock: 4, // Low stock alert!
    min_stock_alert: 6,
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    description: 'Sepatu hak tahu 5cm yang stabil dan tidak goyang. Ujung pointy manis membuat ilusi kaki lebih ramping dan jenjang.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },

  // --- SANDAL ---
  {
    id: 'prod-san-01',
    category: 'sandal',
    name: 'Ades CloudSlide Puffy Double Strap Sandal',
    sku: 'ADES-SND-01',
    barcode: '8992002002011',
    original_price: 189000,
    promo_price: 129000,
    cost_price: 65000,
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    colors: ['Putih Lilac', 'Hitam Doff', 'Krem Matcha', 'Mocha'],
    stock: 60,
    min_stock_alert: 10,
    image_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80',
    description: 'Sandal slide empuk dengan double buckle adjustable. Tahan air, mudah dicuci, dan super nyaman dipakai jalan-jalan santai.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-san-02',
    category: 'sandal',
    name: 'Ades Terra Trekker Sandal Gunung Outdoor Pro',
    sku: 'ADES-SND-02',
    barcode: '8992002002028',
    original_price: 239000,
    promo_price: 179000,
    cost_price: 95000,
    sizes: [38, 39, 40, 41, 42, 43],
    colors: ['Hitam Corak Army', 'All Black', 'Navy Orange'],
    stock: 22,
    min_stock_alert: 6,
    image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    description: 'Sandal tali gunung dengan webbing polyester kuat dan sol tapak bergerigi traksi tinggi. Siap untuk traveling dan kegiatan aktif.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-san-03',
    category: 'sandal',
    name: 'Ades Minimalist Bohemian Strap Flat Sandal',
    sku: 'ADES-SND-03',
    barcode: '8992002002035',
    original_price: 199000,
    promo_price: 139000,
    cost_price: 70000,
    sizes: [36, 37, 38, 39, 40],
    colors: ['Caramel Cokelat', 'Putih Gading', 'Hitam'],
    stock: 0, // Habis / Out of stock
    min_stock_alert: 5,
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    description: 'Sandal flat tali silang gaya bohemian aesthetic. Ringan dan cocok dipadukan dengan gaun pantai atau celana kulot.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },

  // --- TAS ---
  {
    id: 'prod-tas-01',
    category: 'tas',
    name: 'Ades Milano Quilted Crossbody Chain Sling Bag',
    sku: 'ADES-BAG-01',
    barcode: '8993003003011',
    original_price: 329000,
    promo_price: 229000,
    cost_price: 110000,
    sizes: [0], // One Size
    colors: ['Hitam Emas', 'Krem Nude', 'Sage Green'],
    stock: 25,
    min_stock_alert: 5,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    description: 'Tas selempang quilted bertekstur mewah dengan tali rantai emas titanium. Muat handphone ukuran besar, dompet lipat, dan pouch makeup.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-tas-02',
    category: 'tas',
    name: 'Ades Daily Canvas Tote Bag Laptop Friendly (14 Inch)',
    sku: 'ADES-BAG-02',
    barcode: '8993003003028',
    original_price: 219000,
    promo_price: 149000,
    cost_price: 75000,
    sizes: [0], // One Size
    colors: ['Off-White Kanvas', 'Hitam Tebal', 'Khaki'],
    stock: 38,
    min_stock_alert: 8,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    description: 'Tote bag kanvas drill tebal dengan kompartemen busa khusus laptop 14 inci serta resleting utama anti-copet.',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-tas-03',
    category: 'tas',
    name: 'Ades Urban Sleek Waterproof Commuter Backpack',
    sku: 'ADES-BAG-03',
    barcode: '8993003003035',
    original_price: 419000,
    promo_price: 299000,
    cost_price: 160000,
    sizes: [0], // One Size
    colors: ['Matte Black', 'Dark Grey Charcoal'],
    stock: 14,
    min_stock_alert: 4,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Ransel tahan air dengan slot laptop hingga 15.6 inci, port USB eksternal, dan bantalan punggung ergonomis anti-keringat.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-tas-04',
    category: 'tas',
    name: 'Ades Croco Baguette Shoulder Bag 90s Chic',
    sku: 'ADES-BAG-04',
    barcode: '8993003003042',
    original_price: 279000,
    promo_price: 189000,
    cost_price: 90000,
    sizes: [0], // One Size
    colors: ['Espresso Cokelat', 'Hitam Glossy', 'Burgundy Wine'],
    stock: 19,
    min_stock_alert: 5,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80',
    description: 'Shoulder bag motif emboss croco ala tren 90-an. Nyaman disandang di bahu dan langsung elevate gaya OOTD kasual Anda.',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

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
        product_id: 'prod-sep-01',
        name: 'Ades Aerocushion White Sneakers Kasual',
        category: 'sepatu',
        size: 42,
        color: 'Putih Bersih',
        price: 279000,
        quantity: 1,
        subtotal: 279000,
        image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 279000,
    shipping_courier: 'J&T Express',
    shipping_cost: 15000,
    points_used: 0,
    vip_discount: 0,
    total_amount: 294000,
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
        product_id: 'prod-tas-01',
        name: 'Ades Milano Quilted Crossbody Chain Sling Bag',
        category: 'tas',
        size: 'One Size',
        color: 'Hitam Emas',
        price: 229000,
        quantity: 1,
        subtotal: 229000,
        image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      },
      {
        product_id: 'prod-san-01',
        name: 'Ades CloudSlide Puffy Double Strap Sandal',
        category: 'sandal',
        size: 38,
        color: 'Putih Lilac',
        price: 129000,
        quantity: 1,
        subtotal: 129000,
        image_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 358000,
    shipping_courier: 'GOTO (Instant)',
    shipping_cost: 25000,
    points_used: 20000, // Used 20k points!
    vip_discount: 35800, // 10% VIP discount
    total_amount: 327200,
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
        product_id: 'prod-sep-02',
        name: 'Ades Chunky Retro Platform Sneaker Black-Pink',
        category: 'sepatu',
        size: 39,
        color: 'Cream Beige',
        price: 319000,
        quantity: 1,
        subtotal: 319000,
        image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 319000,
    shipping_courier: 'JNE',
    shipping_cost: 16000,
    points_used: 0,
    vip_discount: 0,
    total_amount: 335000,
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
        product_id: 'prod-tas-02',
        name: 'Ades Daily Canvas Tote Bag Laptop Friendly (14 Inch)',
        category: 'tas',
        size: 'One Size',
        color: 'Off-White Kanvas',
        price: 149000,
        quantity: 1,
        subtotal: 149000,
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 149000,
    shipping_courier: 'Ninja Xpress',
    shipping_cost: 13000,
    points_used: 10000,
    vip_discount: 14900,
    total_amount: 137100,
    payment_method: 'QRIS',
    payment_status: 'PAID',
    order_status: 'MENUNGGU_PEMBAYARAN',
    created_at: '2026-10-31T16:10:00.000Z', // Jumat
  },
];

function getInitialDatabase(): DatabaseSchema {
  return {
    users: initialUsers,
    products: initialProducts,
    orders: initialOrders,
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
    return inMemoryDb;
  }

  // 1. Try reading from writable DB_FILE (e.g. /tmp in Vercel or local data dir)
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
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
      // Try writing to DB_FILE (/tmp) for persistence across invocations in same container
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
