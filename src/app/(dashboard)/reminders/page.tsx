import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default async function RemindersPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="text-gray-600 mt-2">
          Stay on top of vaccinations, medications, and appointments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Reminders
          </CardTitle>
          <CardDescription>
            Never miss important pet care tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page is under development. You'll soon be able to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>View all upcoming reminders in one place</li>
            <li>Get automated email notifications</li>
            <li>Create custom reminders for any task</li>
            <li>Set recurring reminders (weekly, monthly, etc.)</li>
            <li>Mark reminders as complete</li>
            <li>Sync with your calendar app</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
