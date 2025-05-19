/**
 * Utility functions for accessing the ipbase.com geolocation API
 */

interface IpbaseResponse {
  data: {
    ip: string;
    location?: {
      country?: {
        name?: string;
        code?: string;
      };
      city?: {
        name?: string;
      };
    };
  };
}

/**
 * Get geolocation data from ipbase.com for a specific IP address
 */
export async function getIpbaseData(
  ip: string
): Promise<{ country: string; city: string } | null> {
  try {
    const apiKey = process.env.IPBASE_API_KEY;

    if (!apiKey) {
      console.warn(
        "IPBASE_API_KEY environment variable is not set. Using fallback geolocation."
      );
      return null;
    }

    const url = `https://api.ipbase.com/v2/info?ip=${ip}&apikey=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ipbase: ${response.status}`);
    }

    const data = (await response.json()) as IpbaseResponse;

    return {
      country: data.data.location?.country?.name || "Unknown",
      city: data.data.location?.city?.name || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching geolocation data from ipbase:", error);
    return null;
  }
}
