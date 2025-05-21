/**
 * Geolocation utilities for processing Vercel's built-in geolocation data
 */
import { cleanLocationString } from "./location-utils";

/**
 * Process and clean geolocation data from Vercel headers
 */
export function processVercelGeolocation(
  countryHeader?: string | null,
  cityHeader?: string | null
): { country: string; city: string } {
  // Clean and normalize the location data
  return {
    country: cleanLocationString(countryHeader || "Unknown"),
    city: cleanLocationString(cityHeader || "Unknown"),
  };
}
