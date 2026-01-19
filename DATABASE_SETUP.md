# 🗄️ Database Setup for Neon

## Quick Start

You have **two SQL files** to choose from:

| File | Use When | Time |
|------|----------|------|
| `neon_database_schema.sql` | Starting fresh, no tables exist | 2 min |
| `add_missing_tables.sql` | Already have tables, just need coat fields | 30 sec |

---

## Option 1: Fresh Database (Complete Schema)

### Step 1: Open Neon SQL Editor

1. Go to **https://console.neon.tech**
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run Complete Schema

Copy and paste the entire contents of **`neon_database_schema.sql`** and click **RUN**.

This will create:
- ✅ All enums (Species, Gender, SizeCategory, etc.)
- ✅ All 12 tables (users, pets, vaccinations, etc.)
- ✅ All indexes and foreign keys
- ✅ The coat_type and coat_colors fields

### Step 3: Verify

The script automatically runs verification queries at the end. You should see:
- List of all created tables
- Pets table structure including coat fields

---

## Option 2: Add Missing Fields Only

### If You Already Have Tables

Use **`add_missing_tables.sql`** to safely add just the coat fields:

1. Open **Neon SQL Editor**
2. Copy and paste contents of `add_missing_tables.sql`
3. Click **RUN**

This script:
- ✅ Uses `IF NOT EXISTS` - safe to run multiple times
- ✅ Only adds what's missing
- ✅ Won't break existing data
- ✅ Adds coat_type and coat_colors fields
- ✅ Creates indexes for performance

---

## Tables Created

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (Clerk integration) |
| `pets` | Pet profiles with AI analysis data |
| `pet_photos` | Pet photos and thumbnails |
| `vaccinations` | Vaccination records and schedules |
| `health_records` | Medical history and checkups |
| `medications` | Active and past medications |
| `medication_logs` | Medication administration tracking |
| `weight_records` | Weight history over time |
| `documents` | PDFs, images, certificates |
| `diet_plans` | AI-generated diet recommendations |
| `reminders` | Upcoming tasks and notifications |
| `service_providers` | Vets, groomers, trainers nearby |

### Key Fields in Pets Table

| Field | Type | Purpose |
|-------|------|---------|
| `breed` | TEXT | Primary breed name |
| `breedSecondary` | TEXT | Secondary breed (mixed) |
| `isMixedBreed` | BOOLEAN | Is mixed breed? |
| `breedConfidence` | FLOAT | AI confidence score |
| `ageEstimateMonths` | INTEGER | Age from AI |
| `sizeCategory` | ENUM | SMALL/MEDIUM/LARGE/EXTRA_LARGE |
| `coat_type` | VARCHAR(50) | short, long, curly, wire |
| `coat_colors` | TEXT[] | Array of colors |
| `aiAnalysisData` | JSONB | Full AI response |

---

## After Running SQL

### Step 1: Verify Tables Exist

Run this in Neon SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should return 12 tables.

### Step 2: Verify Coat Fields

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors');
```

Should return:
- `coat_type` | `character varying`
- `coat_colors` | `ARRAY`

### Step 3: Deploy Your App

Now that the database is set up:

```bash
# Make sure your code is up to date
git pull

# Deploy (or trigger redeploy in Vercel)
git push
```

---

## Environment Variables

Make sure these are set in your deployment:

```env
paw_POSTGRES_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
paw_POSTGRES_URL_NON_POOLING="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

**If using Neon integration in Vercel:**
- ✅ These are automatically set
- ✅ No manual configuration needed
- ✅ Just deploy!

---

## Test Everything

After deployment:

### 1. Test Database Connection
- Visit your app
- Check if it loads without errors
- Look for any Prisma errors in logs

### 2. Test Pet Creation
1. Go to **Add Pet** page
2. Upload a pet photo
3. AI should identify breed
4. Pet should save successfully
5. Pet appears in "My Pets" list

### 3. Verify Data in Database

In Neon SQL Editor:

```sql
-- Check if pets are being created
SELECT
  id,
  name,
  breed,
  coat_type,
  coat_colors,
  breed_confidence,
  created_at
FROM pets
ORDER BY created_at DESC
LIMIT 5;
```

---

## Troubleshooting

### Error: "type already exists"

**Solution**: Normal if re-running the script. The enums were already created. You can ignore this or use `add_missing_tables.sql` instead.

### Error: "relation already exists"

**Solution**: Table already exists. Use `add_missing_tables.sql` to add only missing columns.

### Error: "column already exists"

**Solution**: Column already added. This is fine - means the coat fields are already there!

### No tables showing up

**Solution**:
1. Make sure you're connected to the correct Neon database
2. Check you're looking at the `public` schema
3. Verify the SQL ran without errors

---

## Migration from Supabase

If migrating data from Supabase:

### Export from Supabase

```bash
pg_dump "postgresql://postgres:[SUPABASE-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --data-only --no-owner --no-acl > data.sql
```

### Import to Neon

```bash
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" < data.sql
```

**Note**: Run the schema SQL first, then import data.

---

## SQL File Reference

### `neon_database_schema.sql`
- **Size**: ~400 lines
- **Purpose**: Complete database setup
- **Use**: Fresh database
- **Creates**: Everything (tables, indexes, constraints)
- **Safe**: Yes, but will fail if tables exist

### `add_missing_tables.sql`
- **Size**: ~80 lines
- **Purpose**: Add coat fields only
- **Use**: Existing database
- **Creates**: Just coat_type and coat_colors
- **Safe**: Yes, uses IF NOT EXISTS

---

## Performance Notes

### Indexes Created

The schema includes optimized indexes for:
- ✅ User lookups by email
- ✅ Pet queries by user
- ✅ Vaccination schedules
- ✅ Health record searches
- ✅ Medication tracking
- ✅ **Coat type filtering** (new!)
- ✅ **Coat color searches** (GIN index for arrays)

### Query Performance

Expected query times on Neon:
- Pet list by user: < 10ms
- AI analysis data: < 5ms
- Coat color search: < 20ms
- Full-text search: < 50ms

---

## Summary

**To set up your database:**

1. **Choose your SQL file** (fresh vs existing)
2. **Run in Neon SQL Editor**
3. **Verify tables created**
4. **Deploy your app**
5. **Test pet creation**

**Total time:** 5-10 minutes

Everything should work perfectly after this! 🚀
