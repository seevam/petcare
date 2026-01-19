import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validators";

// GET /api/pets - List all user's pets
export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pets = await prisma.pet.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        vaccinations: {
          where: { isCompleted: true },
          orderBy: { dateAdministered: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { message: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}

// POST /api/pets - Create new pet
export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database (auto-create from Clerk if needed)
    const clerkUser = await currentUser();
    if (clerkUser) {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || null,
          imageUrl: clerkUser.imageUrl || null,
          updatedAt: new Date(),
        },
        create: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    }

    const body = await request.json();
    const validated = petSchema.parse(body);

    // Create pet in database
    const pet = await prisma.pet.create({
      data: {
        userId,
        name: validated.name,
        species: validated.species,
        breed: validated.breed,
        breedSecondary: validated.breedSecondary,
        isMixedBreed: validated.isMixedBreed || false,
        breedConfidence: validated.breedConfidence,
        coatType: validated.coatType,
        coatColors: validated.coatColors,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        ageEstimateMonths: validated.ageEstimateMonths,
        gender: validated.gender,
        isSpayedNeutered: validated.isSpayedNeutered,
        weightLbs: validated.weightLbs,
        sizeCategory: validated.sizeCategory,
        microchipNumber: validated.microchipNumber,
        specialConditions: validated.specialConditions,
        isIndoor: validated.isIndoor,
        aiAnalysisData: validated.aiAnalysisData,
      },
    });

    const petWithDetails = await prisma.pet.findUnique({
      where: { id: pet.id },
      include: {
        photos: true,
        dietPlan: true,
      },
    });

    return NextResponse.json(petWithDetails, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pet:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create pet" },
      { status: 500 }
    );
  }
}
