import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, email, phone, password, role } = body;

    const db = getDb();
    const loginId = (identifier || email || phone || '').toLowerCase().trim();
    const cleanDigits = loginId.replace(/[^0-9]/g, '');

    // Administrator Login
    if (role === 'admin' || body.portal === 'admin') {
      const isValidAdminId =
        loginId === 'admin@adesstore01.com' ||
        loginId === 'admin' ||
        loginId === 'ades' ||
        cleanDigits === '082126468980' ||
        cleanDigits === '6282126468980' ||
        cleanDigits === '081234567890';

      const isValidPassword =
        password === 'admin123' ||
        password === '0101' ||
        password === 'ades01' ||
        password === 'admin';

      if (isValidAdminId && isValidPassword) {
        const adminUser = db.users.find((u) => u.role === 'ADMIN');
        return NextResponse.json({
          success: true,
          user: adminUser || {
            id: 'user-admin',
            name: 'Alya Alifia (Owner Ades Store 01)',
            email: 'admin@adesstore01.com',
            phone: '082126468980',
            role: 'ADMIN',
            isVip: true,
            memberPoints: 999999,
          },
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Kredensial Admin tidak cocok. Silakan periksa kembali email/nomor HP dan kata sandi Anda.',
          },
          { status: 401 }
        );
      }
    }

    // Customer / Member Login
    if (!loginId) {
      return NextResponse.json(
        { success: false, error: 'Harap masukkan nomor WhatsApp atau alamat email Anda.' },
        { status: 400 }
      );
    }

    let user = db.users.find(
      (u) =>
        (u.email.toLowerCase() === loginId || u.phone.replace(/[^0-9]/g, '') === loginId.replace(/[^0-9]/g, '')) &&
        u.role === 'CUSTOMER'
    );

    // If user doesn't exist, register new customer account seamlessly
    if (!user) {
      const isEmail = loginId.includes('@');
      const nameGuess = isEmail ? loginId.split('@')[0] : 'Member ' + loginId.slice(-4);
      const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);

      user = {
        id: `cust-${Date.now()}`,
        name: formattedName,
        email: isEmail ? loginId : `${loginId}@member.adesstore.com`,
        phone: isEmail ? '0812' + Math.floor(10000000 + Math.random() * 90000000) : loginId,
        role: 'CUSTOMER',
        isVip: false,
        memberPoints: 0,
        created_at: new Date().toISOString(),
      };
      db.users.push(user);
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Login berhasil.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
