import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const db = getDb();

    if (userId) {
      const user = db.users.find((u) => u.id === userId);
      if (user) {
        return NextResponse.json({ success: true, user });
      }
    }

    // Fallback: return default active customer (Alya Alifia VIP)
    const customer = db.users.find((u) => u.id === 'user-alya') || db.users[1];
    return NextResponse.json({
      success: true,
      user: customer,
      allUsers: db.users,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
