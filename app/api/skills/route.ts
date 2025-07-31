import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio-data";

export async function GET(request: Request) {
  try {
    // Get the category from the query parameter
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Get all skills
    let skills = portfolioData.skills;

    // Filter by category if provided
    if (category) {
      skills = skills.filter((skill) => skill.category === category);
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
