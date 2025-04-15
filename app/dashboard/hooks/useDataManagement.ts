import { useState, useCallback } from "react";
import { VisitorStats } from "@/app/dashboard/types";

interface UseDataManagementReturn {
  isDeleting: boolean;
  deleteConfirmation: boolean;
  setDeleteConfirmation: (value: boolean) => void;
  handleDeleteAllData: (
    apiToken: string,
    onSuccess: (emptyStats: VisitorStats) => void,
    onError: (message: string) => void
  ) => Promise<void>;
}

export const useDataManagement = (): UseDataManagementReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleDeleteAllData = useCallback(
    async (
      apiToken: string,
      onSuccess: (emptyStats: VisitorStats) => void,
      onError: (message: string) => void
    ) => {
      // If not yet confirmed, show confirmation UI
      if (!deleteConfirmation) {
        setDeleteConfirmation(true);
        return;
      }

      try {
        setIsDeleting(true);

        const response = await fetch("/api/track", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete visitor data");
        }

        const result = await response.json();

        if (result.success) {
          // Reset stats after successful deletion
          const emptyStats: VisitorStats = {
            totalPageviews: 0,
            pageviewsByPage: {},
            pageviewsByDate: {},
            uniqueVisitors: {},
          };

          onSuccess(emptyStats);
          console.log("All visitor data has been deleted successfully");
        } else {
          throw new Error(result.message || "Failed to delete visitor data");
        }
      } catch (err: any) {
        console.error("Error deleting visitor data:", err);
        onError("Failed to delete visitor data. Please try again.");
      } finally {
        setIsDeleting(false);
        setDeleteConfirmation(false);
      }
    },
    [deleteConfirmation]
  );

  return {
    isDeleting,
    deleteConfirmation,
    setDeleteConfirmation,
    handleDeleteAllData,
  };
};
