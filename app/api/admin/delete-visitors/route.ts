import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/visitors-vercel";

// Flag to track if visitors have been deleted
// This is accessible from the server-side code
declare global {
  var visitorsDeleted: boolean;
}

// Initialize the global variable if it doesn't exist
if (typeof global.visitorsDeleted === "undefined") {
  global.visitorsDeleted = false;
}

export async function POST(request: NextRequest) {
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

    // Set the global flag to indicate visitors have been deleted
    global.visitorsDeleted = true;

    // Clear the server-side visitor cache
    // We need to access this from the visitors-vercel module
    try {
      // This is a more direct approach to ensure the cache is cleared
      const visitorsModule = await import("@/lib/visitors-vercel");
      if (typeof visitorsModule.clearVisitorCache === "function") {
        visitorsModule.clearVisitorCache();
      }
    } catch (err) {
      console.error("Failed to clear visitor cache:", err);
    }

    console.log("Server-side visitors deleted successfully");
    return NextResponse.json(
      { success: true, message: "All visitors deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting visitors:", error);
    return NextResponse.json(
      { error: "Failed to delete visitor data" },
      { status: 500 }
    );
  }
}
