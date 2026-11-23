import { NextResponse } from 'next/server';
import { getDb, runInTransaction } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedBanner = await runInTransaction((db) => {
      if (!db.banners) db.banners = [];
      const index = db.banners.findIndex((b) => b.id === id);
      if (index === -1) {
        throw new Error('Iklan tidak ditemukan.');
      }

      db.banners[index] = {
        ...db.banners[index],
        ...body,
        id, // ensure id doesn't change
      };

      return db.banners[index];
    });

    return NextResponse.json({
      success: true,
      banner: updatedBanner,
      message: 'Iklan beranda berhasil diperbarui!',
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
      if (!db.banners) db.banners = [];
      db.banners = db.banners.filter((b) => b.id !== id);
    });

    return NextResponse.json({
      success: true,
      message: 'Iklan berhasil dihapus.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
