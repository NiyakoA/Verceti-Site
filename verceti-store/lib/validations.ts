import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  basePrice: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  sizeGuide: z.string().optional(),
})

export const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  priceAdjustment: z.number().default(0),
  inventory: z.number().int().min(0, 'Inventory cannot be negative'),
  lowStockThreshold: z.number().int().min(0).default(5),
})

export const cartItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive('Quantity must be positive'),
})

export const discountSchema = z.object({
  code: z.string().min(1, 'Code is required').toUpperCase(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  expiresAt: z.date().optional(),
  usageLimit: z.number().int().positive().optional(),
})

export const userRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
})

export const dropSchema = z.object({
  productId: z.string(),
  launchDate: z.date(),
  earlyAccessDate: z.date().optional(),
  earlyAccessRules: z.any().optional(),
})

export const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
})
