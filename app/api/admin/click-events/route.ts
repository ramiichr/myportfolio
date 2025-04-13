import { NextRequest, NextResponse } from "next/server";
import { getClickEvents } from "@/lib/visitors-vercel";
import { validateToken } from "@/lib/visitors-vercel";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;

    // Validate the token
    if (!validateToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Get all click events
    const clickEvents = await getClickEvents();

    // Filter by date if parameters are provided
    let filteredClickEvents = clickEvents;
    if (startDate || endDate) {
      filteredClickEvents = clickEvents.filter((event) => {
        const eventDate = new Date(event.timestamp);

        if (startDate && endDate) {
          return (
            eventDate >= new Date(startDate) && eventDate <= new Date(endDate)
          );
        }

        if (startDate) {
          return eventDate >= new Date(startDate);
        }

        if (endDate) {
          return eventDate <= new Date(endDate);
        }

        return true;
      });
    }

    // Return the filtered click events
    return NextResponse.json(filteredClickEvents, { status: 200 });
  } catch (error) {
    console.error("Error retrieving click events:", error);
    return NextResponse.json(
      { error: "Failed to retrieve click events" },
      { status: 500 }
    );
  }
}
