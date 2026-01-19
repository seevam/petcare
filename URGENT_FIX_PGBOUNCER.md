# 🚨 URGENT: Fix pgBouncer "Prepared Statement" Error

## Your Current Error

```
prepared statement "s0" already exists
```

This error means your **DATABASE_URL is still using pgBouncer in transaction mode**, which doesn't work with Prisma.

---

## ✅ IMMEDIATE FIX - Update Environment Variable

### Go to Your Vercel Dashboard RIGHT NOW:

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Find `DATABASE_URL`**

3. **Check what you currently have**. It probably looks like:
   ```
   postgresql://...@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://...@db.xxx.supabase.co:5432/postgres?pgbouncer=true
   ```

4. **REPLACE with one of these options:**

### Option A: Direct Connection (RECOMMENDED - Easiest)

**Remove pgBouncer completely:**

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Key changes:**
- Port: `5432`
- Host: `db.[PROJECT].supabase.co` (NOT the pooler URL)
- NO `?pgbouncer=true`
- NO `:6543`

### Option B: Session Pooler (If you need connection pooling)

**Use Session Mode (port 6543):**

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**Key changes:**
- Port: `6543` (session pooler)
- Add `?pgbouncer=true` parameter
- Host: `db.[PROJECT].supabase.co`

---

## 🔍 How to Get the Correct Connection String

### From Supabase Dashboard:

1. Go to **Supabase.com** → Your Project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection String** section
4. For **Option A**: Copy the **URI** connection string (port 5432)
5. For **Option B**: Look for **Connection Pooling** → Session Mode (port 6543)

---

## ⚠️ Common Mistakes to Avoid

| ❌ WRONG | Why It Fails |
|----------|--------------|
| `aws-1-us-east-1.pooler.supabase.com:6543` without `?pgbouncer=true` | Transaction mode doesn't support prepared statements |
| `db.xxx.supabase.co:5432/postgres?pgbouncer=true` | Port 5432 shouldn't have pgbouncer parameter |
| `postgres&connection_limit=1` | Invalid parameter, not a PostgreSQL option |

| ✅ CORRECT | Why It Works |
|------------|--------------|
| `db.xxx.supabase.co:5432/postgres` | Direct connection, no pooler, full support |
| `db.xxx.supabase.co:6543/postgres?pgbouncer=true` | Session mode pooler, supports prepared statements |

---

## 🚀 After Updating

1. **Save** the environment variable
2. **Redeploy** your application (or it may auto-deploy)
3. **Wait 1-2 minutes** for deployment to complete
4. **Test** by adding a pet with a photo

---

## 🧪 Verify It's Fixed

After redeployment:

### Test 1: View Pets Page
- Go to your app
- Navigate to "My Pets" or Dashboard
- Should load without errors

### Test 2: Add a Pet
- Click "Add Pet"
- Upload a photo
- AI should identify the breed
- Pet should save successfully
- Pet appears in your list

### Success Indicators:
- ✅ No "prepared statement" errors in logs
- ✅ Pages load normally
- ✅ Pets can be created
- ✅ Pets appear in the list

---

## 📋 What I've Done in the Code

I've added a **safety check** in `src/lib/prisma.ts` that automatically adds `?pgbouncer=true` if it detects port 6543. This provides a fallback, but **you still need to update your DATABASE_URL** for the best results.

---

## 💡 Quick Reference

### Your Current Setup (Based on Error):
- Using pgBouncer transaction mode
- Port 6543 or 5432 with pgbouncer parameter
- Prepared statements failing

### What You Need:
**Pick ONE:**

1. **Simple/Direct** (best for most apps):
   ```
   postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres
   ```

2. **With Pooling** (high-traffic apps):
   ```
   postgresql://postgres:[PASS]@db.[REF].supabase.co:6543/postgres?pgbouncer=true
   ```

---

## 🆘 Still Not Working?

### Check These:

1. **Correct password**: Make sure your password is correct
2. **Correct project reference**: Verify `[PROJECT-REF]` matches your Supabase project
3. **URL encoding**: If password has special characters, they need to be URL-encoded
4. **Both variables**: Update both `DATABASE_URL` and `DIRECT_URL`
5. **Redeploy**: Make sure you actually redeployed after changing the variable

### Get Your Exact Connection String:

Run this SQL in Supabase SQL Editor:
```sql
SHOW server_version;
```

If it works, your connection is good. Then copy the exact connection string from Supabase settings.

---

## ✅ Bottom Line

**DO THIS NOW:**

1. Go to Vercel → Settings → Environment Variables
2. Update `DATABASE_URL` to use port 5432 WITHOUT `?pgbouncer=true`
3. Update `DIRECT_URL` to the same value
4. Redeploy
5. Test

**Simple connection string:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
```

That's it! No pgbouncer, no fancy parameters, just works. 🎉
