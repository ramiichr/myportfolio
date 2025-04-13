import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { headers } from "next/headers";

// Define the structure of visitor data
interface VisitorData {
  page: string;
  referrer: string;
  userAgent: string;
  country?: string;
  city?: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check if tracking is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") {
      return NextResponse.json(
        { success: false, message: "Tracking disabled" },
        { status: 200 }
      );
    }

    // Parse the request body
    const data = await request.json();
    const { page } = data;

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Page is required" },
        { status: 400 }
      );
    }

    // Get visitor information
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "Unknown";
    const referrer = headersList.get("referer") || "Direct";
    const ip =
      request.headers.get("x-forwarded-for") ||
      headersList.get("x-forwarded-for") ||
      "Unknown";

    // Get geo information if available (from Vercel headers)
    const country = request.headers.get("x-vercel-ip-country") || "Unknown";
    const city = request.headers.get("x-vercel-ip-city") || "Unknown";

    const timestamp = Date.now();
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Store visitor data
    const visitorData: VisitorData = {
      page,
      referrer,
      userAgent,
      country,
      city,
      timestamp,
    };

    // Increment total page views
    await redis.incr("total_pageviews");

    // Increment page-specific views
    await redis.hincrby("pageviews_by_page", page, 1);

    // Increment daily views
    await redis.hincrby("pageviews_by_date", date, 1);

    // Store visitor data in a time-series list (limit to last 1000 entries)
    const visitorKey = `visitors:${date}`;
    await redis.lpush(visitorKey, JSON.stringify(visitorData));
    await redis.ltrim(visitorKey, 0, 999);

    // Set expiration for the visitor data (30 days)
    await redis.expire(visitorKey, 60 * 60 * 24 * 30);

    // Track unique visitors using IP addresses (hashed for privacy)
    const ipHash = Buffer.from(ip).toString("base64");
    const uniqueVisitorKey = `unique_visitors:${date}`;
    await redis.sadd(uniqueVisitorKey, ipHash);
    await redis.expire(uniqueVisitorKey, 60 * 60 * 24 * 30);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, message: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

// API endpoint to get visitor stats (protected by API token)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Verify API token
    if (token !== process.env.VISITOR_API_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stats from Redis
    const totalPageviews = (await redis.get("total_pageviews")) || 0;
    const pageviewsByPage = (await redis.hgetall("pageviews_by_page")) || {};
    const pageviewsByDate = (await redis.hgetall("pageviews_by_date")) || {};

    // Get unique visitors count for the last 30 days
    const today = new Date();
    const uniqueVisitorCounts: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const uniqueVisitorKey = `unique_visitors:${dateStr}`;
      const uniqueCount = (await redis.scard(uniqueVisitorKey)) || 0;
      uniqueVisitorCounts[dateStr] = uniqueCount;
    }

    return NextResponse.json({
      totalPageviews,
      pageviewsByPage,
      pageviewsByDate,
      uniqueVisitors: uniqueVisitorCounts,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor stats" },
      { status: 500 }
    );
  }
}
