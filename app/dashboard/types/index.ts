export interface VisitorData {
  page: string;
  referrer: string;
  userAgent: string;
  country?: string;
  city?: string;
  timestamp: number;
  ip: string;
}

export interface PaginationInfo {
  totalVisitors: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface VisitorStats {
  totalPageviews: number;
  pageviewsByPage: Record<string, number>;
  pageviewsByDate: Record<string, number>;
  uniqueVisitors: Record<string, number>;
  visitors?: VisitorData[];
  pagination?: PaginationInfo;
}

export interface ChartDataPoint {
  date: string;
  views?: number;
  visitors?: number;
}

export interface PageViewDataPoint {
  page: string;
  views: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}
