import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function calculateCartTotal(items: Array<{ price: number; quantity: number }>, discount: number = 0): number {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return Math.max(0, subtotal - discount)
}

export function getStockStatus(inventory: number, lowStockThreshold: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (inventory === 0) return 'out_of_stock'
  if (inventory <= lowStockThreshold) return 'low_stock'
  return 'in_stock'
}

export function calculateDiscount(subtotal: number, discountType: 'percentage' | 'fixed', discountValue: number): number {
  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100
  }
  return Math.min(discountValue, subtotal)
}
