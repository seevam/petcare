-- Complete Database Schema for PetCare Application
-- For Neon PostgreSQL Database
-- Run this in Neon SQL Editor: https://console.neon.tech

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "Species" AS ENUM ('DOG', 'CAT');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "SizeCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');
CREATE TYPE "RecordType" AS ENUM ('ILLNESS', 'INJURY', 'SURGERY', 'TEST', 'CHECKUP', 'EMERGENCY', 'CONDITION');
CREATE TYPE "LogStatus" AS ENUM ('PENDING', 'GIVEN', 'SKIPPED', 'MISSED');
CREATE TYPE "MeasurementMethod" AS ENUM ('VET_SCALE', 'HOME_SCALE', 'ESTIMATED');
CREATE TYPE "DocumentType" AS ENUM ('VACCINATION_CERT', 'LAB_RESULT', 'XRAY', 'INVOICE', 'INSURANCE', 'OTHER');
CREATE TYPE "ReminderType" AS ENUM ('VACCINATION', 'MEDICATION', 'WEIGHT_CHECK', 'VET_APPOINTMENT', 'GROOMING', 'CUSTOM');
CREATE TYPE "ProviderCategory" AS ENUM ('VETERINARIAN', 'EMERGENCY_VET', 'GROOMER', 'TRAINER', 'BOARDER', 'PET_STORE', 'DOG_PARK');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "imageUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- PETS TABLE
-- ============================================

CREATE TABLE "pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,

    -- Basic info
    "name" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "breed" TEXT,
    "breedSecondary" TEXT,
    "isMixedBreed" BOOLEAN NOT NULL DEFAULT false,

    -- AI analysis data
    "breedConfidence" DOUBLE PRECISION,
    "aiAnalysisData" JSONB,
    "coat_type" VARCHAR(50),
    "coat_colors" TEXT[],

    -- Demographics
    "dateOfBirth" TIMESTAMP(3),
    "ageEstimateMonths" INTEGER,
    "gender" "Gender",
    "isSpayedNeutered" BOOLEAN,

    -- Physical
    "weightLbs" DOUBLE PRECISION,
    "weightLastUpdated" TIMESTAMP(3),
    "sizeCategory" "SizeCategory",

    -- Other
    "microchipNumber" TEXT,
    "specialConditions" TEXT,
    "isIndoor" BOOLEAN,

    -- Photos
    "profilePhotoUrl" TEXT,

    -- Metadata
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- PET PHOTOS TABLE
-- ============================================

CREATE TABLE "pet_photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_photos_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- VACCINATIONS TABLE
-- ============================================

CREATE TABLE "vaccinations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "dateAdministered" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "clinicName" TEXT,
    "veterinarianName" TEXT,
    "lotNumber" TEXT,
    "certificateUrl" TEXT,
    "reactionNotes" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccinations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- HEALTH RECORDS TABLE
-- ============================================

CREATE TABLE "health_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "recordType" "RecordType" NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "clinicName" TEXT,
    "veterinarianName" TEXT,
    "diagnosis" TEXT,
    "description" TEXT,
    "treatment" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- MEDICATIONS TABLE
-- ============================================

CREATE TABLE "medications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosageAmount" DOUBLE PRECISION NOT NULL,
    "dosageUnit" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "frequencyTimes" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "route" TEXT,
    "instructions" TEXT,
    "prescribingVet" TEXT,
    "refillPharmacy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- MEDICATION LOGS TABLE
-- ============================================

CREATE TABLE "medication_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicationId" TEXT NOT NULL,
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "actualTime" TIMESTAMP(3),
    "status" "LogStatus" NOT NULL DEFAULT 'PENDING',
    "givenBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_logs_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- WEIGHT RECORDS TABLE
-- ============================================

CREATE TABLE "weight_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "weightLbs" DOUBLE PRECISION NOT NULL,
    "measurementDate" TIMESTAMP(3) NOT NULL,
    "method" "MeasurementMethod" NOT NULL DEFAULT 'HOME_SCALE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================

CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "healthRecordId" TEXT,
    "tags" TEXT[],
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "documents_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================
-- DIET PLANS TABLE
-- ============================================

CREATE TABLE "diet_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL UNIQUE,
    "dailyCalories" INTEGER NOT NULL,
    "mealsPerDay" INTEGER NOT NULL,
    "feedingTimes" TEXT[],
    "portionPerMeal" TEXT NOT NULL,
    "foodType" TEXT NOT NULL,
    "proteinSource" TEXT,
    "specialDiet" TEXT,
    "recommendations" TEXT NOT NULL,
    "generatedByAI" BOOLEAN NOT NULL DEFAULT true,
    "aiPromptUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diet_plans_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- REMINDERS TABLE
-- ============================================

CREATE TABLE "reminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "petId" TEXT,
    "reminderType" "ReminderType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "reminderTime" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "lastNotifiedAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "linkedRecordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- SERVICE PROVIDERS TABLE
-- ============================================

CREATE TABLE "service_providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "category" "ProviderCategory" NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "services" TEXT[],
    "hoursOfOperation" JSONB,
    "acceptsSpecies" "Species"[],
    "photos" TEXT[],
    "averageRating" DOUBLE PRECISION,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX "users_email_idx" ON "users"("email");

-- Pets
CREATE INDEX "pets_userId_idx" ON "pets"("userId");
CREATE INDEX "pets_species_idx" ON "pets"("species");
CREATE INDEX "pets_isActive_idx" ON "pets"("isActive");
CREATE INDEX "pets_coat_type_idx" ON "pets"("coat_type");
CREATE INDEX "pets_coat_colors_idx" ON "pets" USING GIN("coat_colors");

-- Pet Photos
CREATE INDEX "pet_photos_petId_idx" ON "pet_photos"("petId");
CREATE INDEX "pet_photos_isPrimary_idx" ON "pet_photos"("isPrimary");

-- Vaccinations
CREATE INDEX "vaccinations_petId_idx" ON "vaccinations"("petId");
CREATE INDEX "vaccinations_dateAdministered_idx" ON "vaccinations"("dateAdministered");
CREATE INDEX "vaccinations_nextDueDate_idx" ON "vaccinations"("nextDueDate");

-- Health Records
CREATE INDEX "health_records_petId_idx" ON "health_records"("petId");
CREATE INDEX "health_records_eventDate_idx" ON "health_records"("eventDate");
CREATE INDEX "health_records_recordType_idx" ON "health_records"("recordType");

-- Medications
CREATE INDEX "medications_petId_idx" ON "medications"("petId");
CREATE INDEX "medications_isActive_idx" ON "medications"("isActive");

-- Medication Logs
CREATE INDEX "medication_logs_medicationId_idx" ON "medication_logs"("medicationId");
CREATE INDEX "medication_logs_scheduledTime_idx" ON "medication_logs"("scheduledTime");
CREATE INDEX "medication_logs_status_idx" ON "medication_logs"("status");

-- Weight Records
CREATE INDEX "weight_records_petId_idx" ON "weight_records"("petId");
CREATE INDEX "weight_records_measurementDate_idx" ON "weight_records"("measurementDate");

-- Documents
CREATE INDEX "documents_petId_idx" ON "documents"("petId");
CREATE INDEX "documents_healthRecordId_idx" ON "documents"("healthRecordId");
CREATE INDEX "documents_documentType_idx" ON "documents"("documentType");

-- Diet Plans
CREATE INDEX "diet_plans_petId_idx" ON "diet_plans"("petId");

-- Reminders
CREATE INDEX "reminders_userId_idx" ON "reminders"("userId");
CREATE INDEX "reminders_petId_idx" ON "reminders"("petId");
CREATE INDEX "reminders_reminderDate_idx" ON "reminders"("reminderDate");
CREATE INDEX "reminders_isCompleted_idx" ON "reminders"("isCompleted");

-- Service Providers
CREATE INDEX "service_providers_category_idx" ON "service_providers"("category");
CREATE INDEX "service_providers_city_idx" ON "service_providers"("city");
CREATE INDEX "service_providers_state_idx" ON "service_providers"("state");
CREATE INDEX "service_providers_isActive_idx" ON "service_providers"("isActive");

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify pets table columns (including coat fields)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pets'
ORDER BY ordinal_position;
