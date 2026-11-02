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
} from 'lucide-react';
import { Product } from '@/types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
}

interface AdesBotProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onOpenVipModal: () => void;
}

export default function AdesBot({
  products,
  onOpenProduct,
  onOpenVipModal,
}: AdesBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Halo! Saya AdesBot 🤖, AI Shopping Assistant Ades Store 01. Tagline kami: "Langkah Nyaman, Gaya Maksimal Setiap Hari". Ada yang bisa saya bantu? Kamu bisa konsultasi ukuran kaki (cm), minta rekomendasi sepatu, sandal, atau tas!',
      options: [
        '📏 Panduan Ukuran Kaki (cm)',
        '👟 Sepatu Kerja & Kuliah',
        '🩴 Sandal Paling Empuk',
        '👜 Tas Muat Laptop',
        '👑 Info VIP Member 50k',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Size Calculation (cm to size 36-43)
  const calculateSizeFromCm = (cm: number): string => {
    if (cm <= 22.5) return 'Size 36 (22.5 cm)';
    if (cm <= 23.0) return 'Size 37 (23.0 cm)';
    if (cm <= 23.5) return 'Size 38 (23.5 cm)';
    if (cm <= 24.0) return 'Size 39 (24.0 cm)';
    if (cm <= 24.5) return 'Size 40 (24.5 cm)';
    if (cm <= 25.0) return 'Size 41 (25.0 cm)';
    if (cm <= 25.5) return 'Size 42 (25.5 cm)';
    if (cm <= 26.5) return 'Size 43 (26.0 - 26.5 cm)';
    return 'Size 43+ (Rekomendasi upsize jika kaki lebar)';
  };

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Process Response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = '';
      let botOptions: string[] | undefined = undefined;

      // 1. Size Chart & CM consultation
      const cmMatch = lower.match(/(\d{1,2}(?:[.,]\d+)?)\s*(?:cm|centi)?/);
      if (lower.includes('ukuran') || lower.includes('size') || lower.includes('cm') || cmMatch) {
        if (cmMatch && parseFloat(cmMatch[1]) >= 20 && parseFloat(cmMatch[1]) <= 32) {
          const numCm = parseFloat(cmMatch[1].replace(',', '.'));
          const recSize = calculateSizeFromCm(numCm);
          botResponse = `Untuk panjang telapak kaki **${numCm} cm**, kami merekomendasikan **${recSize}**! 👟\n\n💡 *Tips*: Jika punggung kaki kamu tebal/lebar, kami sarankan naik 1 ukuran (upsize) agar lebih leluasa. Kami juga menyediakan garansi retur ukuran jika masih kurang pas!`;
          botOptions = ['Lihat Sneakers Kasual', 'Lihat Sandal Slide'];
        } else {
          botResponse =
            `📏 **Tabel Standar Ukuran Kaki Ades Store 01 (Insole)**:\n` +
            `• Size 36 : 22.5 cm\n` +
            `• Size 37 : 23.0 cm\n` +
            `• Size 38 : 23.5 cm\n` +
            `• Size 39 : 24.0 cm\n` +
            `• Size 40 : 24.5 cm\n` +
            `• Size 41 : 25.0 cm\n` +
            `• Size 42 : 25.5 cm\n` +
            `• Size 43 : 26.0 cm\n\n` +
            `Berapa cm panjang telapak kaki kamu dari tumit ke jari terpanjang? Ketikkan misalnya: "24 cm".`;
          botOptions = ['23.5 cm', '24 cm', '24.5 cm', '25 cm'];
        }
      }
      // 2. Shoes recommendation
      else if (lower.includes('sepatu') || lower.includes('sneaker') || lower.includes('kerja') || lower.includes('kuliah')) {
        botResponse =
          `Untuk kegiatan kuliah atau ngantor harian, rekomendasi terbaik adalah:\n` +
          `1. **Ades Aerocushion White Sneakers** (Rp 279.000) - Insole busa memory foam anti pegal!\n` +
          `2. **Ades Chunky Retro Platform Sneaker** (Rp 319.000) - Gaya Korean street style 4.5cm.\n` +
          `3. **Ades Classic Penny Loafer Leather** (Rp 299.000) - Siluet formal rapi untuk meeting.`;
        botOptions = ['Ades Aerocushion', 'Ades Chunky Retro', 'Tabel Size Sepatu'];
      }
      // 3. Sandal recommendation
      else if (lower.includes('sandal') || lower.includes('empuk') || lower.includes('gunung')) {
        botResponse =
          `Koleksi sandal favorit kami:\n` +
          `1. **Ades CloudSlide Puffy Double Strap** (Rp 129.000) - Super empuk seperti menginjak awan, tahan air!\n` +
          `2. **Ades Terra Trekker Sandal Gunung** (Rp 179.000) - Tali webbing kuat dan tapak anti-selip.`;
        botOptions = ['Ades CloudSlide', 'Ades Terra Trekker'];
      }
      // 4. Bag recommendation
      else if (lower.includes('tas') || lower.includes('laptop') || lower.includes('tote') || lower.includes('ransel') || lower.includes('backpack')) {
        botResponse =
          `Pilihan tas terbaik untuk aktivitasmu:\n` +
          `1. **Ades Daily Canvas Tote Bag** (Rp 149.000) - Muat laptop 14 inci dengan busa pelindung.\n` +
          `2. **Ades Urban Waterproof Backpack** (Rp 299.000) - Muat laptop 15.6 inci & bahan waterproof.\n` +
          `3. **Ades Milano Quilted Sling Bag** (Rp 229.000) - Tas selempang pesta/hangout rantai emas mewah.`;
        botOptions = ['Canvas Tote Bag', 'Milano Sling Bag'];
      }
      // 5. VIP Member questions
      else if (lower.includes('vip') || lower.includes('member') || lower.includes('poin') || lower.includes('koin')) {
        botResponse =
          `👑 **Program VIP Membership Ades Store 01 (Rp 50.000)**:\n` +
          `• Langsung dapat **🚚 Bonus Gratis Ongkir** + **⚡ Cashback 10% Koin Member**.\n` +
          `• Diskon ekstra 10% setiap transaksi.\n` +
          `• Garansi bebas ongkir tukar ukuran (size exchange) 7 hari!`;
        botOptions = ['👑 Gabung VIP Sekarang', 'Lihat Katalog'];
      }
      // Default
      else {
        botResponse =
          `Ada yang bisa saya carikan lagi? Kamu bisa coba ketik panjang kaki (contoh: "24.5 cm"), tanya rekomendasi tas, atau tanya seputar pengiriman JNE, J&T, GOTO, dan Ninja Xpress!`;
        botOptions = ['📏 Cek Ukuran Kaki', '👟 Sepatu Best Seller', '👑 Info VIP Member'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          options: botOptions,
        },
      ]);
    }, 450);
  };

  const handleOptionClick = (optText: string) => {
    if (optText.includes('Gabung VIP')) {
      onOpenVipModal();
      return;
    }
    // Check if it's a product
    const matchingProduct = products.find((p) =>
      p.name.toLowerCase().includes(optText.toLowerCase())
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
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white p-4 rounded-3xl shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 group"
          title="Tanya AdesBot (AI Fashion Assistant)"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full absolute -top-0.5 -right-0.5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-extrabold text-xs leading-tight">AdesBot AI</p>
            <p className="text-[10px] text-rose-100 font-medium">Panduan Size & Rekomendasi</p>
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-black via-zinc-950 to-red-950 text-white flex items-center justify-between border-b border-red-900/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-red-400 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="Ades Store 01" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-black text-sm text-white">AdesBot AI</h4>
                  <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full">
                    Ades Store 01
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Panduan Ukuran Kaki & Rekomendasi Belanja
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-rose-600 text-white font-medium rounded-tr-2xs shadow-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-2xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick Option Buttons */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 text-[11px] font-bold shadow-2xs transition-all"
                      >
                        {opt}
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
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tanya ukuran kaki cm, sepatu, tas..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
