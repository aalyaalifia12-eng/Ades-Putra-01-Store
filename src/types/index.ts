export type ProductCategory =
  | 'all'
  | 'sepatu_pria'
  | 'sepatu_wanita'
  | 'sepatu_olahraga'
  | 'sepatu_bayi'
  | 'sepatu_anak_laki'
  | 'sepatu_anak_perempuan'
  | 'sepatu_sekolah'
  | 'sepatu_gunung'
  | 'tas_sekolah_tk_sd'
  | 'tas_sekolah_smp_sma'
  | 'tas_wanita'
  | 'tas_pria'
  | 'tas_gunung'
  | 'dompet'
  | 'buku_alat_tulis'
  | 'aksesoris'
  | 'sepatu'
  | 'sandal'
  | 'tas'
  | string;

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  sku: string;
  barcode: string;
  original_price: number;
  promo_price?: number;
  cost_price: number;
  sizes: (number | string)[]; // e.g. [36, 37, 38] or ['One Size'] or [18, 19, 20]
  colors: string[];
  stock: number;
  min_stock_alert: number;
  image_url: string;
  description: string;
  is_featured?: boolean;
  rating?: number; // e.g. 4.9
  review_count?: number; // e.g. 128
  sold_count?: number; // e.g. 240
  created_at: string;
  updated_at?: string;
}

export type CourierOption = 'JNE' | 'J&T Express' | 'GOTO (Instant)' | 'Ninja Xpress';

export interface CourierTariff {
  code: CourierOption;
  name: string;
  etd: string;
  cost: number;
  badge?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CUSTOMER';
  isVip: boolean;
  memberPoints: number; // 1 point = Rp 1
  avatar_url?: string;
  address?: string;
  vipJoinedAt?: string;
  created_at: string;
}

export interface OrderItem {
  id?: string;
  product_id: string;
  name: string;
  category?: ProductCategory;
  size?: number | string;
  color?: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url: string;
}

export type OrderStatus =
  | 'MENUNGGU_PEMBAYARAN'
  | 'DIPROSES'
  | 'DIKIRIM'
  | 'SELESAI'
  | 'BATAL'
  | 'RETUR';

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  shipping_address?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_courier: CourierOption;
  shipping_cost: number;
  points_used: number; // Rupiah discount from member coins
  vip_discount: number;
  total_amount: number;
  payment_method: 'COD' | 'QRIS';
  payment_status: 'PENDING' | 'PAID';
  order_status: OrderStatus;
  tracking_number?: string;
  notes?: string;
  discount_amount?: number;
  return_reason?: string;
  is_reviewed?: boolean;
  user_rating?: number;
  user_review?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number | string;
  selectedColor: string;
  qty: number;
}
