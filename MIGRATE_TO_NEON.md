# 🚀 Migrate from Supabase to Neon Database

## Why Neon?

✅ **No pgBouncer issues** - Works perfectly with Prisma
✅ **Better connection pooling** - Built-in pooling that Prisma understands
✅ **Serverless-first** - Designed for modern deployment platforms
✅ **Auto-scaling** - Scales down to zero when not in use (saves money)
✅ **Fast setup** - 2 minutes to get running

---

## 🎯 Quick Setup (New Database)

### Step 1: Create Neon Database

1. Go to **https://console.neon.tech**
2. Sign up/Login (free tier available)
3. Click **"New Project"**
4. Choose:
   - **Name**: petcare-db (or your preferred name)
   - **Region**: Choose closest to your users
   - **PostgreSQL version**: 16 (or latest)
5. Click **"Create Project"**

### Step 2: Get Connection Strings

After creating the project, you'll see the connection strings:

1. **Pooled connection** (for your app):
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require&pool=true
   ```
   Copy this for `DATABASE_URL`

2. **Direct connection** (for migrations):
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```
   Copy this for `DIRECT_URL`

**Tip**: You can toggle between "Pooled" and "Direct" connection in the Neon dashboard.

### Step 3: Update Environment Variables

**In Vercel/Your Hosting:**

1. Go to **Settings** → **Environment Variables**
2. Update `DATABASE_URL` with the **pooled connection string**
3. Update `DIRECT_URL` with the **direct connection string**
4. **Save** changes

### Step 4: Run Database Migrations

**Option A: Using Prisma Migrate (Recommended)**

```bash
# Set up your local .env first
cp .env.example .env
# Add your Neon connection strings to .env

# Run migrations to create all tables
npx prisma migrate deploy

# Or if starting fresh:
npx prisma migrate dev --name init
```

**Option B: Using SQL Directly**

1. Go to **Neon Console** → Your Project → **SQL Editor**
2. Run the schema creation SQL (I'll provide this below)

### Step 5: Verify Setup

```bash
# Generate Prisma Client
npx prisma generate

# Check if connection works
npx prisma db pull
```

### Step 6: Deploy

Push your changes and redeploy:
```bash
git push
```

Your app will redeploy and connect to Neon. **No more pgBouncer errors!** 🎉

---

## 📦 Migrate Data from Supabase (If You Have Existing Data)

### Option 1: Using pg_dump/pg_restore

**On your local machine:**

```bash
# 1. Export from Supabase
pg_dump "postgresql://postgres:[SUPABASE-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --no-owner --no-acl --clean --if-exists > backup.sql

# 2. Import to Neon
psql "postgresql://[NEON-USER]:[NEON-PASSWORD]@[NEON-HOST]/[NEON-DB]?sslmode=require" \
  < backup.sql
```

### Option 2: Manual Export/Import

**Export from Supabase:**

1. Go to **Supabase Dashboard** → **Database** → **Backups**
2. Create a manual backup
3. Download the backup file

**Import to Neon:**

1. Go to **Neon Console** → **SQL Editor**
2. Paste and run the SQL from your backup
3. Or use the import feature if available

### Option 3: Using Prisma (Small datasets)

```bash
# Export data to JSON (you'll need to write a script)
# Then import into new database
```

---

## 🗄️ Database Schema for Neon

If starting fresh, run this SQL in **Neon SQL Editor**:

```sql
-- Run the schema creation
-- (Copy your current schema from Prisma or Supabase)

-- Then add the coat fields if not already present:
ALTER TABLE pets
ADD COLUMN IF NOT EXISTS coat_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS coat_colors TEXT[];

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_pets_coat_type ON pets(coat_type);
CREATE INDEX IF NOT EXISTS idx_pets_coat_colors ON pets USING GIN(coat_colors);

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pets'
ORDER BY ordinal_position;
```

Or use Prisma to generate the schema:

```bash
npx prisma migrate dev --name init
```

---

## ⚙️ Environment Variable Format

### For Neon:

```env
# Neon connection strings
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Key differences from Supabase:**
- ✅ Host format: `ep-xxx-xxx.region.aws.neon.tech`
- ✅ Always includes `?sslmode=require`
- ✅ Pooled connection may have `&pool=true`
- ✅ No pgBouncer parameters needed

---

## 🧪 Testing After Migration

### 1. Test Database Connection

```bash
npx prisma studio
```

Opens a GUI to browse your database. Should connect without errors.

### 2. Test in Your App

1. Deploy your app with new environment variables
2. Go to **Add Pet** page
3. Upload a pet photo
4. AI should identify breed
5. Pet should save successfully
6. Pet appears in "My Pets" list

### 3. Check Logs

No more errors like:
- ❌ "prepared statement already exists"
- ❌ "database does not exist"
- ❌ pgBouncer errors

Should see:
- ✅ Clean database queries
- ✅ Successful pet creation
- ✅ No connection errors

---

## 💰 Neon Pricing

### Free Tier Includes:
- ✅ 3 projects
- ✅ 10 branches per project
- ✅ 0.5 GB storage per branch
- ✅ Autoscaling to zero
- ✅ Always-free compute

Perfect for development and small production apps!

### Upgrade When Needed:
- **Launch**: $19/month - 100 GB storage
- **Scale**: $69/month - 500 GB storage
- **Business**: Custom pricing

---

## 🔄 Rollback to Supabase (If Needed)

If you need to go back to Supabase:

1. Update `DATABASE_URL` back to Supabase direct connection:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
2. Remove `?pgbouncer=true` parameter
3. Redeploy

---

## 📊 Comparison: Neon vs Supabase

| Feature | Neon | Supabase |
|---------|------|----------|
| **Prisma Compatibility** | ⭐⭐⭐⭐⭐ Perfect | ⭐⭐⭐ Good (with workarounds) |
| **Connection Pooling** | ✅ Built-in, works seamlessly | ⚠️ pgBouncer issues |
| **Prepared Statements** | ✅ Full support | ❌ Issues with pooler |
| **Serverless** | ✅ Auto-scaling, scales to zero | ⚠️ Always running |
| **Setup** | ✅ Simple | ✅ Simple |
| **Free Tier** | ✅ 3 projects, 0.5GB each | ✅ 2 projects, 500MB each |
| **Additional Features** | Database only | Auth, Storage, Realtime |

**Recommendation**:
- **Neon** if you just need a database
- **Supabase** if you need auth, storage, and realtime features

---

## ✅ Success Checklist

After migration to Neon:

- [ ] Created Neon project
- [ ] Copied pooled connection string to `DATABASE_URL`
- [ ] Copied direct connection string to `DIRECT_URL`
- [ ] Updated environment variables in Vercel/hosting
- [ ] Ran database migrations
- [ ] Generated Prisma client
- [ ] Deployed application
- [ ] Tested pet creation
- [ ] Verified no connection errors
- [ ] All features working

---

## 🆘 Troubleshooting

### Error: "SSL connection required"

**Solution**: Add `?sslmode=require` to your connection string

### Error: "Connection refused"

**Solution**: Check your Neon project is active (not paused)

### Error: "Authentication failed"

**Solution**: Verify password is correct, check for URL encoding

### Migrations fail

**Solution**: Use `DIRECT_URL` (not pooled) for migrations

---

## 📚 Resources

- **Neon Console**: https://console.neon.tech
- **Neon Docs**: https://neon.tech/docs
- **Prisma with Neon**: https://neon.tech/docs/guides/prisma
- **Neon Discord**: https://discord.gg/neon

---

## 🎉 Summary

**Migrate to Neon in 3 steps:**

1. **Create project** at console.neon.tech
2. **Update environment variables** with Neon connection strings
3. **Run migrations** and deploy

**Result**: No more pgBouncer errors, better performance, simpler setup! 🚀
