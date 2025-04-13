import { NextRequest, NextResponse } from "next/server";
import { addVisitor } from "@/lib/visitors";

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
    // In production, this will use the actual visitor IP
    if (
      ip === "unknown" ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.")
    ) {
      // Use a fallback public IP for testing in development
      // This is a public IP that will give us some location data
      ip = "8.8.8.8"; // Google's public DNS IP as a fallback
    }

    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer");
    const url = new URL(request.url);
    const path = url.pathname;

    // Get geolocation data
    let geoData = {};

    try {
      // First try with ipinfo.io (no API key required for limited usage)
      const geoResponse = await fetch(`https://ipinfo.io/${ip}/json`);

      if (geoResponse.ok) {
        const data = await geoResponse.json();

        if (data && !data.bogon) {
          // Check if it's not a bogon (private) IP
          geoData = {
            country: data.country,
            region: data.region,
            city: data.city,
            timezone: data.timezone,
          };

          // Add coordinates if available
          if (data.loc) {
            const [latitude, longitude] = data.loc.split(",").map(Number);
            geoData = {
              ...geoData,
              latitude,
              longitude,
            };
          }
        }
      }

      // If ipinfo.io didn't work, try with ip-api.com as a fallback
      if (Object.keys(geoData).length === 0) {
        const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}`);

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();

          if (data && data.status === "success") {
            geoData = {
              country: data.country,
              region: data.regionName,
              city: data.city,
              timezone: data.timezone,
              latitude: data.lat,
              longitude: data.lon,
            };
          }
        }
      }
    } catch (error) {
      // Log the error but continue with the tracking
      console.error("Geolocation lookup failed:", error);
    }

    // Add visitor to the database
    const visitor = addVisitor({
      ip,
      userAgent,
      referrer,
      timestamp: new Date().toISOString(),
      path,
      ...geoData,
    });

    return NextResponse.json(
      { success: true, id: visitor.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}
