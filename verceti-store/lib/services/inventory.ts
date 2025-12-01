import { prisma } from '../prisma'

export class InventoryService {
  async reserveInventory(variantId: string, quantity: number, sessionId: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    return await prisma.$transaction(async (tx) => {
      // Check if enough inventory is available
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
      })

      if (!variant || variant.inventory < quantity) {
        throw new Error('Insufficient inventory')
      }

      // Create reservation
      const reservation = await tx.inventoryReservation.create({
        data: {
          variantId,
          quantity,
          sessionId,
          expiresAt,
        },
      })

      return reservation.id
    })
  }

  async releaseReservation(reservationId: string): Promise<void> {
    await prisma.inventoryReservation.delete({
      where: { id: reservationId },
    })
  }

  async releaseReservationsBySession(sessionId: string): Promise<void> {
    await prisma.inventoryReservation.deleteMany({
      where: { sessionId },
    })
  }

  async deductInventory(variantId: string, quantity: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
      })

      if (!variant || variant.inventory < quantity) {
        throw new Error('Insufficient inventory')
      }

      await tx.productVariant.update({
        where: { id: variantId },
        data: {
          inventory: {
            decrement: quantity,
          },
        },
      })
    })
  }

  async addInventory(variantId: string, quantity: number): Promise<void> {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        inventory: {
          increment: quantity,
        },
      },
    })
  }

  async cleanupExpiredReservations(): Promise<number> {
    const result = await prisma.inventoryReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
    return result.count
  }

  async getAvailableInventory(variantId: string): Promise<number> {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { inventory: true },
    })

    if (!variant) {
      throw new Error('Variant not found')
    }

    const reservations = await prisma.inventoryReservation.aggregate({
      where: {
        variantId,
        expiresAt: {
          gt: new Date(),
        },
      },
      _sum: {
        quantity: true,
      },
    })

    const reserved = reservations._sum.quantity || 0
    return Math.max(0, variant.inventory - reserved)
  }
}

export const inventoryService = new InventoryService()
