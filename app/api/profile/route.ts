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

    // Fetch profile from database
    const profile = await prisma.profile.findFirst({
      where: { language: lang },
    });

    if (!profile) {
      return NextResponse.json(
        { error: `Profile not found for language: ${lang}` },
        { status: 404 }
      );
    }

    // Transform database profile to API format
    const profileData = {
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      description: profile.description, // Use description instead of summary
      avatar: "/rami.png", // Default avatar as not in schema
      social: {
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        website: "", // Not in current schema
      },
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
