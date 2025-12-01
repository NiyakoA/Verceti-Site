import { prisma } from '../prisma'
import { inventoryService } from './inventory'
import { generateOrderNumber } from '../utils'

export class OrderService {
  async createOrder(data: {
    sessionId: string
    email: string
    customerId?: string
    shippingAddress: any
    paymentIntentId: string
    totals: {
      subtotal: number
      discount: number
      shipping: number
      tax: number
      total: number
    }
  }) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: data.sessionId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }

    const orderNumber = generateOrderNumber()

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          email: data.email,
          subtotal: data.totals.subtotal,
          discount: data.totals.discount,
          shipping: data.totals.shipping,
          tax: data.totals.tax,
          total: data.totals.total,
          status: 'paid',
          shippingAddress: data.shippingAddress,
          paymentIntentId: data.paymentIntentId,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })

      // Deduct inventory
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Update discount usage if applicable
      if (cart.discountCode) {
        await tx.discount.update({
          where: { code: cart.discountCode },
          data: {
            usageCount: {
              increment: 1,
            },
          },
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      // Release reservations
      await tx.inventoryReservation.deleteMany({
        where: { sessionId: data.sessionId },
      })

      return newOrder
    })

    return order
  }

  async getOrder(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // If userId provided, verify ownership
    if (userId && order.customerId !== userId) {
      throw new Error('Unauthorized')
    }

    return order
  }

  async getOrderByNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
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
      },
    })
  }

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { customerId: userId },
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
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
  }

  async getAllOrders(filters?: {
    status?: string
    search?: string
    startDate?: Date
    endDate?: Date
  }) {
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate
      }
    }

    return prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}

export const orderService = new OrderService()
