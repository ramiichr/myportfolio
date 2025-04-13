import { NextRequest, NextResponse } from "next/server";
import { clearClickEventCache, validateToken } from "@/lib/visitors-vercel";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;

    // Validate the token
    if (!validateToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear the click event cache
    clearClickEventCache();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "All click events have been deleted",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting click events:", error);
    return NextResponse.json(
      { error: "Failed to delete click events" },
      { status: 500 }
    );
  }
}
