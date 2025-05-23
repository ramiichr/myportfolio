import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "./DatePicker";
import { VisitorData, PaginationInfo } from "../types/index";
import { formatLocation } from "@/lib/location-utils";

interface VisitorListProps {
  visitors: VisitorData[];
  pagination?: PaginationInfo;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onLoadClick: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  onDeleteVisitors?: (visitorIds: string[]) => Promise<void>;
}

const getBrowserInfo = (userAgent: string): string => {
  const browsers = [
    { name: "Edge", pattern: /Edg/ },
    { name: "Chrome", pattern: /Chrome/ },
    { name: "Firefox", pattern: /Firefox/ },
    { name: "Safari", pattern: /Safari/ },
    { name: "Opera", pattern: /Opera|OPR/ },
    { name: "Internet Explorer", pattern: /Trident|MSIE/ },
  ];

  for (const browser of browsers) {
    if (browser.pattern.test(userAgent)) {
      const match = userAgent.match(
        new RegExp(`${browser.pattern.source}\\/([\\d.]+)`)
      );
      return `${browser.name}${match ? ` ${match[1]}` : ""}`;
    }
  }
  return "Unknown Browser";
};

const getOSInfo = (userAgent: string): string => {
  interface OSVersion {
    [key: string]: string;
  }

  interface OSInfo {
    name: string;
    pattern: RegExp;
    versions?: OSVersion;
    clean?: (v: string) => string;
    specificDistros?: Array<{ pattern: RegExp; name: string }>;
  }

  const os: OSInfo[] = [
    {
      name: "Android",
      pattern: /Android[ /]?(\d+(\.\d+)*)/,
      clean: (v: string) => `Android ${v}`,
    },
    {
      name: "iOS",
      pattern: /iPhone[ /;]OS[ /](\d+[._]\d+)/,
      clean: (v: string) => `iOS ${v.replace(/_/g, ".")}`,
    },
    {
      name: "iPad OS",
      pattern: /iPad.*?OS[ /](\d+[._]\d+)/,
      clean: (v: string) => `iPadOS ${v.replace(/_/g, ".")}`,
    },
    {
      name: "Windows",
      pattern: /Windows NT (\d+\.\d+)/,
      versions: {
        "10.0": "10",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7",
        "6.0": "Vista",
        "5.2": "XP x64",
        "5.1": "XP",
      },
    },
    {
      name: "Mac OS",
      pattern: /Mac OS X (\d+[._]\d+[._]\d+)/,
      clean: (v: string) => `macOS ${v.replace(/_/g, ".")}`,
    },
    {
      name: "Linux",
      pattern: /Linux(?!.*Android)/,
      specificDistros: [
        { pattern: /Ubuntu/, name: "Ubuntu" },
        { pattern: /Fedora/, name: "Fedora" },
        { pattern: /Debian/, name: "Debian" },
        { pattern: /RHEL|Red Hat/, name: "Red Hat" },
        { pattern: /CentOS/, name: "CentOS" },
      ],
    },
  ];

  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    for (const system of os.slice(0, 3)) {
      const match = userAgent.match(system.pattern);
      if (match) {
        return system.clean && match[1] ? system.clean(match[1]) : system.name;
      }
    }
  }

  for (const system of os) {
    const match = userAgent.match(system.pattern);
    if (match) {
      if (system.name === "Windows" && match[1] && system.versions) {
        const version = system.versions[match[1]] || match[1];
        return `Windows ${version}`;
      }
      if (system.name === "Linux" && system.specificDistros) {
        for (const distro of system.specificDistros) {
          if (distro.pattern.test(userAgent)) {
            return distro.name;
          }
        }
        return "Linux";
      }
      if (system.clean && match[1]) {
        return system.clean(match[1]);
      }
      return `${system.name}${match[1] ? ` ${match[1]}` : ""}`;
    }
  }
  return "Unknown OS";
};

const getDeviceInfo = (userAgent: string): string => {
  interface BrandPattern {
    pattern: RegExp;
    name: string | ((match: RegExpMatchArray) => string);
  }

  const brandPatterns: BrandPattern[] = [
    { pattern: /iPhone/, name: "iPhone" },
    { pattern: /iPad/, name: "iPad" },
    { pattern: /Pixel \d/, name: (match: RegExpMatchArray) => match[0] },
    { pattern: /Samsung|SM-[A-Z]\d+|Galaxy/, name: "Samsung" },
    { pattern: /Huawei|HW-/, name: "Huawei" },
    { pattern: /Xiaomi|MI /, name: "Xiaomi" },
    { pattern: /OnePlus/, name: "OnePlus" },
    { pattern: /OPPO/, name: "OPPO" },
  ];

  if (/Mobile|iPhone|Android.*Mobile/i.test(userAgent)) {
    for (const brand of brandPatterns) {
      const match = userAgent.match(brand.pattern);
      if (match) {
        return typeof brand.name === "function"
          ? brand.name(match)
          : brand.name;
      }
    }
    return "Mobile Device";
  }

  if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
    return "Tablet";
  }

  if (/Win64|x64|x86_64/i.test(userAgent)) {
    return "64-bit Desktop";
  }

  if (/WOW64|Win32/i.test(userAgent)) {
    return "32-bit Desktop";
  }

  if (/Macintosh|Mac OS X/i.test(userAgent)) {
    if (/Intel/i.test(userAgent)) {
      return "Intel Mac";
    }
    if (/ARM/i.test(userAgent)) {
      return "Apple Silicon Mac";
    }
    return "Mac";
  }

  return "Desktop";
};

// We now use the centralized location-utils.ts for all location formatting and decoding

// Helper function to format location using our improved utility
const formatVisitorLocation = (visitor: VisitorData): string => {
  if (!visitor.country) return "Unknown";
  return formatLocation(visitor.country, visitor.city);
};

// We now use the centralized location-utils.ts functions for encoding fixes

export const VisitorListContainer: React.FC<VisitorListProps> = (props) => {
  const [selectedVisitors, setSelectedVisitors] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(
        props.visitors.map((v) => v.timestamp.toString())
      );
      setSelectedVisitors(newSelected);
    } else {
      setSelectedVisitors(new Set());
    }
  };

  const handleSelect = (visitorId: string, checked: boolean) => {
    const newSelected = new Set(selectedVisitors);
    if (checked) {
      newSelected.add(visitorId);
    } else {
      newSelected.delete(visitorId);
    }
    setSelectedVisitors(newSelected);
  };

  const handleDelete = async () => {
    if (!props.onDeleteVisitors || selectedVisitors.size === 0) return;

    setIsDeleting(true);
    try {
      await props.onDeleteVisitors(Array.from(selectedVisitors));
      setSelectedVisitors(new Set());
    } catch (error) {
      console.error("Error deleting visitors:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const newDate = e.target.value;
    setTimeout(() => {
      props.onDateChange(newDate);
    }, 0);
  };

  const handleLoadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    props.onLoadClick();
  };

  const handleRowClick = (
    e: React.MouseEvent,
    visitor: VisitorData,
    index: number
  ) => {
    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const visitorId = visitor.timestamp.toString();
      const newSelected = new Set(selectedVisitors);
      if (newSelected.has(visitorId)) {
        newSelected.delete(visitorId);
      } else {
        newSelected.add(visitorId);
      }
      setSelectedVisitors(newSelected);
    } else {
      const details = document.getElementById(`details-${index}`);
      if (details) {
        details.style.display =
          details.style.display === "none" ? "table-row" : "none";
      }
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader className="overflow-visible">
        <CardTitle className="flex justify-between items-center">
          <span>Visitor Information</span>
          {selectedVisitors.size > 0 && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-red-300"
            >
              {isDeleting
                ? "Deleting..."
                : `Delete Selected (${selectedVisitors.size})`}
            </button>
          )}
        </CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 overflow-visible">
          <span>Detailed visitor information for selected date:</span>
          <div className="flex items-center gap-2 relative overflow-visible">
            <DatePicker
              selectedDate={props.selectedDate}
              onDateChange={(date) => {
                props.onDateChange(date);
              }}
            />
            <button
              type="button"
              onClick={handleLoadClick}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Load
            </button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading visitor data...</p>
          </div>
        ) : !props.visitors ? (
          <div className="text-center py-4">
            <p>Click "Load" to fetch visitor data for the selected date</p>
          </div>
        ) : props.visitors.length === 0 ? (
          <div className="text-center py-4">
            <p>No visitor data available for the selected date</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedVisitors.size === props.visitors.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
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
                  {props.visitors.map((visitor, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                        onClick={(e) => handleRowClick(e, visitor, index)}
                        style={{
                          backgroundColor: selectedVisitors.has(
                            visitor.timestamp.toString()
                          )
                            ? "rgba(59, 130, 246, 0.1)"
                            : undefined,
                        }}
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedVisitors.has(
                              visitor.timestamp.toString()
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelect(
                                visitor.timestamp.toString(),
                                e.target.checked
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {new Date(visitor.timestamp).toLocaleTimeString(
                            undefined,
                            {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                          {formatVisitorLocation(visitor)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {visitor.ip && visitor.ip !== "Unknown"
                            ? visitor.ip
                            : "127.0.0.1"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                          <span
                            className="inline-block max-w-[200px] truncate"
                            title={visitor.referrer}
                          >
                            {visitor.referrer}
                          </span>
                        </td>
                      </tr>
                      <tr id={`details-${index}`} style={{ display: "none" }}>
                        <td
                          colSpan={6}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Browser Information
                              </h4>
                              {visitor.userAgent ? (
                                <>
                                  <p className="text-sm mb-1">
                                    <span className="font-medium">
                                      Browser:
                                    </span>{" "}
                                    {getBrowserInfo(visitor.userAgent)}
                                  </p>
                                  <p className="text-sm mb-1">
                                    <span className="font-medium">
                                      Operating System:
                                    </span>{" "}
                                    {getOSInfo(visitor.userAgent)}
                                  </p>
                                  <p className="text-sm mb-1">
                                    <span className="font-medium">Device:</span>{" "}
                                    {getDeviceInfo(visitor.userAgent)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm mb-1">
                                  User Agent information not available
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Visit Details
                              </h4>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Time:</span>{" "}
                                {new Date(visitor.timestamp).toLocaleString()}
                              </p>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Page:</span>{" "}
                                {visitor.page}
                              </p>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Referrer:</span>{" "}
                                {visitor.referrer || "Direct visit"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {props.pagination && (
              <div className="flex justify-between items-center mt-4 mb-2">
                <div className="text-sm text-gray-600">
                  Showing {props.pagination?.currentPage * 10 - 9 || 1} to{" "}
                  {Math.min(
                    props.pagination?.currentPage * 10 || 10,
                    props.pagination?.totalVisitors || 0
                  )}{" "}
                  of {props.pagination?.totalVisitors || 0} visitors
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => props.onPageChange(props.currentPage - 1)}
                    disabled={props.currentPage <= 1}
                    className={`px-3 py-1 rounded text-sm ${
                      props.currentPage <= 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from(
                      {
                        length: Math.min(5, props.pagination?.totalPages || 1),
                      },
                      (_, i) => {
                        let pageNum;
                        const totalPages = props.pagination?.totalPages || 1;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (props.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (props.currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = props.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => props.onPageChange(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                              props.currentPage === pageNum
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
                    onClick={() => props.onPageChange(props.currentPage + 1)}
                    disabled={!props.pagination?.hasMore}
                    className={`px-3 py-1 rounded text-sm ${
                      !props.pagination?.hasMore
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
              {props.visitors.map((visitor, index) => {
                return (
                  <details key={index} className="mb-2 border rounded-md">
                    <summary className="p-3 cursor-pointer font-medium">
                      {new Date(visitor.timestamp).toLocaleTimeString(
                        undefined,
                        { hour12: false, hour: "2-digit", minute: "2-digit" }
                      )}{" "}
                      - {visitor.page === "/" ? "Home" : visitor.page}
                    </summary>
                    <div className="p-3 pt-0 text-sm space-y-2 border-t">
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {formatVisitorLocation(visitor)}
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

              {props.pagination && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-gray-600">
                    Page {props.pagination?.currentPage || 1} of{" "}
                    {props.pagination?.totalPages || 1}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => props.onPageChange(props.currentPage - 1)}
                      disabled={props.currentPage <= 1}
                      className={`px-2 py-1 rounded text-xs ${
                        props.currentPage <= 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Prev
                    </button>

                    {Array.from(
                      {
                        length: Math.min(3, props.pagination?.totalPages || 1),
                      },
                      (_, i) => {
                        let pageNum;
                        const totalPages = props.pagination?.totalPages || 1;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (props.currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (props.currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = props.currentPage - 1 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => props.onPageChange(pageNum)}
                            className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                              props.currentPage === pageNum
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
                      onClick={() => props.onPageChange(props.currentPage + 1)}
                      disabled={!props.pagination?.hasMore}
                      className={`px-2 py-1 rounded text-xs ${
                        !props.pagination?.hasMore
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
        )}
      </CardContent>
    </Card>
  );
};
