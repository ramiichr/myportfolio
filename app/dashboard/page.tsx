"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import custom hooks
import {
  useAuth,
  useVisitorStats,
  useDataManagement,
  useChartData,
} from "./hooks/index";

// Import components
import { AuthForm, LoadingSpinner } from "./components/index";
import { VisitorListContainer } from "./components/VisitorList";
import { DashboardActions } from "./components/DashboardActions";
import { StatsCards } from "./components/StatsCards";
import { ErrorDisplay } from "./components/ErrorDisplay";
import {
  PageViewsChart,
  VisitorsChart,
  PopularPagesChart,
} from "./components/charts/index";

export default function DashboardPage() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("pageviews");

  // Authentication state and methods
  const {
    apiToken,
    inputToken,
    setInputToken,
    setApiToken,
    handleLogout,
    isAuthenticated,
  } = useAuth();

  // Visitor stats state and methods
  const {
    stats,
    loading,
    loadingVisitors,
    error,
    currentPage,
    setCurrentPage,
    selectedDate,
    setSelectedDate,
    fetchStats,
    resetError,
    setStats,
  } = useVisitorStats();

  // Data management state and methods
  const {
    isDeleting,
    deleteConfirmation,
    setDeleteConfirmation,
    handleDeleteAllData,
  } = useDataManagement();

  // Chart data processing
  const { pageViewsData, dailyViewsData, uniqueVisitorsData, chartColors } =
    useChartData(stats);

  // Initial data fetch on component mount
  useEffect(() => {
    if (apiToken) {
      fetchStats(apiToken);
    }
  }, [apiToken, fetchStats]);

  // Handle form submission for API token
  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    setApiToken(inputToken);
    fetchStats(inputToken);
  };

  // Handle loading visitors for a specific date
  const handleLoadVisitors = (e?: React.MouseEvent) => {
    // Prevent any default form submission and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Reset to page 1 when loading new data
    setCurrentPage(1);

    // Make sure we're on the visitor-list tab
    setActiveTab("visitor-list");

    // Use setTimeout to ensure this happens outside the current event cycle
    setTimeout(() => {
      fetchStats(apiToken, true, 1);
    }, 0);
  };

  // Handle page change in visitor list
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActiveTab("visitor-list"); // Ensure we stay on the visitor list tab

    // Use setTimeout to ensure this happens outside the current event cycle
    setTimeout(() => {
      fetchStats(apiToken, true, page);
    }, 0);
  };

  // Handle deletion of selected visitors
  const handleDeleteVisitors = async (visitorIds: string[]) => {
    try {
      const response = await fetch("/api/track", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          visitorIds,
          date: selectedDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete visitors");
      }

      // Update stats with the new counts
      if (stats) {
        const updatedStats = {
          ...stats,
          totalPageviews: stats.totalPageviews + (data.updatedPageViews || 0),
          pageviewsByDate: {
            ...stats.pageviewsByDate,
            [selectedDate]:
              (stats.pageviewsByDate[selectedDate] || 0) +
              (data.updatedPageViews || 0),
          },
        };
        setStats(updatedStats);
      }

      // Refresh the visitor list to show updated data
      fetchStats(apiToken, true, currentPage);
    } catch (error) {
      console.error("Error deleting visitors:", error);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <AuthForm
        inputToken={inputToken}
        onInputChange={(e) => setInputToken(e.target.value)}
        onSubmit={handleSubmitToken}
      />
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Portfolio Analytics</h1>

      {loading ? (
        <LoadingSpinner message="Loading dashboard data..." />
      ) : error ? (
        <ErrorDisplay
          error={error}
          inputToken={inputToken}
          onInputChange={(e) => setInputToken(e.target.value)}
          onRetry={() => {
            resetError();
            setApiToken(inputToken);
            fetchStats(inputToken);
          }}
          onCancel={() => {
            setApiToken("");
            resetError();
          }}
        />
      ) : (
        <>
          {/* Stats summary cards */}
          {stats && <StatsCards stats={stats} />}

          {/* Tabs for different chart views */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="pageviews">Page Views</TabsTrigger>
              <TabsTrigger value="visitors">Unique Visitors</TabsTrigger>
              <TabsTrigger value="pages">Popular Pages</TabsTrigger>
              <TabsTrigger value="visitor-list">Visitor List</TabsTrigger>
            </TabsList>

            <TabsContent value="pageviews" className="space-y-4">
              <PageViewsChart data={dailyViewsData} />
            </TabsContent>

            <TabsContent value="visitors" className="space-y-4">
              <VisitorsChart data={uniqueVisitorsData} />
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <PopularPagesChart data={pageViewsData} colors={chartColors} />
            </TabsContent>

            <TabsContent value="visitor-list" className="space-y-4">
              <VisitorListContainer
                visitors={stats?.visitors || []}
                pagination={stats?.pagination}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  // Prevent default behavior, set the date, and ensure we stay on the visitor-list tab
                  setSelectedDate(date);
                  setActiveTab("visitor-list"); // Ensure we stay on the visitor list tab
                }}
                onLoadClick={handleLoadVisitors}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={loadingVisitors}
                onDeleteVisitors={handleDeleteVisitors}
              />
            </TabsContent>
          </Tabs>

          {/* Dashboard action buttons */}
          <DashboardActions
            onLogout={handleLogout}
            onChangeToken={() => setApiToken("")}
            onDeleteData={() =>
              handleDeleteAllData(
                apiToken,
                (emptyStats) => {
                  // Use the empty stats provided by the hook
                  if (stats) {
                    // Create a new stats object with the empty data but preserving visitors array and pagination
                    const updatedStats = {
                      ...emptyStats,
                      visitors: [],
                      pagination: { ...stats.pagination, total: 0 },
                    };
                    // Refetch to update the UI
                    fetchStats(apiToken);
                  }
                },
                (errorMsg) => resetError()
              )
            }
            deleteConfirmation={deleteConfirmation}
            onCancelDelete={() => setDeleteConfirmation(false)}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}
