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

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
