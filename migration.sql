-- PawCare Database Schema Migration
-- Generated from Prisma schema for Supabase PostgreSQL

-- Create ENUMS
CREATE TYPE "Species" AS ENUM ('DOG', 'CAT');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "SizeCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');
CREATE TYPE "RecordType" AS ENUM ('ILLNESS', 'INJURY', 'SURGERY', 'TEST', 'CHECKUP', 'EMERGENCY', 'CONDITION');
CREATE TYPE "LogStatus" AS ENUM ('PENDING', 'GIVEN', 'SKIPPED', 'MISSED');
CREATE TYPE "MeasurementMethod" AS ENUM ('VET_SCALE', 'HOME_SCALE', 'ESTIMATED');
CREATE TYPE "DocumentType" AS ENUM ('VACCINATION_CERT', 'LAB_RESULT', 'XRAY', 'INVOICE', 'INSURANCE', 'OTHER');
CREATE TYPE "ReminderType" AS ENUM ('VACCINATION', 'MEDICATION', 'WEIGHT_CHECK', 'VET_APPOINTMENT', 'GROOMING', 'CUSTOM');
CREATE TYPE "ProviderCategory" AS ENUM ('VETERINARIAN', 'EMERGENCY_VET', 'GROOMER', 'TRAINER', 'BOARDER', 'PET_STORE', 'DOG_PARK');

-- Create tables
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "breed" TEXT,
    "breedSecondary" TEXT,
    "isMixedBreed" BOOLEAN NOT NULL DEFAULT false,
    "breedConfidence" DOUBLE PRECISION,
    "aiAnalysisData" JSONB,
    "dateOfBirth" TIMESTAMP(3),
    "ageEstimateMonths" INTEGER,
    "gender" "Gender",
    "isSpayedNeutered" BOOLEAN,
    "weightLbs" DOUBLE PRECISION,
    "weightLastUpdated" TIMESTAMP(3),
    "sizeCategory" "SizeCategory",
    "microchipNumber" TEXT,
    "specialConditions" TEXT,
    "isIndoor" BOOLEAN,
    "profilePhotoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pet_photos" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vaccinations" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_records" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "health_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "medication_logs" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "actualTime" TIMESTAMP(3),
    "status" "LogStatus" NOT NULL DEFAULT 'PENDING',
    "givenBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "weight_records" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "weightLbs" DOUBLE PRECISION NOT NULL,
    "measurementDate" TIMESTAMP(3) NOT NULL,
    "method" "MeasurementMethod" NOT NULL DEFAULT 'HOME_SCALE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "diet_plans" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
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

    CONSTRAINT "diet_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_providers" (
    "id" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "diet_plans_petId_key" ON "diet_plans"("petId");

-- Add foreign keys
ALTER TABLE "pets" ADD CONSTRAINT "pets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pet_photos" ADD CONSTRAINT "pet_photos_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "medications" ADD CONSTRAINT "medications_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "medication_logs" ADD CONSTRAINT "medication_logs_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "weight_records" ADD CONSTRAINT "weight_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
