import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVaccinationReminder, sendMedicationReminder } from "@/lib/email";

// This should be protected by Vercel Cron secret
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find reminders due today that haven't been sent
    const reminders = await prisma.reminder.findMany({
      where: {
        reminderDate: {
          gte: today,
          lt: tomorrow,
        },
        isCompleted: false,
        notificationSent: false,
      },
      include: {
        user: true,
      },
    });

    console.log(`Found ${reminders.length} reminders to send`);

    let sentCount = 0;
    let errorCount = 0;

    for (const reminder of reminders) {
      try {
        if (reminder.reminderType === "VACCINATION") {
          // Get vaccination details
          const vaccination = await prisma.vaccination.findUnique({
            where: { id: reminder.linkedRecordId! },
            include: { pet: true },
          });

          if (vaccination && vaccination.nextDueDate) {
            const daysUntil = Math.ceil(
              (vaccination.nextDueDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            await sendVaccinationReminder(
              reminder.user.email,
              vaccination.pet.name,
              vaccination.vaccineName,
              daysUntil
            );
          }
        } else if (reminder.reminderType === "MEDICATION") {
          // Get medication details
          const medication = await prisma.medication.findUnique({
            where: { id: reminder.linkedRecordId! },
            include: { pet: true },
          });

          if (medication) {
            await sendMedicationReminder(
              reminder.user.email,
              medication.pet.name,
              medication.medicationName,
              `${medication.dosageAmount} ${medication.dosageUnit}`,
              reminder.reminderTime || "Now"
            );
          }
        }

        // Mark as sent
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            notificationSent: true,
            lastNotifiedAt: new Date(),
          },
        });

        sentCount++;
        console.log(`Sent reminder ${reminder.id}`);
      } catch (error) {
        errorCount++;
        console.error(`Failed to send reminder ${reminder.id}:`, error);
        // Continue with other reminders even if one fails
      }
    }

    return NextResponse.json({
      message: "Reminders processed",
      total: reminders.length,
      sent: sentCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error("Error in reminder cron:", error);
    return NextResponse.json(
      { message: "Failed to process reminders" },
      { status: 500 }
    );
  }
}
