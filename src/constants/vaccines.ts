export interface Vaccine {
  name: string;
  isCore: boolean;
  boosterIntervalYears: number;
  description: string;
}

export const COMMON_VACCINES: Record<"DOG" | "CAT", Vaccine[]> = {
  DOG: [
    {
      name: "Rabies",
      isCore: true,
      boosterIntervalYears: 1,
      description: "Required by law in most states",
    },
    {
      name: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
      isCore: true,
      boosterIntervalYears: 3,
      description: "Protects against four major diseases",
    },
    {
      name: "Bordetella (Kennel Cough)",
      isCore: false,
      boosterIntervalYears: 1,
      description: "Recommended for dogs in contact with other dogs",
    },
    {
      name: "Leptospirosis",
      isCore: false,
      boosterIntervalYears: 1,
      description: "Protects against bacterial disease",
    },
    {
      name: "Lyme Disease",
      isCore: false,
      boosterIntervalYears: 1,
      description: "For dogs in tick-prone areas",
    },
    {
      name: "Canine Influenza",
      isCore: false,
      boosterIntervalYears: 1,
      description: "For dogs in contact with other dogs",
    },
  ],
  CAT: [
    {
      name: "Rabies",
      isCore: true,
      boosterIntervalYears: 1,
      description: "Required by law in most states",
    },
    {
      name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
      isCore: true,
      boosterIntervalYears: 3,
      description: "Protects against three major diseases",
    },
    {
      name: "FeLV (Feline Leukemia)",
      isCore: false,
      boosterIntervalYears: 1,
      description: "Recommended for at-risk cats",
    },
  ],
};
