import { CourierTariff } from '@/types';

export const COURIERS: CourierTariff[] = [
  {
    code: '⚡ Kurir Kilat Ades (Cikajang & Garut)',
    name: '⚡ Kurir Kilat Ades (Cikajang & Garut Sekitarnya)',
    etd: 'Langsung Diantar (1 - 3 Jam Tiba)',
    cost: 10000,
    badge: '⚡ Kilat Toko 1-3 Jam',
  },
  {
    code: '🏪 Ambil di Toko Offline (Pick-up Store)',
    name: '🏪 Ambil Sendiri di Toko Ades (Cikajang)',
    etd: 'Bawa Langsung / Siap Diambil Hari Ini',
    cost: 0,
    badge: 'GRATIS ONGKIR Rp 0',
  },
  {
    code: 'J&T Express',
    name: 'J&T Express (Reguler Nasional)',
    etd: '1 - 2 Hari Kerja',
    cost: 15000,
    badge: 'Ekspedisi Reguler',
  },
  {
    code: 'JNE',
    name: 'JNE Reguler',
    etd: '2 - 3 Hari Kerja',
    cost: 16000,
  },
  {
    code: 'Ninja Xpress',
    name: 'Ninja Xpress Hemat',
    etd: '2 - 4 Hari Kerja',
    cost: 13000,
    badge: 'Ekspedisi Hemat',
  },
];
