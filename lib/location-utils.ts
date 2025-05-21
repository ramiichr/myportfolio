/**
 * Location utilities for handling encoding issues
 */

/**
 * Clean and normalize location strings to fix common encoding problems
 */
export function cleanLocationString(text: string | undefined): string {
  if (!text || text === "Unknown") return "Unknown";

  try {
    // Attempt URI decoding
    try {
      text = decodeURIComponent(text);
    } catch (e) {
      // Ignore decodeURI errors
    }

    // Handle HTML entities
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, code) =>
        String.fromCharCode(parseInt(code, 10))
      );

    // Handle UTF-8 double encoding issues
    const charMap: Record<string, string> = {
      "Ã¼": "ü",
      "Ã¶": "ö",
      "Ã¤": "ä",
      "Ã–": "Ö",
      Ãœ: "Ü",
      "Ã„": "Ä",
      ÃŸ: "ß",
      "Ã©": "é",
      "Ã¨": "è",
      "Ã¡": "á",
      "Ã³": "ó",
      "Ã±": "ñ",
      Â: "",
      Ã: "í",
    };

    for (const [encoded, decoded] of Object.entries(charMap)) {
      text = text.replace(new RegExp(encoded, "g"), decoded);
    }

    // Try standard unicode normalization
    if (typeof text.normalize === "function") {
      text = text.normalize("NFC");
    }

    return text.trim();
  } catch (error) {
    console.error("Error cleaning location string:", error);
    return text;
  }
}

/**
 * Format visitor location data with proper decoding
 * @param country Country name
 * @param city City name (optional)
 * @returns Properly formatted location string
 */
export function formatLocation(country?: string, city?: string): string {
  if (!country) return "Unknown";

  const cleanCountry = cleanLocationString(country);

  if (city && city !== "Unknown") {
    const cleanCity = cleanLocationString(city);
    return `${cleanCity}, ${cleanCountry}`;
  }

  return cleanCountry;
}
