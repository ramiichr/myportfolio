import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio-data";

export async function GET(request: Request) {
  try {
    // Get the language from the query parameter
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    // Validate language
    if (lang !== "en" && lang !== "de") {
      return NextResponse.json(
        { error: "Invalid language. Supported languages are 'en' and 'de'." },
        { status: 400 }
      );
    }

    // Return the profile data for the requested language
    return NextResponse.json(portfolioData.profile[lang as "en" | "de"]);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
