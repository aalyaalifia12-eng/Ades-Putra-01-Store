import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await runInTransaction((db) => {
      const product = db.products.find((p) => p.id === id);
      if (!product) {
        throw new Error('Produk tidak ditemukan.');
      }

      if (body.name) product.name = body.name;
      if (body.category) product.category = body.category;
      if (body.original_price !== undefined) product.original_price = Number(body.original_price);
      if (body.promo_price !== undefined) {
        product.promo_price = body.promo_price ? Number(body.promo_price) : undefined;
      }
      if (body.cost_price !== undefined) product.cost_price = Number(body.cost_price);
      if (body.stock !== undefined) product.stock = Number(body.stock);
      if (body.min_stock_alert !== undefined) product.min_stock_alert = Number(body.min_stock_alert);
      if (body.sizes) product.sizes = body.sizes;
      if (body.colors) product.colors = body.colors;
      if (body.image_url) product.image_url = body.image_url;
      if (body.description) product.description = body.description;
      product.updated_at = new Date().toISOString();

      return product;
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'Produk berhasil diperbarui.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await runInTransaction((db) => {
      const index = db.products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Produk tidak ditemukan.');
      }
      db.products.splice(index, 1);
    });

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus dari katalog.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
