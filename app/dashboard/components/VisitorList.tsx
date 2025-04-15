import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VisitorData, PaginationInfo } from "../types/index";

interface VisitorListProps {
  visitors: VisitorData[];
  pagination?: PaginationInfo;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onLoadClick: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const VisitorList: React.FC<VisitorListProps> = ({
  visitors,
  pagination,
  selectedDate,
  onDateChange,
  onLoadClick,
  currentPage,
  onPageChange,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading visitor data...</p>
      </div>
    );
  }

  if (!visitors) {
    return (
      <div className="text-center py-4">
        <p>Click "Load" to fetch visitor data for the selected date</p>
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No visitor data available for the selected date</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Page</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">IP Address</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">
                Referrer
              </th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(visitor.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className="inline-block max-w-[150px] truncate"
                    title={visitor.page}
                  >
                    {visitor.page === "/" ? "Home" : visitor.page}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {visitor.city && visitor.city !== "Unknown"
                    ? `${visitor.city}, ${visitor.country}`
                    : visitor.country}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {visitor.ip && visitor.ip !== "Unknown"
                    ? visitor.ip
                    : "127.0.0.1"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className="inline-block max-w-[200px] truncate"
                    title={visitor.referrer}
                  >
                    {visitor.referrer}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-between items-center mt-4 mb-2">
          <div className="text-sm text-gray-600">
            Showing {pagination?.currentPage * 10 - 9 || 1} to{" "}
            {Math.min(
              pagination?.currentPage * 10 || 10,
              pagination?.totalVisitors || 0
            )}{" "}
            of {pagination?.totalVisitors || 0} visitors
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage <= 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {/* Page number buttons */}
            <div className="flex space-x-1">
              {Array.from(
                {
                  length: Math.min(5, pagination?.totalPages || 1),
                },
                (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  const totalPages = pagination?.totalPages || 1;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all pages
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start, show pages 1-5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end, show the last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Otherwise show 2 before and 2 after current page
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                        currentPage === pageNum
                          ? "bg-blue-700 text-white font-bold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination?.hasMore}
              className={`px-3 py-1 rounded text-sm ${
                !pagination?.hasMore
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="md:hidden mt-4">
        <h3 className="font-medium text-sm mb-2">
          Tap a visitor to see more details:
        </h3>
        {visitors.map((visitor, index) => {
          return (
            <details key={index} className="mb-2 border rounded-md">
              <summary className="p-3 cursor-pointer font-medium">
                {new Date(visitor.timestamp).toLocaleTimeString()} -{" "}
                {visitor.page === "/" ? "Home" : visitor.page}
              </summary>
              <div className="p-3 pt-0 text-sm space-y-2 border-t">
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {visitor.city && visitor.city !== "Unknown"
                    ? `${visitor.city}, ${visitor.country}`
                    : visitor.country}
                </p>
                <p>
                  <span className="font-medium">IP Address:</span>{" "}
                  {visitor.ip && visitor.ip !== "Unknown"
                    ? visitor.ip
                    : "127.0.0.1"}
                </p>
                <p>
                  <span className="font-medium">Referrer:</span>{" "}
                  {visitor.referrer}
                </p>
                <p>
                  <span className="font-medium">User Agent:</span>{" "}
                  {visitor.userAgent}
                </p>
              </div>
            </details>
          );
        })}

        {/* Mobile Pagination Controls */}
        {pagination && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-600">
              Page {pagination?.currentPage || 1} of{" "}
              {pagination?.totalPages || 1}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`px-2 py-1 rounded text-xs ${
                  currentPage <= 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Prev
              </button>

              {/* Mobile page number buttons - show only 3 for mobile */}
              {Array.from(
                {
                  length: Math.min(3, pagination?.totalPages || 1),
                },
                (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  const totalPages = pagination?.totalPages || 1;
                  if (totalPages <= 3) {
                    // If 3 or fewer pages, show all pages
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    // If near the start, show pages 1-3
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    // If near the end, show the last 3 pages
                    pageNum = totalPages - 2 + i;
                  } else {
                    // Otherwise show 1 before, current, and 1 after
                    pageNum = currentPage - 1 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                        currentPage === pageNum
                          ? "bg-blue-700 text-white font-bold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!pagination?.hasMore}
                className={`px-2 py-1 rounded text-xs ${
                  !pagination?.hasMore
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const VisitorListContainer: React.FC<VisitorListProps> = (props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Information</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span>Detailed visitor information for selected date:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={props.selectedDate}
              onChange={(e) => props.onDateChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={props.onLoadClick}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Load
            </button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VisitorList {...props} />
      </CardContent>
    </Card>
  );
};
