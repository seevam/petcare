import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Calendar, Heart, Plus } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();

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
        where: { nextDueDate: { gte: new Date() } },
        orderBy: { nextDueDate: "asc" },
        take: 1,
      },
    },
    take: 4,
  });

  const upcomingReminders = await prisma.reminder.findMany({
    where: {
      userId: session?.user?.id,
      isCompleted: false,
      reminderDate: { gte: new Date() },
    },
    orderBy: { reminderDate: "asc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your pets and upcoming tasks.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              Active pet profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Reminders
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Tasks to complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Health Records
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.reduce((acc, pet) => acc + (pet.vaccinations?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Vaccinations tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">My Pets</h2>
          <Link href="/pets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </Link>
        </div>

        {pets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pets yet</h3>
              <p className="text-gray-600 mb-4 text-center">
                Get started by adding your first pet profile
              </p>
              <Link href="/pets/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Pet
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <Link key={pet.id} href={`/pets/${pet.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {pet.photos[0]?.url ? (
                        <img
                          src={pet.photos[0].url}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PawPrint className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.breed || pet.species}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pet.vaccinations[0]?.nextDueDate && (
                      <div className="text-sm text-muted-foreground">
                        Next vaccination:{" "}
                        {new Date(pet.vaccinations[0].nextDueDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Reminders</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-gray-600">
                        {reminder.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(reminder.reminderDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
