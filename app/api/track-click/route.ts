import { NextRequest, NextResponse } from "next/server";
import { addClickEvent } from "@/lib/visitors-vercel";

export async function POST(request: NextRequest) {
  try {
    // Get visitor information from request
    let ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // If the IP contains multiple addresses (common with proxies), take the first one
    if (ip && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // For local development, use a fallback IP to get real geolocation data
    if (
      ip === "unknown" ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.")
    ) {
      ip = "8.8.8.8"; // Google's public DNS IP as a fallback
    }

    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer");

    // Parse the request body to get click information
    let clickData;
    try {
      const body = await request.json();
      clickData = {
        elementId: body.elementId || "unknown",
        elementType: body.elementType || "unknown",
        elementText: body.elementText || "",
        elementPath: body.elementPath || "",
        currentPath: body.currentPath || "/",
        x: body.x || 0,
        y: body.y || 0,
      };
    } catch (error) {
      console.error("Error parsing click data:", error);
      clickData = {
        elementId: "unknown",
        elementType: "unknown",
        elementText: "",
        elementPath: "",
        currentPath: "/",
        x: 0,
        y: 0,
      };
    }

    // Add click event to the database
    const clickEvent = await addClickEvent({
      ip,
      userAgent,
      referrer,
      timestamp: new Date().toISOString(),
      ...clickData,
    });

    return NextResponse.json(
      { success: true, id: clickEvent.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tracking click event:", error);
    return NextResponse.json(
      { error: "Failed to track click event" },
      { status: 500 }
    );
  }
}
