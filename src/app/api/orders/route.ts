import { NextResponse } from 'next/server';
import { getDb, runInTransaction, generateOrderNumber } from '@/lib/db';
import { Order, OrderItem } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');

    const db = getDb();
    let orders = [...db.orders];

    if (customerId) {
      orders = orders.filter((o) => o.customer_id === customerId);
    }

    if (status && status !== 'ALL') {
      orders = orders.filter((o) => o.order_status === status);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      shippingCourier,
      shippingCost,
      usePoints,
      paymentMethod,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pilih minimal 1 produk untuk checkout.' },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, error: 'Mohon lengkapi nama penerima, nomor HP, dan alamat pengiriman.' },
        { status: 400 }
      );
    }

    const createdOrder = await runInTransaction((db) => {
      // 1. Find customer or default to guest/alya
      const user = db.users.find((u) => u.id === customerId) || db.users[1]; // fallback Alya
      const isVip = user ? user.isVip : false;

      // 2. Validate stock & compute subtotal
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const product = db.products.find((p) => p.id === item.product_id);
        if (!product) {
          throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stok produk "${product.name}" tersisa ${product.stock}, tidak mencukupi.`);
        }

        const price = product.promo_price || product.original_price;
        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;

        // Deduct stock
        product.stock -= item.quantity;

        orderItems.push({
          product_id: product.id,
          name: product.name,
          category: product.category,
          size: item.size || 'Standard',
          color: item.color || product.colors[0] || 'Default',
          price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
          image_url: product.image_url,
        });
      }

      // 3. VIP Discount (10% on products for VIP members)
      const vipDiscount = isVip ? Math.round(subtotal * 0.1) : 0;

      // 4. Member Points Discount toggle
      let pointsUsed = 0;
      if (usePoints && user && user.memberPoints > 0) {
        const maxDeductible = subtotal - vipDiscount;
        pointsUsed = Math.min(user.memberPoints, maxDeductible);
        user.memberPoints -= pointsUsed;
      }

      // 5. Total
      const shipCost = Number(shippingCost) || 15000;
      const totalAmount = Math.max(0, subtotal - vipDiscount - pointsUsed + shipCost);

      const orderNumber = generateOrderNumber(db);
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        order_number: orderNumber,
        customer_id: user ? user.id : 'guest',
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        items: orderItems,
        subtotal,
        shipping_courier: shippingCourier || 'J&T Express',
        shipping_cost: shipCost,
        points_used: pointsUsed,
        vip_discount: vipDiscount,
        total_amount: totalAmount,
        payment_method: paymentMethod || 'QRIS',
        payment_status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        order_status: paymentMethod === 'COD' ? 'DIPROSES' : 'MENUNGGU_PEMBAYARAN',
        created_at: new Date().toISOString(),
      };

      db.orders.unshift(newOrder);

      return {
        order: newOrder,
        remainingPoints: user ? user.memberPoints : 0,
      };
    });

    return NextResponse.json({
      success: true,
      order: createdOrder.order,
      remainingPoints: createdOrder.remainingPoints,
      message: 'Pesanan berhasil dibuat!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
