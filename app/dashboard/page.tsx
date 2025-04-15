"use client";

import React, { useEffect } from "react";
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
  const handleLoadVisitors = () => {
    setCurrentPage(1); // Reset to page 1 when loading new data
    fetchStats(apiToken, true, 1);
  };

  // Handle page change in visitor list
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchStats(apiToken, true, page);
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
          <Tabs defaultValue="pageviews" className="space-y-4">
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
                onDateChange={setSelectedDate}
                onLoadClick={handleLoadVisitors}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={loadingVisitors}
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
