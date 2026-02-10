import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | Decimal | null | undefined): string {
  if (amount === null || amount === undefined) return '0 ₫';
  
  const value = typeof amount === 'object' && 'toNumber' in amount 
    ? amount.toNumber() 
    : Number(amount);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

// Type giả lập cho Decimal của Prisma nếu cần dùng ở Client mà không import Prisma
type Decimal = {
  toNumber: () => number;
};