import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ades Putra 01 Store — Belanja Pasti Tanpa Ragu: Harga Promo, Kualitas Terbaik',
  description:
    'Ades Putra 01 Store: Belanja Pasti Tanpa Ragu! Koleksi Sepatu Sneakers & Loafer (Size 36-43), Sandal Slide Empuk, dan Tas Fashion Premium. Pengiriman Cepat JNE, J&T, GOTO Instant, Ninja Xpress. Bisa COD & QRIS.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
