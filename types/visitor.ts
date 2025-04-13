// Define the visitor data structure
export interface VisitorData {
  ip: string;
  timestamp: string;
  userAgent: string;
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  timezone?: string;
}
