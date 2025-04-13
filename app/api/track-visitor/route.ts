import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the visitor data structure
interface VisitorData {
  ip: string;
  timestamp: string;
  userAgent: string;
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  timezone?: string;
}

// Path to store visitor data
const dataFilePath = path.join(process.cwd(), "data", "visitors.json");

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Get visitor data from IP
async function getLocationFromIp(ip: string): Promise<Partial<VisitorData>> {
  // Try multiple geolocation services for better reliability
  const services = [
    async () => {
      try {
        // Skip ipapi.co for private IPs to avoid unnecessary API calls
        if (
          ip === "127.0.0.1" ||
          ip === "localhost" ||
          ip === "::1" ||
          ip.startsWith("192.168.") ||
          ip.startsWith("10.") ||
          ip.startsWith("::ffff:192.168.") ||
          ip.startsWith("::ffff:10.")
        ) {
          // Use a custom error type that we can identify later
          const privateIpError = new Error("Private IP detected");
          privateIpError.name = "PrivateIpError";
          throw privateIpError;
        }

        // First attempt with ipapi.co
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: { "User-Agent": "Mozilla/5.0 (Portfolio Visitor Tracker)" },
          cache: "no-store",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Handle specific error cases
        if (data.error) {
          // If it's a private IP error, handle it gracefully
          if (
            data.reason === "Private-use IP" ||
            data.reason === "Reserved IP"
          ) {
            throw new Error("Private IP detected by ipapi.co");
          }
          throw new Error(`API error: ${data.error}`);
        }

        // Validate that we got actual location data
        if (!data.country_name && !data.city) {
          throw new Error("No location data returned from ipapi.co");
        }

        return {
          city: data.city || "Unknown City",
          country: data.country_name || "Unknown Country",
          countryCode: data.country_code || "UNK",
          region: data.region || "Unknown Region",
          timezone: data.timezone,
        };
      } catch (error: unknown) {
        // Only log non-private IP errors
        if (error instanceof Error && error.name !== "PrivateIpError") {
          console.error("Failed with ipapi.co:", error);
        }
        throw error; // Throw to try next service
      }
    },
    async () => {
      try {
        // Skip ip-api.com for private IPs - it will return "private range" error
        if (
          ip === "127.0.0.1" ||
          ip === "localhost" ||
          ip === "::1" ||
          ip.startsWith("192.168.") ||
          ip.startsWith("10.") ||
          ip.startsWith("::ffff:192.168.") ||
          ip.startsWith("::ffff:10.")
        ) {
          // Use a custom error type that we can identify later
          const privateIpError = new Error("Private IP detected");
          privateIpError.name = "PrivateIpError";
          throw privateIpError;
        }

        // Second attempt with ip-api.com
        const response = await fetch(`http://ip-api.com/json/${ip}`, {
          cache: "no-store",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === "fail") {
          // Handle private range errors gracefully
          if (
            data.message === "private range" ||
            data.message === "reserved range"
          ) {
            throw new Error("Private IP detected by ip-api.com");
          }
          throw new Error(`API error: ${data.message}`);
        }

        // Validate that we got actual location data
        if (!data.country && !data.city) {
          throw new Error("No location data returned from ip-api.com");
        }

        return {
          city: data.city || "Unknown City",
          country: data.country || "Unknown Country",
          countryCode: data.countryCode || "UNK",
          region: data.regionName || "Unknown Region",
          timezone: data.timezone,
        };
      } catch (error: unknown) {
        // Only log non-private IP errors
        if (error instanceof Error && error.name !== "PrivateIpError") {
          console.error("Failed with ip-api.com:", error);
        }
        throw error; // Throw to try next service
      }
    },
    async () => {
      try {
        // Skip ipinfo.io for private IPs
        if (
          ip === "127.0.0.1" ||
          ip === "localhost" ||
          ip === "::1" ||
          ip.startsWith("192.168.") ||
          ip.startsWith("10.") ||
          ip.startsWith("::ffff:192.168.") ||
          ip.startsWith("::ffff:10.")
        ) {
          // Use a custom error type that we can identify later
          const privateIpError = new Error("Private IP detected");
          privateIpError.name = "PrivateIpError";
          throw privateIpError;
        }

        // Third attempt with ipinfo.io (no API key, limited requests)
        const response = await fetch(`https://ipinfo.io/${ip}/json`, {
          cache: "no-store",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.error) {
          throw new Error(`API error: ${data.error.title}`);
        }

        // Check for bogon (private) IP
        if (data.bogon === true) {
          throw new Error("Private IP detected by ipinfo.io");
        }

        // Parse location if available
        let city = data.city;
        let region = data.region;
        let country = data.country;

        // Validate that we got actual location data
        if (!country && !city) {
          throw new Error("No location data returned from ipinfo.io");
        }

        return {
          city: city || "Unknown City",
          country: country || "Unknown Country",
          countryCode: country || "UNK",
          region: region || "Unknown Region",
          timezone: data.timezone,
        };
      } catch (error: unknown) {
        // Only log non-private IP errors
        if (error instanceof Error && error.name !== "PrivateIpError") {
          console.error("Failed with ipinfo.io:", error);
        }
        throw error;
      }
    },
  ];

  // Try each service in sequence
  for (const service of services) {
    try {
      return await service();
    } catch (error: unknown) {
      // Continue to next service
      continue;
    }
  }

  // If all services fail, use IP address to extract some basic info
  // For private IPs, this is expected behavior, so use a less alarming log level
  if (
    ip.includes("192.168.") ||
    ip.includes("10.") ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("::ffff:192.168.") ||
    ip.startsWith("::ffff:10.")
  ) {
    console.log("Using local network info for private IP:", ip);
  } else {
    console.warn("All geolocation services failed, using fallback for IP:", ip);
  }

  // Check for private IP ranges directly
  const isPrivateIP = (ipToCheck: string): boolean => {
    // Handle IPv6 mapped IPv4 addresses
    if (ipToCheck.startsWith("::ffff:")) {
      ipToCheck = ipToCheck.substring(7);
    }

    // Check for localhost
    if (
      ipToCheck === "127.0.0.1" ||
      ipToCheck === "localhost" ||
      ipToCheck === "::1"
    ) {
      return true;
    }

    // Check for private IPv4 ranges
    if (
      ipToCheck.startsWith("10.") ||
      ipToCheck.startsWith("192.168.") ||
      (ipToCheck.startsWith("172.") &&
        parseInt(ipToCheck.split(".")[1]) >= 16 &&
        parseInt(ipToCheck.split(".")[1]) <= 31)
    ) {
      return true;
    }

    // Check for IPv6 local addresses
    if (
      ipToCheck === "::1" ||
      ipToCheck.startsWith("fc00:") ||
      ipToCheck.startsWith("fd")
    ) {
      return true;
    }

    return false;
  };

  // For local/private IPs
  if (isPrivateIP(ip)) {
    console.log("Detected private/local IP address, using local network info");
    return {
      city: "Local Network",
      country: "Development Environment",
      countryCode: "LAN",
      region: "Internal",
    };
  }

  // For any other IP that we couldn't geolocate
  return {
    city: "Unknown Location",
    country: "Unknown",
    countryCode: "UNK",
    region: "Unknown",
  };
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectoryExists();

    // Get the visitor's IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get location data
    const locationData = await getLocationFromIp(ip);

    // Create visitor data object
    const visitorData: VisitorData = {
      ip,
      timestamp: new Date().toISOString(),
      userAgent,
      ...locationData,
    };

    // Read existing data
    let visitors: VisitorData[] = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf-8");
      visitors = JSON.parse(fileContent);
    }

    // Add new visitor data
    visitors.push(visitorData);

    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(visitors, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to retrieve visitor data (protected in production)
export async function GET(request: NextRequest) {
  try {
    ensureDataDirectoryExists();

    // In a production environment, you should add authentication here
    // to ensure only authorized users can access this data

    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ visitors: [] });
    }

    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    const visitors = JSON.parse(fileContent);

    return NextResponse.json({ visitors });
  } catch (error: unknown) {
    console.error("Error retrieving visitor data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve visitor data" },
      { status: 500 }
    );
  }
}
