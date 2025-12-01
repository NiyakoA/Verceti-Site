# Complete Setup Guide

## What's Been Built

Your Verceti streetwear e-commerce platform includes:

### ✅ Core Features
- Product catalog with variants (size, color)
- Shopping cart with inventory reservations
- Stripe payment integration
- User authentication (login/register)
- Order management
- Product reviews
- Discount codes

### ✅ Drop Engine
- Timed product launches
- Countdown timers
- Early access system
- Automatic drop activation (via cron)

### ✅ Admin Dashboard
- Product management (CRUD)
- Order management
- Drop scheduling
- Discount code creation
- Analytics dashboard

### ✅ Technical Features
- Server-side rendering (SSR)
- Image optimization
- Mobile-responsive design
- Real-time inventory tracking
- Atomic database transactions
- SEO optimization

## What You Need to Add

### 1. Product Images
**Current State**: Placeholder images
**Action Required**:
- Take/source high-quality product photos
- Upload to a CDN (recommended: Cloudinary or Vercel Blob)
- Update image URLs in database

**Quick Solution**:
```bash
# Use Cloudinary (free tier)
npm install cloudinary
# Or use Vercel Blob
npm install @vercel/blob
```

### 2. Product Content
**Current State**: Sample products
**Action Required**:
- Add your actual products via admin dashboard
- Write compelling product descriptions
- Set accurate pricing
- Configure size guides

**Access**: http://localhost:3000/admin/products

### 3. Brand Customization
**Files to Edit**:
- `app/layout.tsx` - Site title, description
- `components/layout/header.tsx` - Logo, navigation
- `app/page.tsx` - Homepage content
- `tailwind.config.ts` - Brand colors

### 4. Email Configuration
**Current State**: Not configured
**Action Required**:
```bash
npm install resend
# Or use SendGrid
npm install @sendgrid/mail
```

Create `lib/services/email.ts`:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order: any) {
  await resend.emails.send({
    from: 'orders@verceti.us',
    to: order.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `<h1>Thank you for your order!</h1>...`,
  })
}
```

### 5. Stripe Configuration
**Current State**: Keys needed
**Steps**:
1. Create Stripe account: https://dashboard.stripe.com/register
2. Get test API keys
3. Add to `.env`
4. Test with test cards

**Webhook Setup** (for production):
1. Deploy to Vercel first
2. Add webhook: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to environment variables

### 6. Database Setup
**Options**:

**A. Vercel Postgres** (Easiest for Vercel deployment)
```bash
# In Vercel dashboard:
# Storage → Create Database → Postgres
# Copy connection string to .env
```

**B. Supabase** (Free tier, includes auth)
```bash
# 1. Create project at supabase.com
# 2. Get connection string from Settings → Database
# 3. Add to .env
```

**C. Railway** (Simple, generous free tier)
```bash
# 1. Create project at railway.app
# 2. Add PostgreSQL service
# 3. Copy connection string
```

## Environment Variables Checklist

Create `.env` with these values:

```env
# ✅ Database (REQUIRED)
DATABASE_URL="postgresql://..."

# ✅ NextAuth (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"  # Change for production
NEXTAUTH_SECRET=""  # Generate: openssl rand -base64 32

# ✅ Stripe (REQUIRED for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # After webhook setup

# ⚠️ Email (OPTIONAL but recommended)
EMAIL_FROM="noreply@verceti.us"
RESEND_API_KEY="re_..."

# ⚠️ Cron Security (OPTIONAL for production)
CRON_SECRET="any-random-string"

# ⚠️ App URL (OPTIONAL)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## First-Time Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Initialize database
npm run db:push

# 4. Seed sample data
npm run db:seed

# 5. Run development server
npm run dev
```

## Testing Checklist

### Before Launch
- [ ] Create a product with variants
- [ ] Add product to cart
- [ ] Complete checkout with Stripe test card
- [ ] Verify order appears in admin
- [ ] Test discount code
- [ ] Create a drop and verify countdown
- [ ] Test user registration and login
- [ ] Check mobile responsiveness
- [ ] Test all admin functions

### Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database set up and accessible
- [ ] Stripe keys (production mode)
- [ ] Build succeeds locally: `npm run build`
- [ ] All tests pass

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Set up custom domain (optional)
6. Configure Stripe webhook with production URL

### Post-Deployment
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Set up Stripe production webhook
- [ ] Test complete purchase flow
- [ ] Verify cron jobs are running
- [ ] Check admin dashboard access

## File Structure Reference

```
verceti-store/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── cart/         # Cart operations
│   │   ├── products/     # Product endpoints
│   │   ├── drops/        # Drop endpoints
│   │   └── cron/         # Scheduled jobs
│   ├── admin/            # Admin dashboard
│   ├── products/         # Product pages
│   ├── drops/            # Drops page
│   ├── cart/             # Cart page
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/
│   ├── layout/           # Header, footer
│   ├── products/         # Product components
│   └── drops/            # Drop components
├── lib/
│   ├── services/         # Business logic
│   │   ├── cart.ts       # Cart service
│   │   ├── inventory.ts  # Inventory management
│   │   ├── order.ts      # Order service
│   │   ├── product.ts    # Product service
│   │   └── drop.ts       # Drop service
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Sample data
```

## Common Customizations

### Change Site Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Add Social Links
Edit `components/layout/footer.tsx`

### Modify Homepage
Edit `app/page.tsx`

### Add New Product Categories
Just use them when creating products - they're dynamic!

### Change Shipping Calculation
Edit `lib/services/cart.ts` → `calculateTotals()`

### Modify Tax Rate
Edit `lib/services/cart.ts` → `calculateTotals()` (currently 8%)

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Stripe: https://stripe.com/docs
- NextAuth: https://next-auth.js.org

### Getting Help
- Check README.md for detailed docs
- Review QUICKSTART.md for common tasks
- Open GitHub issue for bugs

## Security Notes

### Production Checklist
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Protect cron endpoints with `CRON_SECRET`
- [ ] Use Stripe production keys (not test)
- [ ] Set secure cookie settings
- [ ] Enable rate limiting (consider Vercel Edge Config)
- [ ] Regular database backups

### Best Practices
- Never commit `.env` file
- Rotate secrets regularly
- Use environment variables for all secrets
- Keep dependencies updated
- Monitor error logs (use Sentry)

## Performance Optimization

Already implemented:
- ✅ Server-side rendering
- ✅ Image optimization
- ✅ Database indexing
- ✅ Efficient queries

Consider adding:
- Redis for caching
- CDN for images (Cloudinary)
- Database connection pooling
- Edge functions for geolocation

## What's Next?

1. **Week 1**: Set up database, add products, test locally
2. **Week 2**: Customize design, add images, configure Stripe
3. **Week 3**: Test thoroughly, deploy to Vercel
4. **Week 4**: Launch, monitor, iterate

Good luck with your store! 🚀
