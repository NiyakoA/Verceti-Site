# 🚀 Supabase Setup Guide (2 Minutes)

Follow these steps to get your free PostgreSQL database from Supabase.

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"** (green button)
3. Sign up with:
   - GitHub (recommended - one click)
   - Or email/password

## Step 2: Create New Project

1. After signing in, click **"New Project"**
2. Fill in the form:
   - **Name**: `verceti-store` (or any name you like)
   - **Database Password**: Create a strong password
     - **IMPORTANT**: Save this password! You'll need it in Step 4
     - Example: `MySecurePass123!`
   - **Region**: Choose closest to you (e.g., US East, Europe West)
   - **Pricing Plan**: Free (already selected)

3. Click **"Create new project"**
4. Wait 1-2 minutes while Supabase sets up your database
   - You'll see a progress indicator
   - Don't close the page!

## Step 3: Get Your Connection String

1. Once setup is complete, you'll see your project dashboard
2. Click **"Settings"** in the left sidebar (gear icon at bottom)
3. Click **"Database"** in the settings menu
4. Scroll down to **"Connection string"** section
5. Click the **"URI"** tab (not "Connection pooling")
6. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```
7. Click the **copy icon** to copy it
8. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the actual password you created in Step 2

**Example:**
```
Before: postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
After:  postgresql://postgres:MySecurePass123!@db.abc123.supabase.co:5432/postgres
```

## Step 4: Update Your .env File

1. Open `verceti-store/.env` in your code editor
2. Find this line:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/verceti_store?schema=public"
   ```
3. Replace it with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:MySecurePass123!@db.abc123.supabase.co:5432/postgres"
   ```
4. **Save the file**

## Step 5: Generate NEXTAUTH_SECRET

While you're editing .env, let's also set up the auth secret:

**On Mac/Linux/Git Bash:**
```bash
openssl rand -base64 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and update .env:
```env
NEXTAUTH_SECRET="paste-your-generated-secret-here"
```

## Step 6: Initialize Your Database

Now run these commands in your terminal:

```bash
# Make sure you're in the verceti-store folder
cd verceti-store

# Generate Prisma client
npx prisma generate

# Push database schema to Supabase
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
✓ Seed completed!
```

## Step 7: Start Your App

```bash
npm run dev
```

Open http://localhost:3000 and login:
- **Email**: `admin@verceti.us`
- **Password**: `admin123`

## ✅ Success!

You should now be able to:
- Login to your store
- Access the admin dashboard at http://localhost:3000/admin
- See sample products
- Add items to cart

## 🎯 What You Just Did

- ✅ Created a free PostgreSQL database on Supabase
- ✅ Connected your app to the database
- ✅ Set up authentication
- ✅ Initialized the database with tables
- ✅ Added sample data (products, users, etc.)

## 📊 View Your Database (Optional)

Want to see your data in Supabase?

1. Go back to your Supabase project dashboard
2. Click **"Table Editor"** in the left sidebar
3. You'll see all your tables: Product, User, Order, etc.
4. Click any table to view/edit data

Or use Prisma Studio locally:
```bash
npm run db:studio
```

## 🔧 Troubleshooting

### "Can't reach database server"

**Check:**
1. Is your connection string correct in .env?
2. Did you replace `[YOUR-PASSWORD]` with your actual password?
3. Are there any special characters in your password that need escaping?

**Fix:**
- Go back to Supabase → Settings → Database
- Copy the connection string again
- Make sure to replace the password placeholder

### "Authentication failed"

**Your password might have special characters that need escaping.**

**Solution:**
1. Go to Supabase → Settings → Database
2. Click "Reset database password"
3. Use a simpler password (letters and numbers only)
4. Update your connection string in .env

### "Prisma generate failed"

**Make sure:**
1. You saved the .env file
2. DATABASE_URL is on one line (no line breaks)
3. The connection string starts with `postgresql://`

### Still having issues?

1. Check that your Supabase project is fully initialized (green checkmark)
2. Try copying the connection string again
3. Make sure there are no extra spaces in .env
4. Restart your terminal and try again

## 💡 Pro Tips

### Free Tier Limits
- **Database size**: 500 MB (plenty for starting out)
- **Bandwidth**: 5 GB/month
- **API requests**: Unlimited
- **Projects**: 2 free projects

### Upgrade Later
When you're ready to scale:
- Pro plan: $25/month (8 GB database, 250 GB bandwidth)
- You can upgrade anytime from the Supabase dashboard

### Backup Your Data
Supabase automatically backs up your database daily on paid plans.
For free tier, you can export data anytime:
1. Supabase Dashboard → Database → Backups
2. Or use: `npx prisma db pull` to save schema locally

## 🎉 Next Steps

Now that your database is set up:

1. **Explore the admin dashboard**: http://localhost:3000/admin
2. **Add your products**: Admin → Products → Add New
3. **Customize the design**: Edit components in `components/` folder
4. **Set up Stripe**: Get API keys from Stripe dashboard
5. **Deploy**: Push to GitHub and deploy on Vercel

See **START_HERE.md** for next steps!

---

**Questions?** Check **TROUBLESHOOTING.md** for more help.

**Your Supabase Dashboard**: https://supabase.com/dashboard/projects
