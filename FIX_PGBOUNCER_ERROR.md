# 🔧 Fix: pgBouncer "Prepared Statement Already Exists" Error

## The Problem

You're seeing this error:
```
prepared statement "s1" already exists
```

This happens when using **Supabase's pgBouncer** (connection pooler) with Prisma. pgBouncer in transaction mode doesn't support prepared statements properly.

## ✅ Quick Fix - Update Your Environment Variables

### Option 1: Add pgBouncer Parameter (Recommended)

Update your `DATABASE_URL` to include the `pgbouncer=true` and `connection_limit=1` parameters:

**In your Vercel/deployment environment variables:**

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Option 2: Use Session Mode in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Database** → **Settings**
3. Change **Pool Mode** from "Transaction" to "Session"
4. Update your connection string:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres"
```

Note: Port changes from 5432 to 6543 for direct pooler connection.

### Option 3: Disable pgBouncer for Application Queries

Use the direct connection (without pgBouncer) for your application:

```env
# Use direct connection (port 5432, no pgbouncer parameter)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Keep DIRECT_URL the same
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

⚠️ **Warning**: This may use more database connections but avoids prepared statement issues.

---

## 🚀 Apply the Fix

### For Vercel:

1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `DATABASE_URL` with the new value (add `connection_limit=1`)
5. **Redeploy** your application

### For Other Platforms:

1. Update your environment variables in your hosting platform
2. Redeploy or restart your application

---

## 🧪 Test the Fix

After redeploying:

1. Go to your **Pets** page
2. Try to add a new pet with a photo
3. The AI should identify the breed
4. The pet should now appear in your "My Pets" section
5. No more "prepared statement" errors!

---

## 📋 Understanding the Issue

### What is pgBouncer?

pgBouncer is a **connection pooler** that sits between your app and PostgreSQL. Supabase uses it to manage many connections efficiently.

### Why Does This Happen?

- **Transaction Mode** (default): pgBouncer doesn't support prepared statements well
- Prisma tries to use prepared statements for performance
- This causes conflicts → "prepared statement already exists" error

### The Solutions Explained

| Solution | Pros | Cons |
|----------|------|------|
| **Add `pgbouncer=true` param** | ✅ Best of both worlds<br>✅ Uses connection pooling<br>✅ Prisma disables prepared statements | ⚠️ Slightly slower queries |
| **Switch to Session Mode** | ✅ Full PostgreSQL compatibility<br>✅ All features work | ⚠️ Uses more connections<br>⚠️ May hit connection limits |
| **Use Direct Connection** | ✅ No pgBouncer issues<br>✅ Full PostgreSQL features | ⚠️ Uses more connections<br>⚠️ Less efficient scaling |

---

## 🎯 Recommended Solution

**Use Option 1**: Add `pgbouncer=true&connection_limit=1` to your `DATABASE_URL`

This is the best balance of:
- ✅ Connection pooling efficiency
- ✅ Compatibility with Prisma
- ✅ Avoids prepared statement errors
- ✅ Works in production

---

## 🔍 Verify It's Working

### Check Your Logs

After redeploying, you should see:
- ✅ No more "prepared statement" errors
- ✅ Pets being created successfully
- ✅ Pets appearing in the list

### Test Query

If you can run queries directly, test:

```sql
-- Check if pets are being created
SELECT id, name, breed, created_at
FROM pets
ORDER BY created_at DESC
LIMIT 5;
```

---

## 💡 Additional Tips

### If You're Still Seeing Errors:

1. **Clear your deployment cache** and rebuild
2. **Check both `DATABASE_URL` and `DIRECT_URL`** are set correctly
3. **Verify Supabase connection string** matches your project
4. **Check pgBouncer mode** in Supabase dashboard

### For Local Development:

Update your `.env` file:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

---

## 📚 More Resources

- [Prisma with pgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [pgBouncer Documentation](https://www.pgbouncer.org/)

---

## ✅ Summary

**Quick Fix:**
```env
DATABASE_URL="...?pgbouncer=true&connection_limit=1"
```

Then redeploy your application. The prepared statement error will be gone! 🎉
