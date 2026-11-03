import { CourierTariff } from '@/types';

export const COURIERS: CourierTariff[] = [
  {
    code: 'J&T Express',
    name: 'J&T Express (Reguler)',
    etd: '1 - 2 Hari Kerja',
    cost: 15000,
    badge: 'Terpopuler',
  },
  {
    code: 'JNE',
    name: 'JNE Reguler',
    etd: '2 - 3 Hari Kerja',
    cost: 16000,
  },
  {
    code: 'GOTO (Instant)',
    name: 'GOTO Instant / Same Day',
    etd: 'Tiba Hari Ini (Maks 3 Jam)',
    cost: 25000,
    badge: 'Super Cepat',
  },
  {
    code: 'Ninja Xpress',
    name: 'Ninja Xpress Hemat',
    etd: '2 - 4 Hari Kerja',
    cost: 13000,
    badge: 'Termurah',
  },
];
