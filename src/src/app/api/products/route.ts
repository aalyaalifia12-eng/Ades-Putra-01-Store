import { NextResponse } from 'next/server';
import { getDb, runInTransaction } from '@/lib/db';
import { Product } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'all' | 'sepatu' | 'sandal' | 'tas'
    const search = searchParams.get('search')?.toLowerCase().trim();
    const size = searchParams.get('size'); // e.g. 39

    const db = getDb();
    let products = [...db.products];

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (size) {
      const numSize = parseInt(size, 10);
      products = products.filter((p) => p.sizes && (p.sizes.includes(numSize) || p.sizes.includes(size)));
    }

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category,
      name,
      original_price,
      promo_price,
      cost_price,
      sizes,
      colors,
      stock,
      min_stock_alert,
      image_url,
      description,
    } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Nama produk dan kategori wajib diisi.' },
        { status: 400 }
      );
    }

    const newProduct = await runInTransaction((db) => {
      const id = `prod-${Date.now()}`;
      const sku = `ADES-${category.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
      const barcode = `899${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const product: Product = {
        id,
        category,
        name,
        sku,
        barcode,
        original_price: Number(original_price) || 0,
        promo_price: promo_price ? Number(promo_price) : undefined,
        cost_price: Number(cost_price) || 0,
        sizes: Array.isArray(sizes) ? sizes : [38, 39, 40, 41, 42],
        colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Hitam', 'Putih'],
        stock: Number(stock) || 0,
        min_stock_alert: Number(min_stock_alert) || 5,
        image_url:
          image_url ||
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
        description: description || 'Produk alas kaki & fashion premium Ades Store 01.',
        created_at: new Date().toISOString(),
      };

      db.products.unshift(product);
      return product;
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Katalog produk berhasil ditambahkan!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
