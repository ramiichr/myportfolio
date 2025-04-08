import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio-data";

export async function GET(request: Request) {
  try {
    // Get the language and category from the query parameters
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    // Validate language
    if (lang !== "en" && lang !== "de") {
      return NextResponse.json(
        { error: "Invalid language. Supported languages are 'en' and 'de'." },
        { status: 400 }
      );
    }

    // Get projects for the requested language
    let projects = portfolioData.projects[lang as "en" | "de"];

    // Filter by category if provided
    if (category && category !== "all") {
      projects = projects.filter((project) => project.category === category);
    }

    // Filter by featured if provided
    if (featured === "true") {
      projects = projects.filter((project) => project.featured);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // This would typically validate the request and add a new project
    // For now, we'll just return a success message
    return NextResponse.json(
      { message: "Project added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
