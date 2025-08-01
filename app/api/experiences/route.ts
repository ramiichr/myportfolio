import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the language from the query parameter
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    // Validate language
    if (lang !== "en" && lang !== "de" && lang !== "fr") {
      return NextResponse.json(
        {
          error:
            "Invalid language. Supported languages are 'en', 'de', and 'fr'.",
        },
        { status: 400 }
      );
    }

    // Fetch experiences from database
    const experiences = await prisma.experience.findMany({
      where: { language: lang },
      orderBy: { order: "asc" },
    });

    // Transform database experiences to API format
    const experiencesData = experiences.map((exp) => ({
      id: exp.experienceId,
      position: exp.position,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: JSON.parse(exp.description || "[]"),
    }));

    return NextResponse.json(experiencesData);
  } catch (error) {
    console.error("Error fetching experiences data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
