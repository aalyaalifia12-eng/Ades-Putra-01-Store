import { NextResponse } from 'next/server';
import { getDb, runInTransaction, initialBanners } from '@/lib/db';
import { BannerAd } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // all=true for admin, false for customer (active only)

    const db = getDb();
    if (!db.banners || db.banners.length === 0) {
      db.banners = [...initialBanners];
    }

    let list = [...db.banners];
    if (!all) {
      list = list.filter((b) => b.is_active);
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({
      success: true,
      banners: list,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      tagline,
      badge,
      description,
      media_type,
      media_url,
      target_category,
      cta_text,
      promo_code,
      discount_highlight,
      bg_gradient,
      is_active,
    } = body;

    if (!title || !media_url) {
      return NextResponse.json(
        { success: false, error: 'Judul iklan dan URL media (foto/video) wajib diisi.' },
        { status: 400 }
      );
    }

    const createdBanner = await runInTransaction((db) => {
      if (!db.banners) db.banners = [];

      const newBanner: BannerAd = {
        id: `banner-${Date.now()}`,
        title,
        tagline: tagline || '',
        badge: badge || 'PROMO ADES STORE',
        description: description || '',
        media_type: media_type === 'video' ? 'video' : 'image',
        media_url,
        target_category: target_category || 'sepatu_pria',
        cta_text: cta_text || 'Lihat Promo →',
        promo_code: promo_code || '',
        discount_highlight: discount_highlight || 'SPESIAL',
        bg_gradient: bg_gradient || 'from-red-950 via-rose-900 to-slate-950',
        is_active: is_active !== false,
        order: db.banners.length + 1,
        created_at: new Date().toISOString(),
      };

      db.banners.push(newBanner);
      return newBanner;
    });

    return NextResponse.json({
      success: true,
      banner: createdBanner,
      message: 'Iklan beranda berhasil ditambahkan!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
