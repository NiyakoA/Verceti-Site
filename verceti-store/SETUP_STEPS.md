# 🚀 Setup Steps (Do This First!)

Follow these steps in order to get your store running.

## Step 1: Generate NEXTAUTH_SECRET

**On Mac/Linux/Git Bash:**
```bash
openssl rand -base64 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Copy the output** - you'll need it in Step 3.

## Step 2: Get a Database

### 🎯 Use Supabase (Recommended - Free & Easy)

**See SUPABASE_SETUP.md for detailed step-by-step guide with screenshots!**

Quick version:

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a free account
4. Click "New Project"
5. Fill in:
   - Name: `verceti-store`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
6. Wait 2 minutes for setup
7. Go to **Settings** → **Database**
8. Find "Connection string" section
9. Click **URI** tab
10. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
11. **Replace `[YOUR-PASSWORD]` with your actual password**

**Copy this URL** - you'll need it in Step 3.

### Option B: Other Free Options

- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Railway**: https://railway.app (click New → PostgreSQL)
- **Neon**: https://neon.tech (serverless PostgreSQL)

All provide a connection string you can copy.

## Step 3: Update .env File

1. Open `verceti-store/.env` in your editor
2. Find these lines and update them:

```env
# Replace this line:
DATABASE_URL="postgresql://user:password@localhost:5432/verceti_store?schema=public"
# With your actual database URL from Step 2:
DATABASE_URL="postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres"

# Replace this line:
NEXTAUTH_SECRET="CHANGE-ME-generate-a-random-secret-here"
# With the secret from Step 1:
NEXTAUTH_SECRET="Kj8fH3mN9pQ2rT5vW8xZ1aC4dE7gI0jL3mO6pR9sU2wY5zA8bC1eF4hG7iJ0kM3n"
```

3. Save the file

## Step 4: Initialize Database

Run these commands in order:

```bash
cd verceti-store

# Generate Prisma client
npx prisma generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

You should see:
```
✓ Generated Prisma Client
✓ Your database is now in sync with your Prisma schema
✓ Created admin user: admin@verceti.us
✓ Created customer user: customer@example.com
✓ Created product: Premium Hoodie
✓ Created discount code: WELCOME10
✓ Seed completed!
```

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.4
- Local:        http://localhost:3000
✓ Ready in 2.3s
```

## Step 6: Test It!

1. Open http://localhost:3000
2. Click "Login" in the header
3. Use these credentials:
   - Email: `admin@verceti.us`
   - Password: `admin123`
4. You should be logged in!
5. Go to http://localhost:3000/admin to see the admin dashboard

## ✅ Success!

If you can login and see the admin dashboard, everything is working!

## 🎯 What's Next?

Now you can:
1. Add your products (Admin → Products)
2. Customize the design
3. Set up Stripe for payments
4. Deploy to Vercel

See **START_HERE.md** for next steps.

## ❌ Troubleshooting

### "Prisma generate failed"
→ Make sure DATABASE_URL is set in .env

### "Can't reach database"
→ Check your database URL is correct
→ Make sure you replaced [YOUR-PASSWORD] with actual password

### "Invalid connection string"
→ Make sure URL starts with `postgresql://`
→ Check for typos

### "Module not found"
→ Run `npm install` first

### Still stuck?
→ See **TROUBLESHOOTING.md** for detailed help
→ Or **FIX_NEXTAUTH_ERROR.md** for the specific error you saw

---

**Quick Checklist:**
- [ ] Generated NEXTAUTH_SECRET
- [ ] Got database URL from Supabase (or other)
- [ ] Updated .env file with both values
- [ ] Ran `npx prisma generate`
- [ ] Ran `npm run db:push`
- [ ] Ran `npm run db:seed`
- [ ] Ran `npm run dev`
- [ ] Can login at http://localhost:3000

**Need help?** Check TROUBLESHOOTING.md
