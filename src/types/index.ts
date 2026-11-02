export type ProductCategory = 'sepatu' | 'sandal' | 'tas';

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  sku: string;
  barcode: string;
  original_price: number;
  promo_price?: number;
  cost_price: number;
  sizes: number[]; // e.g. [36, 37, 38, 39, 40, 41, 42, 43]
  colors: string[];
  stock: number;
  min_stock_alert: number;
  image_url: string;
  description: string;
  is_featured?: boolean;
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
  vipJoinedAt?: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  category: ProductCategory;
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
  | 'BATAL';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
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
  created_at: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number | string;
  selectedColor: string;
  qty: number;
}
