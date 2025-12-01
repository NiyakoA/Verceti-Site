# Verceti - Premium Streetwear E-Commerce

A production-ready streetwear e-commerce platform built with Next.js 14, featuring timed product drops, variant management, Stripe payments, and comprehensive admin tools.

## Features

- 🛍️ **Product Catalog** - Browse products with variants (size, color), images, and reviews
- ⏰ **Drop Engine** - Timed product launches with countdown timers and early access
- 💳 **Stripe Integration** - Secure payment processing with Stripe Checkout
- 📦 **Inventory Management** - Real-time stock tracking with reservation system
- 🎫 **Discount Codes** - Percentage and fixed-value discount codes
- 👤 **User Accounts** - Customer registration, login, and order history
- 🔐 **Admin Dashboard** - Manage products, orders, drops, discounts, and analytics
- 📱 **Mobile-First** - Responsive design optimized for mobile devices
- 🚀 **Performance** - Server-side rendering, image optimization, and CDN delivery

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Vercel account (for deployment)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd verceti-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/verceti_store"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   CRON_SECRET="your-cron-secret"
   ```

4. **Set up the database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the database (optional)**:
   Create an admin user:
   ```bash
   npx prisma studio
   ```
   Then manually create a user with `role: "admin"`

6. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
verceti-store/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product pages
│   ├── drops/             # Drops page
│   ├── cart/              # Shopping cart
│   └── ...
├── components/            # React components
│   ├── layout/           # Header, footer
│   ├── products/         # Product components
│   └── drops/            # Drop components
├── lib/                   # Utilities and services
│   ├── services/         # Business logic
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema
│   └── schema.prisma
└── public/               # Static assets
```

## Key Features to Implement

### 1. Add Product Images
- Upload images to a CDN (Cloudinary, Vercel Blob, etc.)
- Update product image URLs in the database

### 2. Configure Stripe
- Set up Stripe products and prices
- Configure webhook endpoint in Stripe dashboard
- Test payment flow with test cards

### 3. Customize Styling
- Update colors in `tailwind.config.ts`
- Add your brand logo to header
- Customize hero section with brand imagery

### 4. Set Up Email
- Install email service (Resend recommended):
  ```bash
  npm install resend
  ```
- Configure email templates for order confirmations

### 5. Deploy to Vercel
- Push code to GitHub
- Connect repository to Vercel
- Add environment variables in Vercel dashboard
- Configure custom domain

## Admin Access

To access the admin dashboard:
1. Create a user account
2. Update the user's role to "admin" in the database
3. Navigate to `/admin`

## API Routes

### Public
- `GET /api/products` - List products
- `GET /api/products/[slug]` - Get product details
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart
- `GET /api/drops` - List drops

### Admin (requires authentication)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `POST /api/admin/drops` - Create drop
- `GET /api/admin/orders` - List orders

### Cron Jobs
- `GET /api/cron/activate-drops` - Activate scheduled drops (runs every minute)
- `GET /api/cron/cleanup-reservations` - Clean expired reservations (runs every 5 minutes)

## Database Schema

Key models:
- **Product** - Product information
- **ProductVariant** - Size/color combinations with inventory
- **Drop** - Timed product launches
- **Cart** - Shopping carts
- **Order** - Customer orders
- **User** - Customer accounts
- **Discount** - Discount codes

## Development Tips

### Adding Products
Use Prisma Studio to add products:
```bash
npx prisma studio
```

### Testing Drops
1. Create a product
2. Create a drop with a launch date in the future
3. The cron job will activate it automatically

### Testing Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database
- Use Vercel Postgres, Railway, Supabase, or Neon
- Update `DATABASE_URL` in environment variables

### Cron Jobs
Vercel Cron is configured in `vercel.json` and will run automatically in production.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
