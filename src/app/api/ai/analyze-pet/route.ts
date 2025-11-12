import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { analyzePetPhoto } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, species } = await request.json();

    if (!imageUrl || !species) {
      return NextResponse.json(
        { message: "Image URL and species are required" },
        { status: 400 }
      );
    }

    if (!["DOG", "CAT"].includes(species)) {
      return NextResponse.json(
        { message: "Species must be DOG or CAT" },
        { status: 400 }
      );
    }

    const analysis = await analyzePetPhoto(imageUrl, species);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error analyzing pet photo:", error);
    return NextResponse.json(
      { message: "Failed to analyze pet photo", error: error.message },
      { status: 500 }
    );
  }
}
