#!/usr/bin/env node

// Simple setup checker for Verceti Store

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Verceti Store Setup...\n');

let allGood = true;

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found');
  console.log('   → Copy .env.example to .env and configure it');
  allGood = false;
} else {
  console.log('✅ .env file exists');
  
  // Check if DATABASE_URL is set
  const envContent = fs.readFileSync('.env', 'utf8');
  
  if (!envContent.includes('DATABASE_URL=') || envContent.includes('DATABASE_URL="postgresql://user:password@localhost')) {
    console.log('❌ DATABASE_URL not configured in .env');
    console.log('   → See SUPABASE_SETUP.md to get your database URL');
    allGood = false;
  } else {
    console.log('✅ DATABASE_URL is configured');
  }
  
  if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.includes('NEXTAUTH_SECRET="CHANGE-ME')) {
    console.log('❌ NEXTAUTH_SECRET not configured in .env');
    console.log('   → Run: openssl rand -base64 32');
    console.log('   → Add the output to .env as NEXTAUTH_SECRET');
    allGood = false;
  } else {
    console.log('✅ NEXTAUTH_SECRET is configured');
  }
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('❌ Dependencies not installed');
  console.log('   → Run: npm install');
  allGood = false;
} else {
  console.log('✅ Dependencies installed');
}

// Check if Prisma client is generated
if (!fs.existsSync('node_modules/.prisma/client')) {
  console.log('❌ Prisma client not generated');
  console.log('   → Run: npx prisma generate');
  allGood = false;
} else {
  console.log('✅ Prisma client generated');
}

console.log('\n' + '='.repeat(60) + '\n');

if (allGood) {
  console.log('🎉 Setup looks good! You can run: npm run dev\n');
  console.log('If you haven\'t seeded the database yet, run:');
  console.log('   npm run db:push');
  console.log('   npm run db:seed\n');
} else {
  console.log('⚠️  Setup incomplete. Follow these steps:\n');
  console.log('1. See SUPABASE_SETUP.md for database setup');
  console.log('2. Update your .env file with DATABASE_URL and NEXTAUTH_SECRET');
  console.log('3. Run: npm install');
  console.log('4. Run: npx prisma generate');
  console.log('5. Run: npm run db:push');
  console.log('6. Run: npm run db:seed');
  console.log('7. Run: npm run dev\n');
}

console.log('📚 Documentation:');
console.log('   → SUPABASE_SETUP.md    - Database setup guide');
console.log('   → SETUP_STEPS.md       - Complete setup guide');
console.log('   → TROUBLESHOOTING.md   - Fix common issues\n');
