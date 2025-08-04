import React from "react";
import Link from "next/link";

interface DashboardActionsProps {
  onLogout: () => void;
  onChangeToken: () => void;
  onDeleteData: () => void;
  deleteConfirmation: boolean;
  onCancelDelete: () => void;
  isDeleting: boolean;
}

export const DashboardActions: React.FC<DashboardActionsProps> = ({
  onLogout,
  onChangeToken,
  onDeleteData,
  deleteConfirmation,
  onCancelDelete,
  isDeleting,
}) => {
  return (
    <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-2 order-2 lg:order-1">
        <Link
          href="/"
          className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          Go to Portfolio
        </Link>
        <button
          onClick={onLogout}
          className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
        >
          Logout
        </button>
        <button
          onClick={onChangeToken}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Change API Token
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 order-1 lg:order-2">
        {deleteConfirmation ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs sm:text-sm text-red-600 font-medium text-center sm:text-left">
              Are you sure? This action cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={onCancelDelete}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={onDeleteData}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onDeleteData}
            className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete All Data"}
          </button>
        )}
      </div>
    </div>
  );
};
