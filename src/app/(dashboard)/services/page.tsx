import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default async function ServicesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
        <p className="text-gray-600 mt-2">
          Discover veterinarians, groomers, trainers, and other pet services near you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Provider Directory
          </CardTitle>
          <CardDescription>
            Find trusted pet care professionals in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page is under development. You'll soon be able to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Search for veterinarians and emergency vets</li>
            <li>Find groomers and pet boarding facilities</li>
            <li>Locate dog trainers and behaviorists</li>
            <li>View ratings, reviews, and contact information</li>
            <li>Filter by services, hours, and accepted species</li>
            <li>Get directions and save favorite providers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
