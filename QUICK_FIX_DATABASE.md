# 🚨 Quick Fix: Add Coat Fields to Database

## The Problem
Your Prisma schema has `coatType` and `coatColors` fields, but they don't exist in your Supabase database yet. This is causing the error:
```
The column `pets.coatType` does not exist in the current database.
```

## ✅ Option 1: Run SQL Directly in Supabase (Fastest - 2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run This SQL

Copy and paste this into the SQL Editor and click **RUN**:

```sql
-- Add coat type and colors fields to pets table
ALTER TABLE pets
ADD COLUMN coat_type VARCHAR(50),
ADD COLUMN coat_colors TEXT[];

-- Add indexes for better performance
CREATE INDEX idx_pets_coat_type ON pets(coat_type);
CREATE INDEX idx_pets_coat_colors ON pets USING GIN(coat_colors);

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors');
```

### Step 3: Regenerate Prisma Client
In your local terminal:
```bash
npm install
npx prisma generate
```

### Step 4: Redeploy (if using Vercel/deployment platform)
```bash
git push
```
Or trigger a redeploy in your deployment dashboard.

**✅ DONE!** The error should be fixed.

---

## ✅ Option 2: Use Prisma Migrate (Recommended for tracking)

### Step 1: Create .env file locally
```bash
cp .env.example .env
```

### Step 2: Add your Supabase credentials to .env
Get these from your Supabase project settings:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

### Step 3: Run Prisma Migration
```bash
npx prisma migrate dev --name add_coat_fields_to_pet
```

This will:
- Create a migration file
- Apply it to your database
- Regenerate Prisma Client

### Step 4: Commit and push
```bash
git add prisma/migrations
git commit -m "Add coat fields migration"
git push
```

---

## 🧪 Verify It Worked

### In Supabase SQL Editor:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors');
```

Should return:
```
 column_name  |     data_type     | is_nullable
--------------+-------------------+-------------
 coat_type    | character varying | YES
 coat_colors  | ARRAY             | YES
```

### In Your App:
1. Try uploading a pet photo
2. The AI should now analyze it correctly
3. No more "Golden Retriever" every time!

---

## 💡 Why This Happened

The code was updated to use the new fields (`coatType`, `coatColors`), but the database columns weren't created yet. Prisma schema changes need to be applied to the actual database via migrations.

---

## Need Help?

If you get any errors:
1. Check your database credentials in .env
2. Make sure you have the right permissions on the database
3. Verify you're connected to the correct Supabase project

The SQL in **Option 1** is the quickest way to fix the production error right now!
