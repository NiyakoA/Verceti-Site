# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### NextAuth Error: "CLIENT_FETCH_ERROR"

**Error Message:**
```
[next-auth][error][CLIENT_FETCH_ERROR] 
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

**Cause:** This happens when the database isn't set up yet or environment variables are missing.

**Solution:**

1. **Check your .env file exists and has DATABASE_URL:**
   ```bash
   # Make sure .env file exists
   ls -la .env
   
   # It should contain:
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Generate NEXTAUTH_SECRET if missing:**
   ```bash
   # On Mac/Linux:
   openssl rand -base64 32
   
   # On Windows (PowerShell):
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```
   
   Add the output to your .env file as `NEXTAUTH_SECRET`

3. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Database Connection Error

**Error Message:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solutions:**

1. **Check DATABASE_URL format:**
   ```env
   # Correct format:
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # Example for local:
   DATABASE_URL="postgresql://postgres:password@localhost:5432/verceti_store"
   ```

2. **For cloud databases:**
   - **Vercel Postgres**: Copy connection string from Vercel dashboard
   - **Supabase**: Get from Settings → Database → Connection string
   - **Railway**: Copy from database service variables
   - **Neon**: Copy from connection details

3. **Test connection:**
   ```bash
   npm run db:studio
   # If this opens, your connection works!
   ```

### Can't Login / User Not Found

**Solutions:**

1. **Make sure you seeded the database:**
   ```bash
   npm run db:seed
   ```

2. **Check if users exist:**
   ```bash
   npm run db:studio
   # Look for User table and check if admin@verceti.us exists
   ```

3. **Try creating a new account:**
   - Go to http://localhost:3000/register
   - Create a new account
   - Try logging in with that

4. **Reset the database:**
   ```bash
   # Warning: This deletes all data!
   npm run db:push -- --force-reset
   npm run db:seed
   ```

### Build Errors

**Error: Module not found**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

**Error: Type errors**

**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# If you see errors, they need to be fixed before building
```

### Stripe Errors

**Error: "No API key provided"**

**Solution:**
Add Stripe keys to .env:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

Get keys from: https://dashboard.stripe.com/test/apikeys

**Error: "Invalid API Key"**

**Solution:**
- Make sure you're using TEST keys (pk_test_ and sk_test_)
- Check for extra spaces in .env file
- Restart dev server after adding keys

### Images Not Loading

**Issue:** Product images show "No Image"

**Solution:**
1. Images need to be uploaded to a CDN
2. Update image URLs in database
3. For now, you can use placeholder URLs:
   ```
   https://via.placeholder.com/400x400
   ```

### Port Already in Use

**Error:** "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill the process (Mac/Linux):
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

### Prisma Errors

**Error: "Schema file not found"**

**Solution:**
```bash
# Make sure you're in the verceti-store directory
cd verceti-store
npm run db:push
```

**Error: "Migration failed"**

**Solution:**
```bash
# Reset and try again
npx prisma migrate reset
npm run db:push
npm run db:seed
```

### Environment Variables Not Working

**Issue:** Changes to .env not taking effect

**Solution:**
1. Restart the dev server (Ctrl+C, then `npm run dev`)
2. Make sure .env is in the root of verceti-store folder
3. Check for typos in variable names
4. Don't use quotes around values unless they contain spaces

### Admin Access Denied

**Issue:** Can't access /admin routes

**Solution:**
1. Make sure you're logged in
2. Check user role in database:
   ```bash
   npm run db:studio
   # Find your user and set role to "admin"
   ```
3. Log out and log back in

### Cart Not Working

**Issue:** Items not adding to cart

**Solution:**
1. Check browser console for errors
2. Make sure products have variants with inventory > 0
3. Clear browser cookies and try again
4. Check if session_id cookie is being set

### Deployment Issues

**Build fails on Vercel**

**Solution:**
1. Check build logs for specific error
2. Make sure all environment variables are set in Vercel
3. Test build locally first: `npm run build`
4. Check that DATABASE_URL is accessible from Vercel

**Database connection fails in production**

**Solution:**
1. Make sure database allows connections from Vercel IPs
2. Use connection pooling (PgBouncer or Prisma Data Proxy)
3. Check database connection limits

## Quick Fixes

### Reset Everything
```bash
# Nuclear option - start fresh
rm -rf .next node_modules
npm install
npm run db:push -- --force-reset
npm run db:seed
npm run dev
```

### Check All Environment Variables
```bash
# Make sure these are set in .env:
cat .env | grep -E "DATABASE_URL|NEXTAUTH_SECRET|NEXTAUTH_URL"
```

### Verify Database Connection
```bash
# This should open Prisma Studio
npm run db:studio
```

### Test Stripe Connection
```bash
# Check if Stripe keys are valid
node -e "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); stripe.balance.retrieve().then(console.log).catch(console.error)"
```

## Still Having Issues?

### Check These Files
1. `.env` - All environment variables set?
2. `prisma/schema.prisma` - Schema looks correct?
3. `package.json` - All dependencies installed?

### Useful Commands
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if database is accessible
npx prisma db pull

# View all environment variables
printenv | grep -E "DATABASE|NEXTAUTH|STRIPE"
```

### Get More Info
```bash
# Run with debug mode
DEBUG=* npm run dev

# Check Prisma logs
npx prisma studio --browser none
```

## Prevention Tips

1. **Always restart dev server after .env changes**
2. **Run `npm run db:push` after schema changes**
3. **Keep dependencies updated**: `npm update`
4. **Clear .next cache if weird errors**: `rm -rf .next`
5. **Use `npm run db:studio` to inspect database**

## Need More Help?

1. Check the error message carefully
2. Search the error in the documentation
3. Check browser console for client-side errors
4. Check terminal for server-side errors
5. Review the code comments for hints

## Common Error Messages Decoded

| Error | Meaning | Fix |
|-------|---------|-----|
| `ECONNREFUSED` | Can't connect to database | Check DATABASE_URL |
| `MODULE_NOT_FOUND` | Missing dependency | Run `npm install` |
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `Invalid credentials` | Wrong email/password | Check seeded data or create new account |
| `Unauthorized` | Not logged in or wrong role | Login as admin |
| `Insufficient inventory` | Product out of stock | Update inventory in admin |

---

**Remember:** Most issues are solved by:
1. Checking .env file
2. Running `npm run db:push`
3. Restarting the dev server

Good luck! 🚀
