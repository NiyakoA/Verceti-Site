import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@verceti.us' },
    update: {},
    create: {
      email: 'admin@verceti.us',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
    },
  })
  console.log('Created admin user:', admin.email)

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      emailVerified: true,
    },
  })
  console.log('Created customer user:', customer.email)

  // Create sample product
  const product = await prisma.product.create({
    data: {
      name: 'Premium Hoodie',
      slug: 'premium-hoodie',
      description: 'High-quality streetwear hoodie with premium materials and construction. Perfect for any season.',
      basePrice: 89.99,
      category: 'Hoodies',
      tags: ['streetwear', 'premium', 'new'],
      sizeGuide: 'S: Chest 36-38"\nM: Chest 38-40"\nL: Chest 40-42"\nXL: Chest 42-44"',
      images: {
        create: [
          {
            url: '/placeholder-product.jpg',
            altText: 'Premium Hoodie - Front View',
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'HOODIE-BLK-S',
            size: 'S',
            color: 'Black',
            priceAdjustment: 0,
            inventory: 10,
            lowStockThreshold: 3,
          },
          {
            sku: 'HOODIE-BLK-M',
            size: 'M',
            color: 'Black',
            priceAdjustment: 0,
            inventory: 15,
            lowStockThreshold: 3,
          },
          {
            sku: 'HOODIE-BLK-L',
            size: 'L',
            color: 'Black',
            priceAdjustment: 0,
            inventory: 12,
            lowStockThreshold: 3,
          },
          {
            sku: 'HOODIE-WHT-S',
            size: 'S',
            color: 'White',
            priceAdjustment: 0,
            inventory: 8,
            lowStockThreshold: 3,
          },
          {
            sku: 'HOODIE-WHT-M',
            size: 'M',
            color: 'White',
            priceAdjustment: 0,
            inventory: 10,
            lowStockThreshold: 3,
          },
        ],
      },
    },
  })
  console.log('Created product:', product.name)

  // Create sample discount code
  const discount = await prisma.discount.create({
    data: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      active: true,
      usageLimit: 100,
      usageCount: 0,
    },
  })
  console.log('Created discount code:', discount.code)

  // Create a future drop
  const dropDate = new Date()
  dropDate.setDate(dropDate.getDate() + 7) // 7 days from now

  const dropProduct = await prisma.product.create({
    data: {
      name: 'Limited Edition Jacket',
      slug: 'limited-edition-jacket',
      description: 'Exclusive limited edition jacket. Only 50 pieces available worldwide.',
      basePrice: 199.99,
      category: 'Jackets',
      tags: ['limited', 'exclusive', 'drop'],
      images: {
        create: [
          {
            url: '/placeholder-drop.jpg',
            altText: 'Limited Edition Jacket',
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'JACKET-LTD-M',
            size: 'M',
            color: 'Black',
            priceAdjustment: 0,
            inventory: 25,
            lowStockThreshold: 5,
          },
          {
            sku: 'JACKET-LTD-L',
            size: 'L',
            color: 'Black',
            priceAdjustment: 0,
            inventory: 25,
            lowStockThreshold: 5,
          },
        ],
      },
      drop: {
        create: {
          launchDate: dropDate,
          status: 'scheduled',
        },
      },
    },
  })
  console.log('Created drop product:', dropProduct.name)

  console.log('Seed completed!')
  console.log('\nLogin credentials:')
  console.log('Admin: admin@verceti.us / admin123')
  console.log('Customer: customer@example.com / customer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
