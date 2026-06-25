import { Product } from '../model/product.model';

export const LOW_STOCK_THRESHOLD = 50;
export const EXPIRING_SOON_DAYS = 7;

function daysUntil(dateStr: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

export function isLowStock(product: Product): boolean {
  return product.quantity <= LOW_STOCK_THRESHOLD;
}

export function isExpired(product: Product): boolean {
  return daysUntil(product.expireDate) < 0;
}

export function isExpiringSoon(product: Product): boolean {
  const days = daysUntil(product.expireDate);
  return days >= 0 && days <= EXPIRING_SOON_DAYS;
}
