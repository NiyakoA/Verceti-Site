import { prisma } from '../prisma'

export class DropService {
  async createDrop(data: {
    productId: string
    launchDate: Date
    earlyAccessDate?: Date
    earlyAccessRules?: any
  }) {
    return prisma.drop.create({
      data: {
        productId: data.productId,
        launchDate: data.launchDate,
        earlyAccessDate: data.earlyAccessDate,
        earlyAccessRules: data.earlyAccessRules,
        status: 'scheduled',
      },
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
      },
    })
  }

  async updateDrop(dropId: string, data: {
    launchDate?: Date
    earlyAccessDate?: Date
    earlyAccessRules?: any
    status?: string
  }) {
    return prisma.drop.update({
      where: { id: dropId },
      data,
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
      },
    })
  }

  async getDrop(dropId: string) {
    return prisma.drop.findUnique({
      where: { id: dropId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            variants: true,
          },
        },
      },
    })
  }

  async getDropByProduct(productId: string) {
    return prisma.drop.findUnique({
      where: { productId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            variants: true,
          },
        },
      },
    })
  }

  async getAllDrops(status?: string) {
    const where: any = {}
    if (status) {
      where.status = status
    }

    return prisma.drop.findMany({
      where,
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: { launchDate: 'desc' },
    })
  }

  async getUpcomingDrops() {
    return prisma.drop.findMany({
      where: {
        status: {
          in: ['scheduled', 'early_access'],
        },
        launchDate: {
          gt: new Date(),
        },
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: { launchDate: 'asc' },
    })
  }

  async getLiveDrops() {
    return prisma.drop.findMany({
      where: {
        status: 'live',
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: { launchDate: 'desc' },
    })
  }

  calculateCountdown(launchDate: Date): {
    days: number
    hours: number
    minutes: number
    seconds: number
    isLive: boolean
  } {
    const now = new Date()
    const diff = launchDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isLive: false }
  }

  async checkEarlyAccess(dropId: string, userId?: string): Promise<boolean> {
    const drop = await this.getDrop(dropId)

    if (!drop || !drop.earlyAccessDate) {
      return false
    }

    const now = new Date()

    // Check if we're in early access period
    if (now < drop.earlyAccessDate || now >= drop.launchDate) {
      return false
    }

    // If no rules, deny early access
    if (!drop.earlyAccessRules) {
      return false
    }

    // If no user, deny early access
    if (!userId) {
      return false
    }

    // Check early access rules
    const rules = drop.earlyAccessRules as any

    if (rules.type === 'previous_customer') {
      const orderCount = await prisma.order.count({
        where: {
          customerId: userId,
          status: {
            in: ['paid', 'processing', 'shipped', 'delivered'],
          },
        },
      })
      return orderCount > 0
    }

    if (rules.type === 'vip_tier') {
      // Implement VIP tier logic here
      return false
    }

    return false
  }

  async activateDrops() {
    const now = new Date()

    // Activate drops that have reached launch time
    const dropsToActivate = await prisma.drop.findMany({
      where: {
        status: {
          in: ['scheduled', 'early_access'],
        },
        launchDate: {
          lte: now,
        },
      },
    })

    for (const drop of dropsToActivate) {
      await prisma.drop.update({
        where: { id: drop.id },
        data: { status: 'live' },
      })
    }

    // Transition to early access
    const dropsToEarlyAccess = await prisma.drop.findMany({
      where: {
        status: 'scheduled',
        earlyAccessDate: {
          lte: now,
        },
        launchDate: {
          gt: now,
        },
      },
    })

    for (const drop of dropsToEarlyAccess) {
      await prisma.drop.update({
        where: { id: drop.id },
        data: { status: 'early_access' },
      })
    }

    return {
      activated: dropsToActivate.length,
      earlyAccess: dropsToEarlyAccess.length,
    }
  }

  async checkAndUpdateSoldOut() {
    const liveDrops = await prisma.drop.findMany({
      where: { status: 'live' },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
    })

    for (const drop of liveDrops) {
      const totalInventory = drop.product.variants.reduce(
        (sum, variant) => sum + variant.inventory,
        0
      )

      if (totalInventory === 0) {
        await prisma.drop.update({
          where: { id: drop.id },
          data: { status: 'sold_out' },
        })
      }
    }
  }
}

export const dropService = new DropService()
