-- Rollback Migration: Remove coat fields from pets table
-- Date: 2026-01-18
-- Description: Removes the coat_type and coat_colors fields if migration needs to be undone

-- Drop indexes first
DROP INDEX IF EXISTS idx_pets_coat_type;
DROP INDEX IF EXISTS idx_pets_coat_colors;

-- Remove the coat fields
ALTER TABLE pets
DROP COLUMN IF EXISTS coat_type,
DROP COLUMN IF EXISTS coat_colors;

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors');

-- Should return 0 rows if rollback successful
