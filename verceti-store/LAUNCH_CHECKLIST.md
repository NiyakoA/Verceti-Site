# 🚀 Launch Checklist

Use this checklist to track your progress from setup to launch.

## Phase 1: Initial Setup (Day 1)

### Database Setup
- [ ] Choose database provider (Vercel Postgres, Supabase, Railway, or Neon)
- [ ] Create database
- [ ] Copy connection string
- [ ] Add `DATABASE_URL` to `.env`

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Generate `NEXTAUTH_SECRET` (run: `openssl rand -base64 32`)
- [ ] Add `NEXTAUTH_URL` (http://localhost:3000 for now)
- [ ] Add `CRON_SECRET` (any random string)

### First Run
- [ ] Run `npm install`
- [ ] Run `npm run db:push`
- [ ] Run `npm run db:seed`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Login with admin@verceti.us / admin123

## Phase 2: Stripe Setup (Day 1-2)

### Get Stripe Keys
- [ ] Create Stripe account at https://dashboard.stripe.com/register
- [ ] Go to Developers → API Keys
- [ ] Copy Publishable key (starts with `pk_test_`)
- [ ] Copy Secret key (starts with `sk_test_`)
- [ ] Add both to `.env`

### Test Payments
- [ ] Add a product to cart
- [ ] Go to checkout
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete purchase
- [ ] Verify order in admin dashboard
- [ ] Check Stripe dashboard for payment

## Phase 3: Content & Branding (Day 2-5)

### Branding
- [ ] Update site title in `app/layout.tsx`
- [ ] Update logo in `components/layout/header.tsx`
- [ ] Customize colors in `tailwind.config.ts`
- [ ] Update homepage content in `app/page.tsx`
- [ ] Update footer links in `components/layout/footer.tsx`

### Add Your Products
- [ ] Go to http://localhost:3000/admin/products
- [ ] Click "Add Product" (or use Prisma Studio)
- [ ] Add product name and description
- [ ] Set price
- [ ] Add variants (sizes, colors)
- [ ] Set inventory levels
- [ ] Add size guide (optional)

### Product Images
- [ ] Choose image hosting (Cloudinary recommended)
- [ ] Upload product photos
- [ ] Update image URLs in database
- [ ] Test images display correctly

### Content Pages
- [ ] Create About page
- [ ] Create Shipping Info page
- [ ] Create Returns Policy page
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page

## Phase 4: Testing (Day 5-7)

### Customer Flow
- [ ] Browse products
- [ ] View product details
- [ ] Select variant (size/color)
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Apply discount code (use WELCOME10)
- [ ] Complete checkout
- [ ] Verify order confirmation

### User Accounts
- [ ] Register new account
- [ ] Login
- [ ] View order history
- [ ] Logout
- [ ] Login again

### Admin Functions
- [ ] Create product
- [ ] Edit product
- [ ] Update inventory
- [ ] View orders
- [ ] Update order status
- [ ] Create discount code
- [ ] Schedule a drop
- [ ] View analytics

### Mobile Testing
- [ ] Test on phone
- [ ] Check navigation menu
- [ ] Test product browsing
- [ ] Test cart
- [ ] Test checkout
- [ ] Verify responsive design

### Edge Cases
- [ ] Try to add out-of-stock item
- [ ] Try invalid discount code
- [ ] Try expired discount code
- [ ] Test with empty cart
- [ ] Test with multiple items

## Phase 5: Pre-Launch (Day 7-10)

### Email Setup (Optional but Recommended)
- [ ] Choose email provider (Resend recommended)
- [ ] Install package: `npm install resend`
- [ ] Add API key to `.env`
- [ ] Create email templates
- [ ] Test order confirmation email

### SEO Optimization
- [ ] Add meta descriptions to all pages
- [ ] Add Open Graph images
- [ ] Create sitemap
- [ ] Add structured data
- [ ] Test with Google Search Console

### Performance Check
- [ ] Run `npm run build`
- [ ] Check for build errors
- [ ] Test production build locally
- [ ] Check Lighthouse scores
- [ ] Optimize images if needed

### Security Review
- [ ] Verify `.env` is in `.gitignore`
- [ ] Check no secrets in code
- [ ] Test admin access control
- [ ] Verify HTTPS will be enabled
- [ ] Review Stripe security settings

## Phase 6: Deployment (Day 10-12)

### Prepare for Deploy
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Connect GitHub repository

### Deploy to Vercel
- [ ] Import project in Vercel
- [ ] Add all environment variables
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Deploy

### Post-Deploy Configuration
- [ ] Set up custom domain (optional)
- [ ] Configure DNS records
- [ ] Verify HTTPS is working
- [ ] Test production site

### Stripe Production Setup
- [ ] Switch to Stripe production mode
- [ ] Get production API keys
- [ ] Update keys in Vercel environment variables
- [ ] Set up production webhook
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Copy webhook secret to Vercel
- [ ] Redeploy to apply changes

## Phase 7: Launch Day! 🎉

### Final Checks
- [ ] Test complete purchase flow on production
- [ ] Verify order appears in admin
- [ ] Check Stripe payment received
- [ ] Test on mobile device
- [ ] Verify all pages load
- [ ] Check all links work

### Monitoring Setup
- [ ] Set up error monitoring (Sentry)
- [ ] Configure Google Analytics
- [ ] Set up uptime monitoring
- [ ] Enable Vercel Analytics

### Go Live
- [ ] Announce on social media
- [ ] Send email to mailing list
- [ ] Update all marketing materials
- [ ] Monitor for errors
- [ ] Be ready to respond to issues

## Phase 8: Post-Launch (Week 1-2)

### Monitor & Optimize
- [ ] Check error logs daily
- [ ] Monitor order flow
- [ ] Respond to customer questions
- [ ] Fix any bugs quickly
- [ ] Gather user feedback

### Marketing
- [ ] Create social media content
- [ ] Plan first drop
- [ ] Build email list
- [ ] Engage with customers
- [ ] Share user-generated content

### Iterate
- [ ] Analyze what's working
- [ ] Improve product descriptions
- [ ] Add more products
- [ ] Optimize checkout flow
- [ ] Improve site speed

## Optional Enhancements

### Nice to Have
- [ ] Add wishlist feature
- [ ] Implement product search
- [ ] Add product recommendations
- [ ] Create blog
- [ ] Add live chat support
- [ ] Implement loyalty program
- [ ] Add gift cards
- [ ] Multi-currency support
- [ ] International shipping

### Advanced Features
- [ ] A/B testing
- [ ] Advanced analytics
- [ ] Inventory forecasting
- [ ] Automated marketing emails
- [ ] SMS notifications
- [ ] Mobile app
- [ ] AR try-on

## Emergency Contacts

### If Something Goes Wrong
1. **Check Vercel Logs**: Vercel Dashboard → Your Project → Logs
2. **Check Stripe Dashboard**: Look for failed payments
3. **Check Database**: Use Prisma Studio to inspect data
4. **Rollback**: Vercel allows instant rollback to previous deployment

### Common Issues
- **Payment fails**: Check Stripe keys and webhook
- **Database error**: Verify connection string
- **Build fails**: Check for TypeScript errors
- **Images not loading**: Verify image URLs and CDN

## Success Metrics to Track

### Week 1
- [ ] Total orders
- [ ] Conversion rate
- [ ] Average order value
- [ ] Traffic sources
- [ ] Most popular products

### Month 1
- [ ] Revenue
- [ ] Customer acquisition cost
- [ ] Repeat customer rate
- [ ] Cart abandonment rate
- [ ] Customer feedback

## Notes & Reminders

- **Backup database regularly**
- **Keep dependencies updated**
- **Monitor Stripe for chargebacks**
- **Respond to customers quickly**
- **Test before major changes**
- **Celebrate small wins!**

---

## Quick Reference

### Login Credentials (Development)
- Admin: admin@verceti.us / admin123
- Customer: customer@example.com / customer123

### Important URLs
- Local: http://localhost:3000
- Admin: http://localhost:3000/admin
- Prisma Studio: http://localhost:5555 (run `npm run db:studio`)

### Useful Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run db:push          # Push schema to database
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio
```

### Test Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

---

**Remember**: Launch is just the beginning. Keep iterating and improving based on customer feedback!

Good luck! 🚀
