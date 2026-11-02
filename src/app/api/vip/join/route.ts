import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    const result = await runInTransaction((db) => {
      // Find customer or fallback to active customer
      const user = db.users.find((u) => u.id === userId || u.role === 'CUSTOMER');
      if (!user) {
        throw new Error('User tidak ditemukan.');
      }

      const wasVip = user.isVip;
      user.isVip = true;
      user.vipJoinedAt = new Date().toISOString();
      user.memberPoints = (user.memberPoints || 0) + 50000; // Direct 50,000 Points Cashback!

      return {
        user,
        cashbackPoints: 50000,
        wasVip,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Selamat! Anda resmi menjadi VIP Member Ades Store 01. Bonus 50.000 Koin Member telah masuk ke saldo Anda!',
      user: result.user,
      cashbackPoints: result.cashbackPoints,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
