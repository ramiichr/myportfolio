import { NextRequest, NextResponse } from "next/server";
import { getVisitorsByDateRange, validateToken } from "@/lib/visitors-vercel";

export async function GET(request: NextRequest) {
  try {
    // Get authorization token from request header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    // Validate token
    if (!validateToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    // Get visitors filtered by date range
    const visitors = await getVisitorsByDateRange(startDate, endDate);

    return NextResponse.json(visitors, { status: 200 });
  } catch (error) {
    console.error("Error retrieving visitors:", error);
    return NextResponse.json(
      { error: "Failed to retrieve visitor data" },
      { status: 500 }
    );
  }
}
