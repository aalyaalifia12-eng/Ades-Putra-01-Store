import { NextResponse } from 'next/server';

// In-memory global state for Live streaming status and Admin's real-time camera feed
let globalLiveState: {
  is_active: boolean;
  title: string;
  host: string;
  latest_frame: string | null;
  updated_at: string;
} = {
  is_active: false, // Default to false / offline until Admin starts live
  title: 'Siaran Langsung Toko Ades Store 01 Cikajang',
  host: 'Admin Toko (Alya Alifia)',
  latest_frame: null,
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
    const { active, title, host, frame } = body;

    globalLiveState = {
      is_active: typeof active === 'boolean' ? active : globalLiveState.is_active,
      title: title || globalLiveState.title,
      host: host || globalLiveState.host,
      latest_frame: frame !== undefined ? frame : globalLiveState.latest_frame,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      ...globalLiveState,
      message: globalLiveState.is_active
        ? 'Siaran langsung toko aktif.'
        : 'Admin sedang tidak melakukan siaran langsung.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengubah status live.' },
      { status: 500 }
    );
  }
}
