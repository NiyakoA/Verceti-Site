import { prisma } from '../prisma'
import { inventoryService } from './inventory'
import { calculateDiscount } from '../utils'

export class CartService {
  async getOrCreateCart(sessionId: string) {
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { order: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
        discount: true,
      },
    })

    if (!cart) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      cart = await prisma.cart.create({
        data: {
          sessionId,
          expiresAt,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: {
                        orderBy: { order: 'asc' },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          discount: true,
        },
      })
    }

    return cart
  }

  async addItem(sessionId: string, variantId: string, quantity: number) {
    const cart = await this.getOrCreateCart(sessionId)

    // Check inventory availability
    const available = await inventoryService.getAvailableInventory(variantId)
    if (available < quantity) {
      throw new Error('Insufficient inventory available')
    }

    // Get variant price
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    })

    if (!variant) {
      throw new Error('Variant not found')
    }

    const price = parseFloat(variant.product.basePrice.toString()) + parseFloat(variant.priceAdjustment.toString())

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          price,
        },
      })
    }

    // Reserve inventory
    await inventoryService.reserveInventory(variantId, quantity, sessionId)

    return this.getOrCreateCart(sessionId)
  }

  async updateItemQuantity(sessionId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(sessionId, itemId)
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    })

    if (!item || item.cart.sessionId !== sessionId) {
      throw new Error('Item not found')
    }

    const available = await inventoryService.getAvailableInventory(item.variantId)
    if (available < quantity) {
      throw new Error('Insufficient inventory available')
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return this.getOrCreateCart(sessionId)
  }

  async removeItem(sessionId: string, itemId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    })

    if (!item || item.cart.sessionId !== sessionId) {
      throw new Error('Item not found')
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return this.getOrCreateCart(sessionId)
  }

  async applyDiscount(sessionId: string, code: string) {
    const cart = await this.getOrCreateCart(sessionId)

    const discount = await prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!discount) {
      throw new Error('Invalid discount code')
    }

    if (!discount.active) {
      throw new Error('Discount code is no longer active')
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      throw new Error('Discount code has expired')
    }

    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      throw new Error('Discount code usage limit reached')
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { discountCode: discount.code },
    })

    return this.getOrCreateCart(sessionId)
  }

  async removeDiscount(sessionId: string) {
    const cart = await this.getOrCreateCart(sessionId)

    await prisma.cart.update({
      where: { id: cart.id },
      data: { discountCode: null },
    })

    return this.getOrCreateCart(sessionId)
  }

  async calculateTotals(sessionId: string) {
    const cart = await this.getOrCreateCart(sessionId)

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.price.toString()) * item.quantity
    }, 0)

    let discount = 0
    if (cart.discount) {
      discount = calculateDiscount(
        subtotal,
        cart.discount.type as 'percentage' | 'fixed',
        parseFloat(cart.discount.value.toString())
      )
    }

    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const tax = (subtotal - discount) * 0.08 // 8% tax
    const total = subtotal - discount + shipping + tax

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    }
  }

  async clearCart(sessionId: string) {
    const cart = await this.getOrCreateCart(sessionId)

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    await inventoryService.releaseReservationsBySession(sessionId)

    return this.getOrCreateCart(sessionId)
  }
}

export const cartService = new CartService()
