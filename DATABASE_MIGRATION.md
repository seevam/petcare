# Database Schema Analysis for AI Breed Identification

## ✅ Already Supported Fields

The `pets` table already has these fields ready for AI analysis:

| Field | Type | Purpose | Status |
|-------|------|---------|--------|
| `breed` | String | Primary breed name | ✅ Ready |
| `breedSecondary` | String | Secondary breed (for mixed breeds) | ✅ Ready |
| `isMixedBreed` | Boolean | Flag for mixed breeds | ✅ Ready |
| `breedConfidence` | Float | AI confidence score (0-1) | ✅ Ready |
| `aiAnalysisData` | JSON | Full AI response storage | ✅ Ready |
| `ageEstimateMonths` | Int | Estimated age from photo | ✅ Ready |
| `sizeCategory` | Enum | SMALL, MEDIUM, LARGE, EXTRA_LARGE | ✅ Ready |

## ⚠️ Missing Fields

The AI returns these additional fields that aren't stored:

| Field | Type | Purpose | Action Needed |
|-------|------|---------|---------------|
| `coatType` | String | short, long, curly, wire | ➕ Add field |
| `coatColors` | String[] | Array of detected colors | ➕ Add field |

## 📝 Recommended Database Changes

### Option 1: Store in JSON field (No migration needed)
Since you already have `aiAnalysisData` as a JSON field, you can store the coat information there without any schema changes. This is the **easiest approach**.

### Option 2: Add explicit fields (Recommended for filtering)
Add dedicated fields for better querying and filtering by coat characteristics.

---

## 🔧 Migration Scripts

### For Prisma (Recommended)

**Step 1**: Update your `prisma/schema.prisma`

```prisma
model Pet {
  id                String    @id @default(cuid())
  userId            String

  // Basic info
  name              String
  species           Species
  breed             String?
  breedSecondary    String?   // For mixed breeds
  isMixedBreed      Boolean   @default(false)

  // AI analysis data
  breedConfidence   Float?
  aiAnalysisData    Json?     // Store full AI response

  // NEW: Coat information from AI
  coatType          String?   // "short", "long", "curly", "wire"
  coatColors        String[]  // ["golden", "white"]

  // ... rest of your fields
}
```

**Step 2**: Generate and run migration
```bash
npx prisma migrate dev --name add_coat_fields_to_pet
```

### Raw SQL (If not using Prisma migrations)

```sql
-- Add coat type field
ALTER TABLE pets
ADD COLUMN coat_type VARCHAR(50);

-- Add coat colors field (PostgreSQL array)
ALTER TABLE pets
ADD COLUMN coat_colors TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN pets.coat_type IS 'Coat type detected by AI: short, long, curly, wire';
COMMENT ON COLUMN pets.coat_colors IS 'Array of coat colors detected by AI';
```

### Rollback SQL (If you need to undo)

```sql
-- Remove the added fields
ALTER TABLE pets
DROP COLUMN IF EXISTS coat_type,
DROP COLUMN IF EXISTS coat_colors;
```

---

## 🔄 Update Application Code

After adding the fields, update these files:

### 1. Update Pet Creation API (`src/app/api/pets/route.ts`)

```typescript
const pet = await prisma.pet.create({
  data: {
    userId,
    name: validated.name,
    species: validated.species,
    breed: validated.breed,
    breedSecondary: validated.breedSecondary,
    isMixedBreed: validated.isMixedBreed || false,
    breedConfidence: validated.breedConfidence,
    aiAnalysisData: validated.aiAnalysisData,

    // NEW: Add coat information
    coatType: validated.coatType,
    coatColors: validated.coatColors,

    // ... other fields
  },
});
```

### 2. Update Pet Form (`src/app/(dashboard)/pets/new/page.tsx`)

In the `handleAnalyze` function, add:

```typescript
const results = {
  breed: analysis.isMixedBreed && analysis.breedSecondary
    ? `${analysis.breed} / ${analysis.breedSecondary} Mix`
    : analysis.breed,
  confidence: analysis.breedConfidence,
  ageEstimateMonths: analysis.ageEstimateMonths,
  estimatedWeight: weightEstimates[analysis.sizeCategory] || 35,
  size: analysis.sizeCategory.replace("_", " "),
  coatColor: analysis.coatColors?.join(", ") || "Unknown",

  // NEW: Add to formData
  coatType: analysis.coatType,
  coatColors: analysis.coatColors,
};

setFormData((prev) => ({
  ...prev,
  breed: results.breed,
  weight: results.estimatedWeight.toString(),
  coatType: results.coatType,      // NEW
  coatColors: results.coatColors,  // NEW
}));
```

### 3. Update Validation Schema (`src/lib/validators.ts`)

```typescript
import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1),
  species: z.enum(["DOG", "CAT"]),
  breed: z.string().optional(),
  breedSecondary: z.string().optional(),
  isMixedBreed: z.boolean().optional(),
  breedConfidence: z.number().min(0).max(1).optional(),
  aiAnalysisData: z.any().optional(),

  // NEW: Add coat validation
  coatType: z.string().optional(),
  coatColors: z.array(z.string()).optional(),

  // ... other fields
});
```

---

## 📊 Current AI Analysis Output

The AI (`analyzePetPhoto`) returns:

```json
{
  "breed": "Golden Retriever",
  "breedSecondary": null,
  "breedConfidence": 0.95,
  "ageEstimateMonths": 24,
  "sizeCategory": "LARGE",
  "coatType": "long",
  "coatColors": ["golden", "cream"],
  "isMixedBreed": false
}
```

All of these fields can now be properly stored in your database!

---

## 🎯 Summary

**Current Status**: 85% ready! Most fields already exist.

**Action Required**:
1. Add `coatType` and `coatColors` fields (optional but recommended)
2. OR just use the existing `aiAnalysisData` JSON field

**Recommended Approach**:
Run the Prisma migration to add the coat fields for better searchability.

```bash
# Quick setup
npx prisma migrate dev --name add_coat_fields_to_pet
npx prisma generate
```
