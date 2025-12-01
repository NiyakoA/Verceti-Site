# 🔴 Fix NextAuth Error

You're seeing this error:
```
[next-auth][error][CLIENT_FETCH_ERROR] 
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

## Quick Fix (2 minutes)

### Step 1: Generate NEXTAUTH_SECRET

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output.

### Step 2: Update .env File

Open `verceti-store/.env` and replace this line:
```env
NEXTAUTH_SECRET="CHANGE-ME-generate-a-random-secret-here"
```

With:
```env
NEXTAUTH_SECRET="your-generated-secret-from-step-1"
```

### Step 3: Set Up Database

You need a PostgreSQL database. Choose one:

#### Option A: Local PostgreSQL (if installed)
```bash
# Create database
createdb verceti_store

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/verceti_store"
```

#### Option B: Free Cloud Database (Recommended)

**Supabase (Easiest):**
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" (URI format)
6. Add to .env as DATABASE_URL

**Or use:**
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Railway: https://railway.app
- Neon: https://neon.tech

### Step 4: Initialize Database

```bash
cd verceti-store
npm run db:push
npm run db:seed
```

### Step 5: Restart Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 6: Test

Visit http://localhost:3000 and try logging in:
- Email: `admin@verceti.us`
- Password: `admin123`

## Still Not Working?

### Check Your .env File

Make sure it has these three lines with real values:
```env
DATABASE_URL="postgresql://..."  # Real database URL
NEXTAUTH_SECRET="..."            # Generated secret (not the placeholder)
NEXTAUTH_URL="http://localhost:3000"
```

### Verify Database Connection

```bash
npm run db:studio
```

If this opens a browser window, your database is connected!

### Check for Errors

Look in your terminal for any error messages. Common ones:

**"Can't reach database"**
→ DATABASE_URL is wrong or database isn't running

**"Invalid connection string"**
→ Check DATABASE_URL format

**"Authentication failed"**
→ Check database username/password

## Complete Example .env

Here's what a working .env looks like:

```env
# Real Supabase example:
DATABASE_URL="postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres"

# Generated secret:
NEXTAUTH_SECRET="Kj8fH3mN9pQ2rT5vW8xZ1aC4dE7gI0jL3mO6pR9sU2wY5zA8bC1eF4hG7iJ0kM3n"

# Local URL:
NEXTAUTH_URL="http://localhost:3000"

# Stripe (optional for now):
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

## Need More Help?

See **TROUBLESHOOTING.md** for detailed solutions to common issues.

---

**TL;DR:**
1. Generate NEXTAUTH_SECRET and add to .env
2. Get a PostgreSQL database URL and add to .env
3. Run `npm run db:push` and `npm run db:seed`
4. Restart dev server
5. Login with admin@verceti.us / admin123
