import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = parseFloat(searchParams.get("latitude") || "0");
    const longitude = parseFloat(searchParams.get("longitude") || "0");
    const radius = parseFloat(searchParams.get("radius") || "10");
    const category = searchParams.get("category") || undefined;
    const species = searchParams.get("species") as "DOG" | "CAT" | null;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Fetch all providers (in production, use spatial queries)
    const providers = await prisma.serviceProvider.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(species && { acceptsSpecies: { has: species } }),
      },
    });

    // Filter by distance and calculate distance for each
    const providersWithDistance = providers
      .map((provider) => ({
        ...provider,
        distance: calculateDistance(
          latitude,
          longitude,
          provider.latitude,
          provider.longitude
        ),
      }))
      .filter((provider) => provider.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(providersWithDistance);
  } catch (error) {
    console.error("Error searching providers:", error);
    return NextResponse.json(
      { message: "Failed to search providers" },
      { status: 500 }
    );
  }
}
