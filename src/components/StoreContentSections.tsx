'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  Award,
  Heart,
  HelpCircle,
} from 'lucide-react';

interface StoreContentSectionsProps {
  onOpenLive: () => void;
  onOpenVipModal: () => void;
}

export default function StoreContentSections({
  onOpenLive,
  onOpenVipModal,
}: StoreContentSectionsProps) {
  const [activeGuideTab, setActiveGuideTab] = useState<'size_chart' | 'care_tips'>('size_chart');
  const [isStoreLive, setIsStoreLive] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ades_store_live_active');
      if (saved !== null) {
        setIsStoreLive(saved === 'true');
      }
    } catch {}

    fetch('/api/live')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.is_active === 'boolean') {
          setIsStoreLive(d.is_active);
        }
      })
      .catch(() => {});

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ades_store_live_active');
        if (saved !== null) {
          setIsStoreLive(saved === 'true');
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Customer Reviews from Cikajang & Garut
  const REVIEWS = [
    {
      id: 1,
      name: 'Teh Siti Rahmawati',
      location: 'Cikajang, Garut',
      product: 'Ades Sneaker Urban Pro Neo',
      rating: 5,
      date: '2 hari yang lalu',
      comment:
        'Masya Allah, kurir kilat Ades beneran cepat banget! Pesan jam 1 siang, jam 2 lewat sedikit kurir toko udah sampai depan rumah di Cikajang. Sepatunya enteng & empuk banget buat jalan.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
      badge: 'Verifikasi Kurir Kilat Toko',
    },
    {
      id: 2,
      name: 'Kang Asep Saepuloh',
      location: 'Garut Kota',
      product: 'Sepatu Boots Gunung Papandayan Pro',
      rating: 5,
      date: '3 hari yang lalu',
      comment:
        'Sol karetnya tebal dan cengkeramannya mantap sekali. Kemarin dipakai naik Gunung Papandayan nyaman, gak bikin lecet kaki. Garansi retur sizenya juga bikin belanja jadi tanpa ragu!',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=200&auto=format&fit=crop&q=80',
      badge: 'Pembeli Terverifikasi',
    },
    {
      id: 3,
      name: 'Ibu Rina Marlina',
      location: 'Bayongbong, Garut',
      product: 'Tas Ransel Sekolah TK & SD Princess',
      rating: 5,
      date: '5 hari yang lalu',
      comment:
        'Anak saya seneng banget tas barunya! Jahitannya rapi, resletingnya halus gak macet, muat banyak buku pelajaran. Terus dapet potongan poin koin game 10.000 lumayan hemat Rp 1.000!',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80',
      badge: 'Diskon Poin Game',
    },
    {
      id: 4,
      name: 'Dadan Hernawan',
      location: 'Cisurupan, Garut',
      product: 'Sandal Slide Slip-On Cloud Comfort',
      rating: 5,
      date: '1 minggu yang lalu',
      comment:
        'Ambil langsung di toko offline Ades Cikajang, pelayanannya ramah banget. Busa sandalnya bener-bener kayak injek kasur, empuk pol. Recommended toko sepatu di Garut!',
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&auto=format&fit=crop&q=80',
      badge: 'Ambil di Toko Offline',
    },
  ];

  // Size chart guide
  const SIZE_CHART = [
    { size: 36, lengthCm: '22.5 - 23.0 cm', recommendation: 'Kaki kecil / Remaja / Wanita' },
    { size: 37, lengthCm: '23.0 - 23.5 cm', recommendation: 'Standar Wanita S' },
    { size: 38, lengthCm: '23.5 - 24.0 cm', recommendation: 'Standar Wanita M' },
    { size: 39, lengthCm: '24.0 - 24.5 cm', recommendation: 'Wanita L / Pria S' },
    { size: 40, lengthCm: '24.5 - 25.0 cm', recommendation: 'Standar Pria M / Wanita XL' },
    { size: 41, lengthCm: '25.0 - 25.5 cm', recommendation: 'Standar Pria L' },
    { size: 42, lengthCm: '25.5 - 26.0 cm', recommendation: 'Standar Pria XL' },
    { size: 43, lengthCm: '26.0 - 26.5 cm', recommendation: 'Standar Pria XXL' },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* ============================================================== */}
      {/* 1. BANNER PROMO LIVE STREAMING ADES STORE 01                   */}
      {/* ============================================================== */}
      <div
        className={`relative rounded-3xl p-4 sm:p-5 text-white shadow-xl overflow-hidden border-2 transition-all ${
          isStoreLive
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-800 border-red-400'
            : 'bg-gradient-to-r from-slate-900 via-zinc-900 to-black border-red-500/60'
        }`}
      >
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-white/80 shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
                  alt="Alya Host"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isStoreLive ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'
                }`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {isStoreLive ? (
                  <>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                      <span>SEDANG LIVE</span>
                    </div>
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-red-600" />
                      <span>418 Menonton</span>
                    </span>
                  </>
                ) : (
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-wider border border-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span>SIARAN OFFLINE</span>
                  </div>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black leading-tight">
                {isStoreLive
                  ? '🔴 Ades Live Shopping: Spill Ukuran & Review Sepatu Langsung!'
                  : '⚪ Admin Sedang Tidak Melakukan Siaran Langsung'}
              </h3>
              <p className="text-xs text-rose-100 max-w-xl">
                {isStoreLive
                  ? 'Tonton host Alya spill detail sepatu, sandal empuk & tas sekolah dari store fisik Cikajang. Dapatkan Harga Khusus Live + Garansi Retur Size 7 Hari!'
                  : 'Saat ini pengelola toko Ades Store 01 sedang tidak melakukan siaran langsung. Klik tombol untuk info siaran atau belanja langsung di etalase produk!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isStoreLive) {
                alert('Admin sedang tidak melakukan siaran langsung.');
                return;
              }
              onOpenLive();
            }}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 self-start md:self-center ${
              isStoreLive
                ? 'bg-white hover:bg-red-50 text-red-600 shadow-black/20'
                : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white shadow-black/30'
            }`}
          >
            <Radio className={`w-4 h-4 ${isStoreLive ? 'text-red-600 animate-pulse' : 'text-zinc-400'}`} />
            <span>{isStoreLive ? 'Gabung Live Room →' : '⚪ Admin Sedang Tidak Melakukan Siaran Langsung'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ULASAN & TESTIMONI ASLI WARGA CIKAJANG & GARUT              */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-red-500 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                Ulasan &amp; Testimoni Nyata Pelanggan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kepuasan Pelanggan Ades Store 01 di Cikajang, Bayongbong, Cisurupan &amp; Garut
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-mono font-black text-xs text-slate-800">
              4.9 / 5.0 (980+ Ulasan)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-red-50/40 border border-slate-200 transition-colors space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        📍 {rev.location} &bull; {rev.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                    {rev.badge}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-500 ml-1">
                    Beli: {rev.product}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                  <img src={rev.image} alt={rev.product} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Transaksi Berhasil &amp; Terverifikasi</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. PANDUAN UKURAN KAKI (SIZE CHART) & TIPS MERAWAT SEPATU/TAS  */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-red-500 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                Edukasi Belanja &bull; Size Chart &amp; Tips Perawatan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Belanja pasti pas, tanpa ragu, awet bertahun-tahun
            </p>
          </div>

          {/* Guide Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setActiveGuideTab('size_chart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGuideTab === 'size_chart'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📏 Panduan Ukuran Kaki
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('care_tips')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGuideTab === 'care_tips'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧼 Tips Perawatan Sepatu &amp; Tas
            </button>
          </div>
        </div>

        {/* Tab 1: Size Chart Table */}
        {activeGuideTab === 'size_chart' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-red-200 text-xs text-slate-700 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900">
                  Cara Mudah Mengukur Panjang Kaki:
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Letakkan telapak kaki di atas selembar kertas putih, tandai ujung tumit dan ujung jempol kaki terjauh menggunakan pensil, lalu ukur jaraknya menggunakan penggaris. Jika kaki Kakak lebar, sarankan naik 1 ukuran ya!
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="py-2.5 px-3 rounded-l-xl font-black">Ukuran (Size)</th>
                    <th className="py-2.5 px-3 font-black">Panjang Telapak Kaki (cm)</th>
                    <th className="py-2.5 px-3 rounded-r-xl font-black">Rekomendasi Pengguna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SIZE_CHART.map((sc, i) => (
                    <tr
                      key={sc.size}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                    >
                      <td className="py-2 px-3 font-mono font-black text-red-600">
                        Size {sc.size}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        {sc.lengthCm}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-medium">
                        {sc.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Tips Perawatan Sepatu & Tas */}
        {activeGuideTab === 'care_tips' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xl">👟</span>
              <h4 className="font-black text-slate-900 text-xs">
                Perawatan Sneakers &amp; Sepatu Olahraga
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Jangan mencuci sepatu di mesin cuci. Gunakan sikat berbulu lembut dengan sabun cair lembut. Keringkan di tempat teduh berangin tanpa terkena sinar matahari langsung agar lem tidak cepat getas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xl">🎒</span>
              <h4 className="font-black text-slate-900 text-xs">
                Perawatan Tas Ransel Sekolah &amp; Gunung
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Bersihkan bagian resleting berkala dengan sikat gigi kering agar tidak tersumbat debu. Untuk noda luar, cukup usap dengan kain mikrofiber lembap tanpa direndam deterjen keras.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xl">👡</span>
              <h4 className="font-black text-slate-900 text-xs">
                Perawatan Sandal Slide &amp; Bahan EVA
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Bahan slide phylon empuk sangat mudah dibersihkan: cukup bilas dengan air mengalir dan lap kering. Hindari meninggalkan sandal di dalam mobil panas agar ukuran tidak menyusut.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
