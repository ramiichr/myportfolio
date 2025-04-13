import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/visitors-vercel";

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

    // Check the global deletion flag
    const isDeleted = global.visitorsDeleted === true;

    // Check the visitor cache size
    const visitorsModule = await import("@/lib/visitors-vercel");
    let cacheSize = 0;

    if (typeof visitorsModule.getVisitorCacheSize === "function") {
      cacheSize = visitorsModule.getVisitorCacheSize();
    }

    return NextResponse.json(
      {
        isDeleted,
        cacheSize,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking deletion status:", error);
    return NextResponse.json(
      { error: "Failed to check deletion status" },
      { status: 500 }
    );
  }
}
