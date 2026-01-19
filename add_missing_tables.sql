-- Add Missing Tables/Columns to Existing Database
-- Use this if you already have some tables and just need to add what's missing
-- Safe to run multiple times (uses IF NOT EXISTS)

-- ============================================
-- ADD ENUMS (if missing)
-- ============================================

DO $$ BEGIN
    CREATE TYPE "Species" AS ENUM ('DOG', 'CAT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SizeCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RecordType" AS ENUM ('ILLNESS', 'INJURY', 'SURGERY', 'TEST', 'CHECKUP', 'EMERGENCY', 'CONDITION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "LogStatus" AS ENUM ('PENDING', 'GIVEN', 'SKIPPED', 'MISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MeasurementMethod" AS ENUM ('VET_SCALE', 'HOME_SCALE', 'ESTIMATED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DocumentType" AS ENUM ('VACCINATION_CERT', 'LAB_RESULT', 'XRAY', 'INVOICE', 'INSURANCE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ReminderType" AS ENUM ('VACCINATION', 'MEDICATION', 'WEIGHT_CHECK', 'VET_APPOINTMENT', 'GROOMING', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ProviderCategory" AS ENUM ('VETERINARIAN', 'EMERGENCY_VET', 'GROOMER', 'TRAINER', 'BOARDER', 'PET_STORE', 'DOG_PARK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ADD COAT FIELDS TO PETS TABLE (if missing)
-- ============================================

ALTER TABLE pets
ADD COLUMN IF NOT EXISTS coat_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS coat_colors TEXT[];

-- Add indexes for coat fields
CREATE INDEX IF NOT EXISTS idx_pets_coat_type ON pets(coat_type);
CREATE INDEX IF NOT EXISTS idx_pets_coat_colors ON pets USING GIN(coat_colors);

-- ============================================
-- VERIFY CHANGES
-- ============================================

-- Check pets table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors')
ORDER BY ordinal_position;

-- If you see 2 rows returned, the fields were added successfully!
