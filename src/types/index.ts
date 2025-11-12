import { Pet, Vaccination, HealthRecord, Medication, User, ServiceProvider } from "@prisma/client";

export type PetWithRelations = Pet & {
  vaccinations?: Vaccination[];
  healthRecords?: HealthRecord[];
  medications?: Medication[];
  photos?: any[];
  dietPlan?: any;
};

export type VaccinationWithPet = Vaccination & {
  pet: Pet;
};

export type HealthRecordWithPet = HealthRecord & {
  pet: Pet;
};

export type MedicationWithPet = Medication & {
  pet: Pet;
};

export type ServiceProviderWithDistance = ServiceProvider & {
  distance: number;
};

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
