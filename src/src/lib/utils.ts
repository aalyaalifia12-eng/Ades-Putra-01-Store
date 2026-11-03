import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format standard IDR currency: Rp 15.000
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, ' ');
}

/**
 * Format date to standard Indonesian format: 02 Nov 2026, 13:45
 */
export function formatIndoDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Format date for daily grouping: YYYY-MM-DD
 */
export function getFormattedDateOnly(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Generate formatted invoice number: INV-YYYYMMDD-XXXX
 */
export function generateInvoiceNo(counter: number, date: Date = new Date()): string {
  const dateStr = getFormattedDateOnly(date);
  const padded = String(counter).padStart(4, '0');
  return `INV-${dateStr}-${padded}`;
}

/**
 * Clean numbers for inputs
 */
export function parseIDRInput(val: string): number {
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
