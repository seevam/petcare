import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { vaccinationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("petId");

    if (!petId) {
      return NextResponse.json(
        { message: "Pet ID required" },
        { status: 400 }
      );
    }

    // Verify pet belongs to user
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        userId: userId,
      },
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    const vaccinations = await prisma.vaccination.findMany({
      where: { petId },
      orderBy: { dateAdministered: "desc" },
    });

    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    return NextResponse.json(
      { message: "Failed to fetch vaccinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = vaccinationSchema.parse(body);

    // Verify pet belongs to user
    const pet = await prisma.pet.findFirst({
      where: {
        id: validated.petId,
        userId: userId,
      },
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    // Create vaccination record
    const vaccination = await prisma.vaccination.create({
      data: {
        petId: validated.petId,
        vaccineName: validated.vaccineName,
        dateAdministered: new Date(validated.dateAdministered),
        nextDueDate: validated.nextDueDate
          ? new Date(validated.nextDueDate)
          : null,
        clinicName: validated.clinicName,
        veterinarianName: validated.veterinarianName,
        lotNumber: validated.lotNumber,
        reactionNotes: validated.reactionNotes,
      },
    });

    // Create reminders if next due date is set
    if (validated.nextDueDate) {
      const dueDate = new Date(validated.nextDueDate);

      // Create reminders at 7, 3, and 1 days before
      const reminderDays = [7, 3, 1];

      for (const days of reminderDays) {
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(reminderDate.getDate() - days);

        // Only create reminder if it's in the future
        if (reminderDate > new Date()) {
          await prisma.reminder.create({
            data: {
              userId: userId,
              petId: validated.petId,
              reminderType: "VACCINATION",
              title: `${validated.vaccineName} due soon`,
              description: `${pet.name}'s ${validated.vaccineName} is due in ${days} day${
                days > 1 ? "s" : ""
              }`,
              reminderDate: reminderDate,
              linkedRecordId: vaccination.id,
            },
          });
        }
      }
    }

    return NextResponse.json(vaccination, { status: 201 });
  } catch (error: any) {
    console.error("Error creating vaccination:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create vaccination" },
      { status: 500 }
    );
  }
}
