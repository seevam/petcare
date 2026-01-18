-- Migration: Add coat type and colors fields to pets table
-- Date: 2026-01-18
-- Description: Adds AI-detected coat information fields to support breed identification feature

-- Add coat type field
ALTER TABLE pets
ADD COLUMN coat_type VARCHAR(50);

-- Add coat colors field (PostgreSQL array)
ALTER TABLE pets
ADD COLUMN coat_colors TEXT[];

-- Add indexes for better query performance
CREATE INDEX idx_pets_coat_type ON pets(coat_type);
CREATE INDEX idx_pets_coat_colors ON pets USING GIN(coat_colors);

-- Add comments for documentation
COMMENT ON COLUMN pets.coat_type IS 'Coat type detected by AI: short, long, curly, wire, etc.';
COMMENT ON COLUMN pets.coat_colors IS 'Array of coat colors detected by AI analysis';

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pets'
  AND column_name IN ('coat_type', 'coat_colors');
