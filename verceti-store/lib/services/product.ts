import { prisma } from '../prisma'
import { generateSlug } from '../utils'

export class ProductService {
  async createProduct(data: {
    name: string
    description: string
    basePrice: number
    category: string
    tags?: string[]
    sizeGuide?: string
  }) {
    const slug = generateSlug(data.name)

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        category: data.category,
        tags: data.tags || [],
        sizeGuide: data.sizeGuide,
      },
      include: {
        images: true,
        variants: true,
      },
    })
  }

  async updateProduct(productId: string, data: {
    name?: string
    description?: string
    basePrice?: number
    category?: string
    tags?: string[]
    sizeGuide?: string
  }) {
    const updateData: any = { ...data }

    if (data.name) {
      updateData.slug = generateSlug(data.name)
    }

    return prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        images: true,
        variants: true,
      },
    })
  }

  async deleteProduct(productId: string) {
    return prisma.product.delete({
      where: { id: productId },
    })
  }

  async getProduct(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        drop: true,
      },
    })
  }

  async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        drop: true,
      },
    })
  }

  async getAllProducts(filters?: {
    category?: string
    tags?: string[]
    search?: string
  }) {
    const where: any = {}

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        variants: true,
        drop: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async addVariant(productId: string, data: {
    sku: string
    size: string
    color: string
    priceAdjustment?: number
    inventory: number
    lowStockThreshold?: number
  }) {
    return prisma.productVariant.create({
      data: {
        productId,
        sku: data.sku,
        size: data.size,
        color: data.color,
        priceAdjustment: data.priceAdjustment || 0,
        inventory: data.inventory,
        lowStockThreshold: data.lowStockThreshold || 5,
      },
    })
  }

  async updateVariant(variantId: string, data: {
    sku?: string
    size?: string
    color?: string
    priceAdjustment?: number
    inventory?: number
    lowStockThreshold?: number
  }) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data,
    })
  }

  async deleteVariant(variantId: string) {
    return prisma.productVariant.delete({
      where: { id: variantId },
    })
  }

  async addImage(productId: string, url: string, altText: string, order: number) {
    return prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
        order,
      },
    })
  }

  async deleteImage(imageId: string) {
    return prisma.productImage.delete({
      where: { id: imageId },
    })
  }

  async addReview(data: {
    productId: string
    userId: string
    rating: number
    title: string
    comment: string
  }) {
    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
  }

  async getProductReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
    })

    return result._avg.rating || 0
  }
}

export const productService = new ProductService()
