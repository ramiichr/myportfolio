import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the category from the query parameter
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Build where clause for filtering
    const where: any = {};

    if (category) {
      where.category = category;
    }

    // Fetch skills from database
    const skills = await prisma.skill.findMany({
      where,
      orderBy: { order: "asc" },
    });

    // Transform database skills to API format
    const skillsData = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      category: skill.category,
    }));

    return NextResponse.json(skillsData);
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
