import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { authOptions } from "";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validators";

// GET /api/pets/[id] - Get single pet
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
      include: {
        photos: true,
        vaccinations: {
          orderBy: { dateAdministered: "desc" },
        },
        healthRecords: {
          orderBy: { eventDate: "desc" },
        },
        medications: {
          where: { isActive: true },
        },
        weightRecords: {
          orderBy: { measurementDate: "desc" },
          take: 10,
        },
        dietPlan: true,
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { message: "Failed to fetch pet" },
      { status: 500 }
    );
  }
}

// PATCH /api/pets/[id] - Update pet
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify pet belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingPet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    const body = await request.json();
    const validated = petSchema.partial().parse(body);

    // Update pet
    const updatedPet = await prisma.pet.update({
      where: { id: params.id },
      data: {
        ...validated,
        dateOfBirth: validated.dateOfBirth
          ? new Date(validated.dateOfBirth)
          : undefined,
        updatedAt: new Date(),
      },
      include: {
        photos: true,
        dietPlan: true,
      },
    });

    return NextResponse.json(updatedPet);
  } catch (error: any) {
    console.error("Error updating pet:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update pet" },
      { status: 500 }
    );
  }
}

// DELETE /api/pets/[id] - Soft delete pet
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify pet belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingPet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    await prisma.pet.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { message: "Failed to delete pet" },
      { status: 500 }
    );
  }
}
