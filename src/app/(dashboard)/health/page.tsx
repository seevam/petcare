import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default async function HealthPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600 mt-2">
          Manage vaccinations, medications, and health history for your pets
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Management
          </CardTitle>
          <CardDescription>
            Track vaccinations, medications, and medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page is under development. You'll soon be able to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Track vaccination records and schedules</li>
            <li>Manage medications and dosages</li>
            <li>Store health records and veterinary visits</li>
            <li>Upload medical documents and certificates</li>
            <li>Set up automated health reminders</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
