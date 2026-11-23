'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Ruler,
  ShoppingBag,
  Crown,
  ChevronDown,
  MessageSquare,
  Truck,
  RotateCcw,
  Gamepad2,
  Radio,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { Product } from '@/types';
import { formatIDR } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  productCard?: Product;
}

interface AdesBotProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onOpenVipModal: () => void;
  onOpenLive?: () => void;
  onOpenGame?: () => void;
}

// Utility to completely strip all asterisks (*) from text
function stripAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

export default function AdesBot({
  products,
  onOpenProduct,
  onOpenVipModal,
  onOpenLive,
  onOpenGame,
}: AdesBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: stripAsterisks(
        'Halo! Saya AdesBot 🤖, Asisten Belanja Pintar Ades Store 01 Cikajang & Garut.\n\n' +
        'Tagline kami: "Langkah Nyaman, Gaya Maksimal Setiap Hari".\n\n' +
        'Ada yang bisa saya bantu hari ini? Kamu bisa konsultasi ukuran kaki (cm), tanya rekomendasi sepatu/sandal/tas, info kurir kilat Cikajang, garansi retur 7 hari, atau cara tukar koin game jadi diskon!'
      ),
      options: [
        '📏 Panduan Ukuran Kaki (cm)',
        '👦 Sandal & Sepatu Anak Laki',
        '👧 Sandal & Sepatu Anak Cewek',
        '⚡ Antar Cepat Cikajang & Garut',
        '🍬 Info Koin Game Candy Crush',
        '👑 Info VIP Member Cashback 10%',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Size calculation based on foot length in cm (adult & kids)
  const calculateSizeFromCm = (cm: number): string => {
    if (cm <= 12.0) return 'Size 18-20 (Sepatu Bayi 0-12 Bulan)';
    if (cm <= 13.5) return 'Size 21-22 (Sepatu Bayi 12-18 Bulan)';
    if (cm <= 15.0) return 'Size 24-25 (Anak 2-3 Tahun)';
    if (cm <= 16.5) return 'Size 26-27 (Anak 3-4 Tahun)';
    if (cm <= 18.0) return 'Size 28-29 (Anak 5-6 Tahun)';
    if (cm <= 19.5) return 'Size 30-31 (Anak 7-8 Tahun)';
    if (cm <= 21.0) return 'Size 32-34 (Anak SD 9-10 Tahun)';
    if (cm <= 22.0) return 'Size 35 (21.5 - 22.0 cm)';
    if (cm <= 22.5) return 'Size 36 (22.5 cm)';
    if (cm <= 23.0) return 'Size 37 (23.0 cm)';
    if (cm <= 23.5) return 'Size 38 (23.5 cm)';
    if (cm <= 24.0) return 'Size 39 (24.0 cm)';
    if (cm <= 24.5) return 'Size 40 (24.5 cm)';
    if (cm <= 25.0) return 'Size 41 (25.0 cm)';
    if (cm <= 25.5) return 'Size 42 (25.5 cm)';
    if (cm <= 26.5) return 'Size 43 (26.0 - 26.5 cm)';
    if (cm <= 27.5) return 'Size 44 (27.0 - 27.5 cm)';
    return 'Size 44+ (Rekomendasi upsize jika punggung kaki lebar/tebal)';
  };

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: stripAsterisks(userText.trim()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Process Bot Response
    setTimeout(() => {
      const lower = userText.toLowerCase().trim();
      let botResponse = '';
      let botOptions: string[] | undefined = undefined;
      let matchedProduct: Product | undefined = undefined;

      // 1. CM MATCH / SIZE MEASUREMENT
      const cmMatch = lower.match(/(\d{1,2}(?:[.,]\d+)?)\s*(?:cm|centi)?/);
      if (
        (lower.includes('ukuran') || lower.includes('size') || lower.includes('cm') || cmMatch) &&
        !lower.includes('antar') &&
        !lower.includes('kirim')
      ) {
        if (cmMatch && parseFloat(cmMatch[1]) >= 10 && parseFloat(cmMatch[1]) <= 32) {
          const numCm = parseFloat(cmMatch[1].replace(',', '.'));
          const recSize = calculateSizeFromCm(numCm);
          botResponse =
            `Untuk panjang telapak kaki ${numCm} cm, rekomendasi pas dari Ades Store 01 adalah: ${recSize}! 👟\n\n` +
            `💡 Tips Memilih Ukuran:\n` +
            `• Jika telapak kaki kamu cenderung lebar atau memakai kaos kaki tebal, naikkan 1 nomor (upsize).\n` +
            `• Tenang saja, Ades Store 01 memberikan Garansi Bebas Retur Ukuran 7 Hari jika barang sampai dan ternyata kurang pas!`;
          botOptions = ['Lihat Sandal & Sepatu', 'Garansi Retur 7 Hari', 'Tanya Produk Lain'];
        } else {
          botResponse =
            `PANDUAN STANDAR UKURAN KAKI (INSOLE) ADES STORE 01:\n\n` +
            `• Dewasa Wanita & Pria:\n` +
            `  Size 36 : 22.5 cm\n` +
            `  Size 37 : 23.0 cm\n` +
            `  Size 38 : 23.5 cm\n` +
            `  Size 39 : 24.0 cm\n` +
            `  Size 40 : 24.5 cm\n` +
            `  Size 41 : 25.0 cm\n` +
            `  Size 42 : 25.5 cm\n` +
            `  Size 43 : 26.0 - 26.5 cm\n` +
            `  Size 44 : 27.0 - 27.5 cm\n\n` +
            `• Anak-Anak & Bayi:\n` +
            `  Size 18-22 : Bayi 0-18 Bulan (11 - 13.5 cm)\n` +
            `  Size 24-32 : Anak TK & SD (14 - 20 cm)\n\n` +
            `Berapa cm panjang telapak kaki kamu atau anak kamu dari tumit ke ujung jempol? Ketikkan misalnya: 24.5 cm`;
          botOptions = ['22.5 cm (Size 36)', '23.5 cm (Size 38)', '24.5 cm (Size 40)', '25.5 cm (Size 42)'];
        }
      }
      // 2. SANDAL & SEPATU ANAK LAKI-LAKI
      else if (
        lower.includes('anak laki') ||
        lower.includes('cowok') ||
        lower.includes('boy') ||
        lower.includes('dino')
      ) {
        const found = products.filter(
          (p) =>
            p.category === 'sepatu_anak_laki' ||
            p.name.toLowerCase().includes('anak laki') ||
            p.name.toLowerCase().includes('dino')
        );
        matchedProduct = found[0];
        botResponse =
          `Koleksi Sandal & Sepatu Anak Laki-Laki di Ades Store 01:\n\n` +
          `1. Sandal Gunung Anak Laki Tali Kuat Anti-Selip - Nyaman untuk jalan dan kegiatan luar ruangan.\n` +
          `2. Sepatu Sneaker Anak Laki Dinosaurus LED Menyala - Lampu menyala saat melangkah, sol empuk lembut.\n` +
          `3. Sandal Selop Santai Anak Laki Karakter Lucu - Bahan karet elastis anti-licin tahan air.\n\n` +
          `Semua model tersedia size 24 sampai 35 dengan garansi retur size 7 hari!`;
        botOptions = ['Lihat Sandal Anak Laki', 'Lihat Sepatu Dino LED', 'Tanya Ukuran Anak'];
      }
      // 3. SANDAL & SEPATU ANAK PEREMPUAN
      else if (
        lower.includes('anak perempuan') ||
        lower.includes('cewek') ||
        lower.includes('girl') ||
        lower.includes('princess')
      ) {
        const found = products.filter(
          (p) =>
            p.category === 'sepatu_anak_perempuan' ||
            p.name.toLowerCase().includes('anak perempuan') ||
            p.name.toLowerCase().includes('princess')
        );
        matchedProduct = found[0];
        botResponse =
          `Koleksi Sandal & Sepatu Anak Perempuan (Princess) di Ades Store 01:\n\n` +
          `1. Sandal Tali Pita Manis Anak Cewek - Desain feminin cantik dengan sol empuk anti-pegal.\n` +
          `2. Sepatu Flatshoes Princess Glitter Cantik - Cocok untuk pesta, jalan-jalan, dan acara keluarga.\n` +
          `3. Sandal Selop Jelly Pastel Anti-Air - Super lembut tidak bikin lecet kaki anak.\n\n` +
          `Tersedia size 24 sampai 35 dengan warna pastel cantik merah muda, ungu lilac, dan krem!`;
        botOptions = ['Lihat Sandal Anak Perempuan', 'Lihat Flatshoes Princess', 'Panduan Ukuran'];
      }
      // 4. PENGIRIMAN, ANTAR CEPAT CIKAJANG & GARUT, KURIR
      else if (
        lower.includes('antar') ||
        lower.includes('ongkir') ||
        lower.includes('kurir') ||
        lower.includes('cikajang') ||
        lower.includes('garut') ||
        lower.includes('kirim') ||
        lower.includes('ekspedisi')
      ) {
        botResponse =
          `PILIHAN PENGIRIMAN ADES STORE 01:\n\n` +
          `1. ⚡ Antar Cepat Cikajang & Garut (Instant Kilat):\n` +
          `   Pesanan langsung diantar kurir lokal toko ke alamat Anda di sekitar Cikajang, Bayongbong, Cisurupan, hingga Garut Kota (cepat sampai seperti belanja di Alfamart!).\n\n` +
          `2. 🏬 Ambil di Toko (Store Pick-up):\n` +
          `   Gratis ongkir 100%! Pesan lewat aplikasi lalu langsung ambil barang di toko fisik Ades Store 01 Cikajang Garut.\n\n` +
          `3. 📦 Ekspedisi Pengiriman Nasional:\n` +
          `   • J&T Express (Pelayanan cepat & tracking akurat)\n` +
          `   • JNE Reguler / YES (Jaminan kirim kilat)\n` +
          `   • GOTO / Grab-Gojek Instant\n` +
          `   • Ninja Xpress (Ongkir hemat bersahabat)\n\n` +
          `Bisa COD (Bayar di Tempat) atau transfer via DANA / QRIS!`;
        botOptions = ['Ambil di Toko Cikajang', 'Bisa COD?', 'Tanya Pembayaran DANA'];
      }
      // 5. GAME CANDY CRUSH & KOIN DISKON
      else if (
        lower.includes('candy') ||
        lower.includes('game') ||
        lower.includes('koin') ||
        lower.includes('poin') ||
        lower.includes('tukar')
      ) {
        botResponse =
          `ATURAN KOIN & GAME CANDY CRUSH ADES STORE 01:\n\n` +
          `• Sekali Menang Main Game: Kamu mendapatkan 5 Koin Member.\n` +
          `• Nilai Tukar Koin: Setiap 10.000 Poin Koin dapat ditukar langsung menjadi potongan harga Rp 1.000 saat checkout belanja.\n` +
          `• Saldo koin otomatis tersimpan di akun kamu dan langsung memotong total tagihan saat pembayaran!\n\n` +
          `Yuk mainkan mini-game Candy Crush sekarang untuk kumpulkan koin diskon sebanyak-banyaknya!`;
        botOptions = ['🍬 Main Game Candy Crush', 'Cek Saldo Poin Saya', '👑 Gabung VIP Member'];
      }
      // 6. GARANSI RETUR 7 HARI & TUKAR UKURAN
      else if (
        lower.includes('retur') ||
        lower.includes('tukar') ||
        lower.includes('garansi') ||
        lower.includes('rusak') ||
        lower.includes('sempit')
      ) {
        botResponse =
          `GARANSI RETUR & TUKAR SIZE 7 HARI ADES STORE 01:\n\n` +
          `• Bebas Tukar Ukuran: Jika sepatu atau sandal yang kamu beli kekecilan atau kebesaran, kamu bisa mengajukan tukar size dalam waktu 7 hari sejak barang diterima.\n` +
          `• Garansi Cacat Pabrik: Jika barang yang diterima rusak atau tidak sesuai, kami ganti baru 100% tanpa ribet.\n` +
          `• Caranya sangat mudah: Buka menu "Pesanan Saya", lalu klik tombol "Ajukan Retur / Tukar Barang" pada pesanan kamu, atau chat admin lewat WhatsApp.`;
        botOptions = ['Cara Ajukan Retur', 'Hubungi WhatsApp Admin', 'Panduan Ukuran'];
      }
      // 7. PEMBAYARAN, DANA, QRIS, COD
      else if (
        lower.includes('bayar') ||
        lower.includes('dana') ||
        lower.includes('qris') ||
        lower.includes('cod') ||
        lower.includes('rekening')
      ) {
        botResponse =
          `METODE PEMBAYARAN RESMI ADES STORE 01:\n\n` +
          `1. 📱 DANA:\n` +
          `   Nomor: 0821-2646-8980 (a.n. Alya Alifia / Ades Store 01)\n\n` +
          `2. 💳 QRIS Nasional:\n` +
          `   Bisa scan dari BCA, BRI, Mandiri, BNI, BSI, GoPay, OVO, ShopeePay, dan DANA.\n\n` +
          `3. 💵 COD (Cash On Delivery):\n` +
          `   Bayar langsung ke kurir saat barang sampai di rumah Anda.\n\n` +
          `Semua transaksi terverifikasi otomatis dan aman!`;
        botOptions = ['Nomor DANA Toko', 'Cek Pesanan Saya', 'Belanja Sekarang'];
      }
      // 8. LIVE STREAMING SHOPPING
      else if (
        lower.includes('live') ||
        lower.includes('streaming') ||
        lower.includes('siaran') ||
        lower.includes('tiktok')
      ) {
        botResponse =
          `FITUR LIVE STREAMING ADES STORE 01:\n\n` +
          `• Host kami rutin mengadakan Live Streaming langsung dari Toko Ades Store Cikajang Garut!\n` +
          `• Selama Live, kamu bisa melihat video review fisik sepatu asli, bertanya langsung lewat komentar, request spill ukuran, dan dapat diskon kilat eksklusif Live.\n` +
          `• Kamu bisa klik tombol merah "LIVE" di bagian atas untuk menonton siaran sekarang!`;
        botOptions = ['🔴 Tonton Live Sekarang', 'Lihat Promo Beranda', 'Tanya Produk'];
      }
      // 9. VIP MEMBERSHIP
      else if (
        lower.includes('vip') ||
        lower.includes('member') ||
        lower.includes('membership')
      ) {
        botResponse =
          `PROGRAM VIP MEMBERSHIP ADES STORE 01 (Rp 50.000 via QRIS):\n\n` +
          `Keuntungan Eksklusif Member VIP:\n` +
          `• Langsung dapat BONUS SAMBUTAN 50.000 Koin Member.\n` +
          `• CASHBACK 10% di setiap transaksi belanja tanpa batas.\n` +
          `• VOUCHER GRATIS ONGKIR ke seluruh wilayah.\n` +
          `• Prioritas pengiriman kilat dan bebas ongkir saat tukar ukuran 7 hari!\n\n` +
          `Pendaftaran hanya sekali dan status VIP berlaku seterusnya!`;
        botOptions = ['👑 Aktivasi VIP Sekarang', 'Lihat Syarat VIP', 'Tanya Produk'];
      }
      // 10. SEPATU SEKOLAH, SEPATU GUNUNG, TAS, BUKU
      else if (
        lower.includes('sekolah') ||
        lower.includes('gunung') ||
        lower.includes('hiking') ||
        lower.includes('tas') ||
        lower.includes('buku') ||
        lower.includes('dompet') ||
        lower.includes('bayi')
      ) {
        botResponse =
          `KATEGORI SPESIAL ADES STORE 01:\n\n` +
          `• Sepatu Sekolah: Model hitam polos bertali & velcro standar resmi SD, SMP, SMA sol kuat anti-jebol.\n` +
          `• Sepatu Gunung / Hiking: Tapak grip anti-licin dan sol tebal waterproof siap naik gunung.\n` +
          `• Tas Sekolah TK, SD, SMP, SMA: Ransel busa tebal anti-pegal dengan slot laptop empuk.\n` +
          `• Sepatu Bayi (Pre-walker): Usia 0-18 bulan bahan katun lembut tidak membuat kaki lecet.\n` +
          `• Buku Pelajaran & Tulis: Paket hemat alat tulis lengkap siap masuk sekolah.\n\n` +
          `Kamu mau cari produk yang mana? Ketikkan nama produknya ya!`;
        botOptions = ['Sepatu Sekolah Hitam', 'Sepatu Gunung Hiking', 'Tas Ransel Sekolah'];
      }
      // 11. GENERAL / PRODUCT SEARCH IN STORE
      else {
        // Try searching product catalog
        const matches = products.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower)
        );

        if (matches.length > 0) {
          const first = matches[0];
          matchedProduct = first;
          botResponse =
            `Saya menemukan produk yang sesuai di toko Ades Store 01:\n\n` +
            `"${first.name}"\n` +
            `Harga: ${formatIDR(first.promo_price || first.price)}\n` +
            `Kategori: ${first.category.replace(/_/g, ' ')}\n` +
            `Stok: ${first.stock} pasang | Ukuran tersedia: ${first.sizes?.join(', ')}\n\n` +
            `Klik tombol di bawah untuk melihat rincian produk dan memesan langsung!`;
          botOptions = [`Lihat ${first.name.slice(0, 24)}...`, 'Panduan Ukuran Kaki', 'Cara Belanja'];
        } else {
          botResponse =
            `AdesBot siap membantu kamu belanja di Ades Store 01!\n\n` +
            `Kamu bisa bertanya seputar:\n` +
            `• Rekomendasi sepatu pria, wanita, sandal anak laki-laki & anak perempuan\n` +
            `• Konsultasi ukuran kaki cm (contoh: "ukuran 24 cm")\n` +
            `• Info antar cepat area Cikajang & Garut\n` +
            `• Cara kumpulkan dan tukar koin Candy Crush\n` +
            `• Garansi retur tukar size 7 hari\n` +
            `• Pembayaran DANA 0821-2646-8980 dan QRIS\n\n` +
            `Silakan pilih opsi cepat di bawah atau ketik pertanyaan kamu!`;
          botOptions = [
            '📏 Cek Ukuran Kaki',
            '👦 Sandal Anak Laki',
            '👧 Sepatu Anak Cewek',
            '⚡ Antar Cepat Garut',
            '👑 Gabung VIP Member',
          ];
        }
      }

      // Final guarantee: Strip all asterisks (*) from the final response
      const sanitizedResponse = stripAsterisks(botResponse);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: sanitizedResponse,
          options: botOptions,
          productCard: matchedProduct,
        },
      ]);
    }, 400);
  };

  const handleOptionClick = (optText: string) => {
    if (optText.includes('VIP')) {
      onOpenVipModal();
      return;
    }
    if (optText.includes('Live')) {
      if (onOpenLive) onOpenLive();
      return;
    }
    if (optText.includes('Game') || optText.includes('Candy')) {
      if (onOpenGame) onOpenGame();
      return;
    }

    // Check if clicked option matches a product
    const matchingProduct = products.find((p) =>
      p.name.toLowerCase().includes(optText.toLowerCase().replace('lihat ', '').trim())
    );
    if (matchingProduct) {
      onOpenProduct(matchingProduct);
      return;
    }

    handleSendMessage(optText);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white p-3.5 sm:p-4 rounded-3xl shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 group border-2 border-white/60"
          title="Tanya AdesBot AI — Belanja Cerdas & Panduan Ukuran"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full absolute -top-0.5 -right-0.5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-extrabold text-xs leading-tight">AdesBot AI</p>
            <p className="text-[10px] text-rose-100 font-medium">Asisten Belanja Toko</p>
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] max-w-md bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col h-[540px] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-black via-zinc-950 to-red-950 text-white flex items-center justify-between border-b border-red-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-red-400 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-black text-xs sm:text-sm text-white">AdesBot Pintar</h4>
                  <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full">
                    Ades Store 01
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-none mt-0.5">
                  Panduan Ukuran, Produk &amp; Toko Cikajang
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Tutup Chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice Pill Banner */}
          <div className="bg-red-50 border-b border-red-100 px-3 py-1.5 flex items-center justify-between text-[10px] text-red-900 font-medium">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-red-600 flex-shrink-0" />
              <span>Store Fisik: Cikajang &bull; Garut Jawa Barat</span>
            </span>
            <span className="font-bold text-red-700">Garansi 7 Hari</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-red-600 text-white font-medium rounded-tr-2xs shadow-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-2xs shadow-xs'
                  }`}
                >
                  {/* Message Text with all asterisks (*) removed */}
                  {stripAsterisks(m.text)}

                  {/* Embedded Product Card if matched */}
                  {m.productCard && (
                    <div
                      onClick={() => onOpenProduct(m.productCard!)}
                      className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-red-400 cursor-pointer flex items-center space-x-2.5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                        <img
                          src={m.productCard.image_url}
                          alt={m.productCard.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-black text-[11px] text-slate-900 truncate">
                          {m.productCard.name}
                        </p>
                        <p className="text-[10px] font-black text-red-600">
                          {formatIDR(m.productCard.promo_price || m.productCard.price)}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          Klik untuk lihat detail &amp; beli &rarr;
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Option Buttons */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 hover:border-red-300 text-[10px] font-bold shadow-2xs transition-all active:scale-95"
                      >
                        {stripAsterisks(opt)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ketik pertanyaan (cm kaki, sandal anak, antar cepat...)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs flex-shrink-0"
              title="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
