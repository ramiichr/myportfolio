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
import { DashboardStats } from "./components/DashboardStats";
import { ErrorDisplay } from "./components/ErrorDisplay";
import {
  PageViewsChart,
  VisitorsChart,
  PopularPagesChart,
} from "./components/charts/index";

// Import portfolio management components
import { PortfolioManager } from "./components/PortfolioManager";
import { ProjectManager } from "./components/ProjectManager";
import { SkillManager } from "./components/SkillManager";
import { ExperienceEducationManager } from "./components/ExperienceEducationManager";
import { ProfileManager } from "./components/ProfileManager";

export default function DashboardPage() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("pageviews");
  const [isSeeding, setIsSeeding] = useState(false);

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

  // Portfolio management functions
  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        // Could add a toast notification here
        console.log("Database seeded successfully!");
      } else {
        console.error("Failed to seed database:", data.message);
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleNavigateToSection = (section: string) => {
    setActiveTab(`portfolio-${section}`);
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
    <div className="container mx-auto py-4 px-4 sm:py-6 lg:py-10">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Portfolio Dashboard
        </h1>
      </div>

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
          {/* Dashboard overview stats */}
          <DashboardStats stats={stats} />

          {/* Tabs for different dashboard sections */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            {/* Mobile-first responsive tab layout */}
            <div className="w-full">
              {/* Mobile dropdown for tab selection */}
              <div className="block sm:hidden mb-4">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-background text-foreground"
                >
                  <optgroup label="Analytics">
                    <option value="pageviews">Analytics</option>
                    <option value="visitors">Visitors</option>
                    <option value="visitor-list">Visitor List</option>
                  </optgroup>
                  <optgroup label="Portfolio Management">
                    <option value="portfolio">Portfolio</option>
                    <option value="portfolio-projects">Projects</option>
                    <option value="portfolio-skills">Skills</option>
                    <option value="portfolio-experience">Experience</option>
                    <option value="portfolio-profile">Profile</option>
                  </optgroup>
                </select>
              </div>

              {/* Tablet and desktop tab layout */}
              <div className="hidden sm:block">
                {/* Two-row layout for tablets */}
                <div className="sm:block lg:hidden space-y-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="pageviews"
                      className="text-xs sm:text-sm"
                    >
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger
                      value="visitors"
                      className="text-xs sm:text-sm"
                    >
                      Visitors
                    </TabsTrigger>
                    <TabsTrigger
                      value="visitor-list"
                      className="text-xs sm:text-sm"
                    >
                      Visitor List
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger
                      value="portfolio"
                      className="text-xs sm:text-sm"
                    >
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio-projects"
                      className="text-xs sm:text-sm"
                    >
                      Projects
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio-skills"
                      className="text-xs sm:text-sm"
                    >
                      Skills
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio-experience"
                      className="text-xs sm:text-sm"
                    >
                      Experience
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio-profile"
                      className="text-xs sm:text-sm"
                    >
                      Profile
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Single row layout for large screens */}
                <TabsList className="hidden lg:grid w-full grid-cols-8">
                  {/* Analytics Tabs */}
                  <TabsTrigger value="pageviews">Analytics</TabsTrigger>
                  <TabsTrigger value="visitors">Visitors</TabsTrigger>
                  <TabsTrigger value="visitor-list">Visitor List</TabsTrigger>

                  {/* Portfolio Management Tabs */}
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="portfolio-projects">Projects</TabsTrigger>
                  <TabsTrigger value="portfolio-skills">Skills</TabsTrigger>
                  <TabsTrigger value="portfolio-experience">
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="portfolio-profile">Profile</TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Analytics Tabs Content */}
            <TabsContent value="pageviews" className="space-y-4">
              <PageViewsChart data={dailyViewsData} />
            </TabsContent>

            <TabsContent value="visitors" className="space-y-4">
              <VisitorsChart data={uniqueVisitorsData} />
              <PopularPagesChart data={pageViewsData} colors={chartColors} />
            </TabsContent>

            <TabsContent value="visitor-list" className="space-y-4">
              <VisitorListContainer
                visitors={stats?.visitors || []}
                pagination={stats?.pagination}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  setActiveTab("visitor-list");
                }}
                onLoadClick={handleLoadVisitors}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={loadingVisitors}
                onDeleteVisitors={handleDeleteVisitors}
              />
            </TabsContent>

            {/* Portfolio Management Tabs Content */}
            <TabsContent value="portfolio" className="space-y-4">
              <PortfolioManager
                onSeedDatabase={seedDatabase}
                onNavigateToSection={handleNavigateToSection}
                isSeeding={isSeeding}
              />
            </TabsContent>

            <TabsContent value="portfolio-projects" className="space-y-4">
              <ProjectManager />
            </TabsContent>

            <TabsContent value="portfolio-skills" className="space-y-4">
              <SkillManager />
            </TabsContent>

            <TabsContent value="portfolio-experience" className="space-y-4">
              <ExperienceEducationManager />
            </TabsContent>

            <TabsContent value="portfolio-profile" className="space-y-4">
              <ProfileManager />
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
                  if (stats) {
                    const updatedStats = {
                      ...emptyStats,
                      visitors: [],
                      pagination: { ...stats.pagination, total: 0 },
                    };
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
