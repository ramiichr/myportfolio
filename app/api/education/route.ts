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

    // Fetch education from database
    const education = await prisma.education.findMany({
      where: { language: lang },
      orderBy: { order: "asc" },
    });

    // Transform database education to API format
    const educationData = education.map((edu) => ({
      id: edu.educationId,
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      location: edu.location,
      description: JSON.parse(edu.description || "[]"),
    }));

    return NextResponse.json(educationData);
  } catch (error) {
    console.error("Error fetching education data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
