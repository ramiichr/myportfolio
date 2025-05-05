import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio-data";

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

    // Return the experiences data for the requested language
    return NextResponse.json(
      portfolioData.experiences[lang as "en" | "de" | "fr"]
    );
  } catch (error) {
    console.error("Error fetching experiences data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
