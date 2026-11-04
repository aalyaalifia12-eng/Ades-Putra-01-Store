import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { order_status, payment_status, tracking_number, notes } = body;

    const updated = await runInTransaction((db) => {
      const order = db.orders.find((o) => o.id === id || o.order_number === id);
      if (!order) {
        throw new Error('Pesanan tidak ditemukan.');
      }

      if (order_status) order.order_status = order_status;
      if (payment_status) order.payment_status = payment_status;
      if (tracking_number !== undefined) order.tracking_number = tracking_number;
      if (notes !== undefined) order.notes = notes;

      return order;
    });

    return NextResponse.json({
      success: true,
      order: updated,
      message: 'Status pesanan berhasil diperbarui.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
