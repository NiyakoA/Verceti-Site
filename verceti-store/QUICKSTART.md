# Quick Start Guide

Get your Verceti store up and running in minutes!

## 1. Set Up Database

You have two options:

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally, then:
createdb verceti_store
```

### Option B: Cloud Database (Recommended)
Use one of these free options:
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Supabase**: https://supabase.com (includes PostgreSQL)
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

Get your connection string and add it to `.env`:
```env
DATABASE_URL="postgresql://..."
```

## 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add:

```env
# Database
DATABASE_URL="your-database-url-here"

# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get after setting up webhook

# Cron (any random string for security)
CRON_SECRET="your-random-string"
```

## 3. Initialize Database

```bash
# Push the schema to your database
npm run db:push

# Seed with sample data (admin user, products, etc.)
npm run db:seed
```

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 5. Login

Use the seeded credentials:

**Admin Account:**
- Email: `admin@verceti.us`
- Password: `admin123`
- Access admin panel at: http://localhost:3000/admin

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 6. Add Your Products

### Via Admin Dashboard
1. Go to http://localhost:3000/admin
2. Click "Products" → "Add Product"
3. Fill in product details
4. Add variants (sizes, colors)
5. Upload images

### Via Prisma Studio
```bash
npm run db:studio
```
Opens a visual database editor at http://localhost:5555

## 7. Configure Stripe

### Get API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your publishable and secret keys
3. Add them to `.env`

### Set Up Webhook (for production)
1. Go to https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

### Test Payments
Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Any future expiry date and any 3-digit CVC

## 8. Customize Your Store

### Update Branding
- Edit `app/layout.tsx` - Change site title and description
- Edit `components/layout/header.tsx` - Update logo
- Edit `app/page.tsx` - Customize homepage

### Add Your Images
Replace placeholder images with your product photos:
1. Upload to a CDN (Cloudinary, Vercel Blob, etc.)
2. Update image URLs in database

### Customize Colors
Edit `tailwind.config.ts` to match your brand colors

## 9. Deploy to Vercel

### Prepare for Deployment
```bash
# Make sure everything works locally
npm run build
```

### Deploy
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Add environment variables (same as `.env`)
6. Deploy!

### After Deployment
1. Update `NEXTAUTH_URL` to your production URL
2. Set up Stripe webhook with production URL
3. Update `NEXT_PUBLIC_APP_URL` to production URL

## Common Tasks

### Add a New Product
```bash
npm run db:studio
# Or use admin dashboard at /admin/products
```

### Create a Drop
1. Create a product first
2. Go to `/admin/drops`
3. Click "Create Drop"
4. Set launch date and optional early access

### View Orders
Go to `/admin/orders` to see all orders

### Create Discount Codes
Go to `/admin/discounts` to create discount codes

### Check Analytics
Go to `/admin/analytics` for sales data

## Troubleshooting

### Database Connection Error
- Check your `DATABASE_URL` is correct
- Make sure your database is running
- Try `npm run db:push` again

### Stripe Errors
- Verify API keys are correct
- Make sure you're using test mode keys for development
- Check Stripe dashboard for error details

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Can't Login
- Make sure you ran `npm run db:seed`
- Check database has users table
- Try creating a new user via `/register`

## Next Steps

1. **Add Real Products** - Replace sample products with your inventory
2. **Upload Images** - Add high-quality product photos
3. **Customize Design** - Match your brand aesthetic
4. **Set Up Email** - Configure order confirmation emails
5. **Test Everything** - Go through the entire purchase flow
6. **Launch** - Deploy to production and start selling!

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or questions

Happy selling! 🚀
