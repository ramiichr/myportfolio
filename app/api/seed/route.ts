import { NextResponse } from "next/server";
import { resolvers } from "@/lib/graphql/resolvers";

export async function POST() {
  try {
    // Call the seedDatabase mutation directly
    const result = await resolvers.Mutation.seedDatabase();

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Database seeded successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to seed database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Seeding error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
