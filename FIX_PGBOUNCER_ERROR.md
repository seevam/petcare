# 🔧 Fix: pgBouncer "Prepared Statement Already Exists" Error

## The Problem

You're seeing this error:
```
prepared statement "s1" already exists
```

This happens when using **Supabase's pgBouncer** (connection pooler) with Prisma in transaction mode.

## ✅ Simple Fix - Update Your DATABASE_URL

### **Recommended Solution: Use Direct Connection**

The simplest fix is to **remove pgBouncer** from your connection string:

**Update your `DATABASE_URL` in Vercel/deployment settings:**

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

**Key changes:**
- ✅ Port: **5432** (direct connection, not 6543)
- ✅ Remove `?pgbouncer=true` parameter
- ✅ Use same URL for both DATABASE_URL and DIRECT_URL

---

## 🚀 How to Apply the Fix

### For Vercel:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Find `DATABASE_URL`
4. **Update to:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
   ```
5. **Remove any** `?pgbouncer=true` or other parameters
6. **Redeploy** your application

### For Other Platforms:

Same steps - update your `DATABASE_URL` environment variable and redeploy.

---

## 🎯 Alternative: Use Session Pooler (If you need pooling)

If you need connection pooling, use Supabase's **Session Pooler** instead:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

**Changes:**
- ✅ Port: **6543** (session pooler port)
- ✅ Keep `?pgbouncer=true`
- ✅ Use direct connection (5432) for DIRECT_URL

---

## 📋 Understanding the Issue

### Why Does This Happen?

| Mode | Port | Prepared Statements | Issue |
|------|------|---------------------|-------|
| **Transaction Mode** | 5432 with `?pgbouncer=true` | ❌ Not supported | Causes "prepared statement exists" error |
| **Session Mode** | 6543 with `?pgbouncer=true` | ✅ Supported | Works with Prisma |
| **Direct Connection** | 5432 without pgbouncer | ✅ Fully supported | Best for simplicity |

### The Solutions

| Solution | Pros | Cons | Recommended |
|----------|------|------|-------------|
| **Direct Connection** | ✅ No issues<br>✅ Simple setup<br>✅ Full PostgreSQL support | ⚠️ More connections used | ⭐ **Yes** - Best for most apps |
| **Session Pooler (6543)** | ✅ Connection pooling<br>✅ Works with Prisma | ⚠️ Slightly more setup | ✅ For high-traffic apps |

---

## 🧪 Test After Update

After updating your environment variable and redeploying:

1. ✅ Go to your app's **Add Pet** page
2. ✅ Upload a pet photo
3. ✅ AI identifies the breed correctly
4. ✅ Pet is saved to database
5. ✅ Pet appears in "My Pets" section
6. ✅ No more "prepared statement" errors!

---

## 🔍 Verify Your Connection String

### ❌ Wrong (causes errors):
```env
# Port 5432 with pgbouncer parameter - transaction mode doesn't work
DATABASE_URL="postgresql://...@db.xxx.supabase.co:5432/postgres?pgbouncer=true"

# Invalid parameter - connection_limit is not a PostgreSQL parameter
DATABASE_URL="postgresql://...@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

### ✅ Correct (recommended):
```env
# Direct connection - no pgbouncer parameter
DATABASE_URL="postgresql://...@db.xxx.supabase.co:5432/postgres"
```

### ✅ Also Correct (with session pooler):
```env
# Port 6543 with pgbouncer parameter - session mode works
DATABASE_URL="postgresql://...@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
```

---

## 💡 Quick Reference

### Get Your Supabase Connection Strings

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection String**
4. Use the **URI** format

**For direct connection:** Copy the connection string as-is (port 5432)

**For session pooler:**
- Go to **Connection Pooling** section
- Use **Session Mode** connection string (port 6543)

---

## 🐛 Still Having Issues?

### Error: "Database does not exist"
- Check your connection string is correct
- Make sure password is URL-encoded if it contains special characters
- Verify project reference in Supabase dashboard

### Error: "Prepared statement already exists"
- Remove `?pgbouncer=true` from port 5432 connection
- Or switch to port 6543 with `?pgbouncer=true`

### Pets still not saving
- Check your Supabase database logs
- Verify `coat_type` and `coat_colors` columns exist
- Run this SQL to verify:
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'pets' AND column_name IN ('coat_type', 'coat_colors');
  ```

---

## ✅ Summary

**Quick Fix (Most Apps):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

Remove any `?pgbouncer=true` or `&connection_limit=1` parameters, then redeploy.

**High-Traffic Apps (Need Pooling):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true"
```

Use port **6543** (session pooler) with `?pgbouncer=true`.

---

## 📚 Resources

- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

After updating your DATABASE_URL and redeploying, everything should work perfectly! 🎉
