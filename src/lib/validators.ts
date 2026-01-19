import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Pet schemas
export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.enum(["DOG", "CAT"]),
  breed: z.string().optional(),
  breedSecondary: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ageEstimateMonths: z.number().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).optional(),
  isSpayedNeutered: z.boolean().optional(),
  weightLbs: z.number().positive().optional(),
  sizeCategory: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"]).optional(),
  microchipNumber: z.string().optional(),
  specialConditions: z.string().optional(),
  isMixedBreed: z.boolean().optional(),
  breedConfidence: z.number().min(0).max(1).optional(),
  aiAnalysisData: z.any().optional(),
  coatType: z.string().optional(),
  coatColors: z.array(z.string()).optional(),
  isIndoor: z.boolean().optional(),
});

// Vaccination schemas
export const vaccinationSchema = z.object({
  petId: z.string(),
  vaccineName: z.string().min(1, "Vaccine name is required"),
  dateAdministered: z.string().min(1, "Date is required"),
  nextDueDate: z.string().optional(),
  clinicName: z.string().optional(),
  veterinarianName: z.string().optional(),
  lotNumber: z.string().optional(),
  reactionNotes: z.string().optional(),
});

// Health record schemas
export const healthRecordSchema = z.object({
  petId: z.string(),
  recordType: z.enum(["ILLNESS", "INJURY", "SURGERY", "TEST", "CHECKUP", "EMERGENCY", "CONDITION"]),
  eventDate: z.string().min(1, "Event date is required"),
  clinicName: z.string().optional(),
  veterinarianName: z.string().optional(),
  diagnosis: z.string().optional(),
  description: z.string().optional(),
  treatment: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  cost: z.number().positive().optional(),
});

// Medication schemas
export const medicationSchema = z.object({
  petId: z.string(),
  medicationName: z.string().min(1, "Medication name is required"),
  dosageAmount: z.number().positive("Dosage amount must be positive"),
  dosageUnit: z.string().min(1, "Dosage unit is required"),
  frequency: z.string().min(1, "Frequency is required"),
  frequencyTimes: z.array(z.string()),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  route: z.string().optional(),
  instructions: z.string().optional(),
  prescribingVet: z.string().optional(),
  refillPharmacy: z.string().optional(),
});

// Weight record schema
export const weightRecordSchema = z.object({
  petId: z.string(),
  weightLbs: z.number().positive("Weight must be positive"),
  measurementDate: z.string().min(1, "Measurement date is required"),
  method: z.enum(["VET_SCALE", "HOME_SCALE", "ESTIMATED"]).optional(),
  notes: z.string().optional(),
});

// Service provider search schema
export const serviceProviderSearchSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().default(10),
  category: z.string().optional(),
  species: z.enum(["DOG", "CAT"]).optional(),
});

// Reminder schema
export const reminderSchema = z.object({
  petId: z.string().optional(),
  reminderType: z.enum(["VACCINATION", "MEDICATION", "WEIGHT_CHECK", "VET_APPOINTMENT", "GROOMING", "CUSTOM"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  reminderDate: z.string().min(1, "Reminder date is required"),
  reminderTime: z.string().optional(),
  linkedRecordId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PetInput = z.infer<typeof petSchema>;
export type VaccinationInput = z.infer<typeof vaccinationSchema>;
export type HealthRecordInput = z.infer<typeof healthRecordSchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
export type WeightRecordInput = z.infer<typeof weightRecordSchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;
