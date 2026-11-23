import { NextResponse } from 'next/server';

// In-memory global state for Live streaming status
let globalLiveState = {
  is_active: true,
  title: 'Ades Live Shopping Spill Sepatu & Sandal Cikajang Garut',
  host: 'Alya Alifia',
  updated_at: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({
    success: true,
    ...globalLiveState,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { active, title, host } = body;

    globalLiveState = {
      is_active: typeof active === 'boolean' ? active : !globalLiveState.is_active,
      title: title || globalLiveState.title,
      host: host || globalLiveState.host,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      ...globalLiveState,
      message: globalLiveState.is_active
        ? 'Siaran langsung toko berhasil dimulai.'
        : 'Siaran langsung toko telah dimatikan.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengubah status live.' },
      { status: 500 }
    );
  }
}
