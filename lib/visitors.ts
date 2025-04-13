import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Visitor } from "@/types";

// Define the path for storing visitor data
const DATA_DIR = path.join(process.cwd(), "data");
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json");

// Ensure the data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(VISITORS_FILE)) {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify([]));
  }
}

// Get all visitors
export function getVisitors(): Visitor[] {
  ensureDataDir();

  try {
    const data = fs.readFileSync(VISITORS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading visitors file:", error);
    return [];
  }
}

// Add a new visitor
export function addVisitor(visitorData: Omit<Visitor, "id">): Visitor {
  const visitors = getVisitors();

  const newVisitor: Visitor = {
    id: uuidv4(),
    ...visitorData,
  };

  visitors.push(newVisitor);

  try {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
    return newVisitor;
  } catch (error) {
    console.error("Error writing to visitors file:", error);
    throw new Error("Failed to save visitor data");
  }
}

// Get visitors filtered by date range
export function getVisitorsByDateRange(
  startDate?: string,
  endDate?: string
): Visitor[] {
  const visitors = getVisitors();

  if (!startDate && !endDate) {
    return visitors;
  }

  return visitors.filter((visitor) => {
    const visitorDate = new Date(visitor.timestamp);

    if (startDate && endDate) {
      return (
        visitorDate >= new Date(startDate) && visitorDate <= new Date(endDate)
      );
    }

    if (startDate) {
      return visitorDate >= new Date(startDate);
    }

    if (endDate) {
      return visitorDate <= new Date(endDate);
    }

    return true;
  });
}

// Validate API token
export function validateToken(token: string | null): boolean {
  if (!token) return false;

  const validToken = process.env.VISITOR_API_TOKEN;
  return token === validToken;
}
