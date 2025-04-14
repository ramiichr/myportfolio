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
  ip: string;
}

// Constants
const REDIS_KEYS = {
  TOTAL_PAGEVIEWS: "total_pageviews",
  PAGEVIEWS_BY_PAGE: "pageviews_by_page",
  PAGEVIEWS_BY_DATE: "pageviews_by_date",
  VISITORS_PREFIX: "visitors:",
  UNIQUE_VISITORS_PREFIX: "unique_visitors:",
};

const EXPIRATION_TIME = 60 * 60 * 24 * 30; // 30 days in seconds
const MAX_VISITOR_ENTRIES = 999;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Helper function to get client IP from request headers
 */
async function getClientIp(request: NextRequest): Promise<string> {
  const headersList = await headers();

  // Get the client IP address from various headers
  let ip =
    request.headers.get("x-forwarded-for") ||
    headersList.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    headersList.get("x-real-ip") ||
    "127.0.0.1"; // Use localhost IP as fallback

  // If the IP is a comma-separated list, take the first one (client IP)
  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  return ip;
}

/**
 * Helper function to get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Helper function to authenticate API requests
 */
function authenticateRequest(request: NextRequest): {
  isAuthenticated: boolean;
  response?: NextResponse;
} {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { success: false, error: "Invalid authorization header format" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(" ")[1];

  if (!token || token !== process.env.VISITOR_API_TOKEN) {
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      ),
    };
  }

  return { isAuthenticated: true };
}

/**
 * Helper function to parse visitor data from Redis
 */
function parseVisitorData(item: any): VisitorData | null {
  try {
    // If item is already an object (not a string), return it directly
    if (typeof item === "object" && item !== null) {
      const visitorObj = item as any;

      // Ensure IP is present (for backward compatibility)
      if (!visitorObj.ip) {
        visitorObj.ip = "127.0.0.1"; // Use localhost IP as fallback
      }
      return visitorObj as VisitorData;
    }

    // If item is a string that looks like "[object Object]", skip it
    if (typeof item === "string" && item === "[object Object]") {
      return null;
    }

    // Otherwise parse it as JSON
    const parsedItem = JSON.parse(item) as VisitorData;

    // Ensure IP is present (for backward compatibility)
    if (!parsedItem.ip) {
      parsedItem.ip = "127.0.0.1"; // Use localhost IP as fallback
    }

    return parsedItem;
  } catch (e) {
    console.error("Error parsing visitor data:", e);
    return null;
  }
}

/**
 * POST handler for tracking page views
 */
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
    const ip = await getClientIp(request);

    // Get geo information if available (from Vercel headers)
    const country = request.headers.get("x-vercel-ip-country") || "Unknown";
    const city = request.headers.get("x-vercel-ip-city") || "Unknown";

    const timestamp = Date.now();
    const date = getTodayDate();

    // Store visitor data
    const visitorData: VisitorData = {
      page,
      referrer,
      userAgent,
      country,
      city,
      timestamp,
      ip,
    };

    // Store analytics data in Redis
    await Promise.all([
      // Increment total page views
      redis.incr(REDIS_KEYS.TOTAL_PAGEVIEWS),

      // Increment page-specific views
      redis.hincrby(REDIS_KEYS.PAGEVIEWS_BY_PAGE, page, 1),

      // Increment daily views
      redis.hincrby(REDIS_KEYS.PAGEVIEWS_BY_DATE, date, 1),

      // Store visitor data
      (async () => {
        const visitorKey = `${REDIS_KEYS.VISITORS_PREFIX}${date}`;
        await redis.lpush(visitorKey, JSON.stringify(visitorData));
        await redis.ltrim(visitorKey, 0, MAX_VISITOR_ENTRIES);
        await redis.expire(visitorKey, EXPIRATION_TIME);
      })(),

      // Track unique visitors
      (async () => {
        const ipHash = Buffer.from(ip).toString("base64");
        const uniqueVisitorKey = `${REDIS_KEYS.UNIQUE_VISITORS_PREFIX}${date}`;
        await redis.sadd(uniqueVisitorKey, ipHash);
        await redis.expire(uniqueVisitorKey, EXPIRATION_TIME);
      })(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, message: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving visitor stats
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(request);
    if (!auth.isAuthenticated) {
      return auth.response;
    }

    // Get query parameters
    const url = new URL(request.url);
    const getVisitors = url.searchParams.get("visitors") === "true";
    const date = url.searchParams.get("date") || getTodayDate();
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = DEFAULT_PAGE_SIZE;

    // Fetch basic stats
    const [totalPageviews, pageviewsByPage, pageviewsByDate] =
      await Promise.all([
        redis.get(REDIS_KEYS.TOTAL_PAGEVIEWS) || 0,
        redis.hgetall(REDIS_KEYS.PAGEVIEWS_BY_PAGE) || {},
        redis.hgetall(REDIS_KEYS.PAGEVIEWS_BY_DATE) || {},
      ]);

    // Get unique visitors count for the last 30 days
    const today = new Date();
    const uniqueVisitorPromises = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const uniqueVisitorKey = `${REDIS_KEYS.UNIQUE_VISITORS_PREFIX}${dateStr}`;

      return redis
        .scard(uniqueVisitorKey)
        .then((count) => [dateStr, count || 0] as const);
    });

    const uniqueVisitorEntries = await Promise.all(uniqueVisitorPromises);
    const uniqueVisitorCounts = Object.fromEntries(uniqueVisitorEntries);

    // If visitors data is requested, fetch the visitor list for the specified date
    let visitorsList: VisitorData[] = [];
    let totalVisitors = 0;
    let pagination = undefined;

    if (getVisitors) {
      const visitorKey = `${REDIS_KEYS.VISITORS_PREFIX}${date}`;

      // Get total count and fetch paginated visitors
      totalVisitors = await redis.llen(visitorKey);

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;

      const rawVisitorData = await redis.lrange(
        visitorKey,
        startIndex,
        endIndex
      );

      // Process the visitor data
      visitorsList = rawVisitorData
        .map(parseVisitorData)
        .filter(Boolean) as VisitorData[];

      // Create pagination info
      pagination = {
        totalVisitors,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalVisitors / pageSize),
        hasMore: page * pageSize < totalVisitors,
      };
    }

    return NextResponse.json({
      success: true,
      totalPageviews,
      pageviewsByPage,
      pageviewsByDate,
      uniqueVisitors: uniqueVisitorCounts,
      visitors: getVisitors ? visitorsList : undefined,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visitor stats" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for clearing all visitor data
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(request);
    if (!auth.isAuthenticated) {
      return auth.response;
    }

    // Get all keys related to visitor tracking
    const keys = await redis.keys(`${REDIS_KEYS.VISITORS_PREFIX}*`);
    const uniqueVisitorKeys = await redis.keys(
      `${REDIS_KEYS.UNIQUE_VISITORS_PREFIX}*`
    );

    // Delete all visitor data
    const deletePromises = [
      // Reset counters
      redis.set(REDIS_KEYS.TOTAL_PAGEVIEWS, 0),
      redis.del(REDIS_KEYS.PAGEVIEWS_BY_PAGE),
      redis.del(REDIS_KEYS.PAGEVIEWS_BY_DATE),

      // Delete visitor lists
      ...keys.map((key) => redis.del(key)),

      // Delete unique visitor sets
      ...uniqueVisitorKeys.map((key) => redis.del(key)),
    ];

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "All visitor data has been successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting visitor data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete visitor data" },
      { status: 500 }
    );
  }
}
