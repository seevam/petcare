import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, PawPrint } from "lucide-react";

export default async function PetsPage() {
  const session = await getServerSession(authOptions);

  const pets = await prisma.pet.findMany({
    where: {
      userId: session?.user?.id,
      isActive: true,
    },
    include: {
      photos: {
        where: { isPrimary: true },
        take: 1,
      },
      vaccinations: {
        take: 1,
        orderBy: { dateAdministered: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Pets</h1>
          <p className="text-gray-600 mt-2">
            Manage your pet profiles and health records
          </p>
        </div>
        <Link href="/pets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Button>
        </Link>
      </div>

      {pets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <PawPrint className="h-20 w-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No pets yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start by adding your first pet profile. You can track vaccinations,
              health records, and more!
            </p>
            <Link href="/pets/new">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Pet
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Link key={pet.id} href={`/pets/${pet.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {pet.photos[0]?.url ? (
                      <img
                        src={pet.photos[0].url}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PawPrint className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <CardDescription>
                    {pet.breed || "Mixed Breed"} • {pet.species}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {pet.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">
                          {Math.floor(
                            (new Date().getTime() - new Date(pet.dateOfBirth).getTime()) /
                              (1000 * 60 * 60 * 24 * 365)
                          )}{" "}
                          years
                        </span>
                      </div>
                    )}
                    {pet.weightLbs && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{pet.weightLbs} lbs</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">
                        {pet.gender?.toLowerCase() || "Unknown"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
