import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const orders = db.orders;
    const products = db.products;

    // Total Omzet from completed or active orders
    const validOrders = orders.filter((o) => o.order_status !== 'BATAL');
    const totalOmzet = validOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrdersCount = orders.length;
    const pendingOrdersCount = orders.filter((o) => o.order_status === 'MENUNGGU_PEMBAYARAN' || o.order_status === 'DIPROSES').length;

    // Weekly trend: Senin to Minggu
    const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    // Map JavaScript getDay() (0: Sunday, 1: Monday, ... 6: Saturday) to our index
    // 1 -> 0 (Senin), 2 -> 1, 3 -> 2, 4 -> 3, 5 -> 4, 6 -> 5, 0 -> 6 (Minggu)
    const weeklyData = dayLabels.map((day) => ({
      day,
      omzet: 0,
      count: 0,
    }));

    orders.forEach((o) => {
      if (o.order_status !== 'BATAL') {
        const d = new Date(o.created_at);
        const jsDay = d.getDay(); // 0 is Sunday
        const targetIdx = jsDay === 0 ? 6 : jsDay - 1;
        weeklyData[targetIdx].omzet += o.total_amount;
        weeklyData[targetIdx].count += 1;
      }
    });

    // Courier breakdown
    const courierBreakdown: Record<string, number> = {
      'J&T Express': 0,
      'JNE': 0,
      'GOTO (Instant)': 0,
      'Ninja Xpress': 0,
    };

    orders.forEach((o) => {
      if (courierBreakdown[o.shipping_courier] !== undefined) {
        courierBreakdown[o.shipping_courier] += 1;
      } else {
        courierBreakdown[o.shipping_courier] = 1;
      }
    });

    // Low stock products count
    const lowStockProducts = products.filter((p) => p.stock <= p.min_stock_alert);

    // Bestseller products from items
    const productStats: Record<string, { name: string; category: string; qty: number; revenue: number; image: string }> = {};
    orders.forEach((o) => {
      if (o.order_status !== 'BATAL') {
        o.items.forEach((item) => {
          if (!productStats[item.product_id]) {
            productStats[item.product_id] = {
              name: item.name,
              category: item.category,
              qty: 0,
              revenue: 0,
              image: item.image_url,
            };
          }
          productStats[item.product_id].qty += item.quantity;
          productStats[item.product_id].revenue += item.subtotal;
        });
      }
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      analytics: {
        totalOmzet,
        totalOrdersCount,
        pendingOrdersCount,
        totalProductsCount: products.length,
        lowStockCount: lowStockProducts.length,
        weeklyTrend: weeklyData,
        courierBreakdown,
        topProducts,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
