import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the language and category from the query parameters
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

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

    // Build where clause for filtering
    const where: any = { language: lang };

    if (category && category !== "all") {
      where.category = category;
    }

    if (featured === "true") {
      where.featured = true;
    }

    // Fetch projects from database
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Transform database projects to API format
    const projectsData = projects.map((project) => ({
      id: project.projectId,
      title: project.title,
      description: project.description,
      tags: JSON.parse(project.tags || "[]"), // ProjectCard expects 'tags'
      category: project.category,
      featured: project.featured,
      image: project.image,
      link: project.link, // ProjectCard expects 'link'
      github: project.github, // ProjectCard expects 'github'
      status: "completed", // Default status as it's not in schema
    }));

    return NextResponse.json(projectsData);
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
