import React from "react";

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
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
        <button
          onClick={onChangeToken}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Change API Token
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        {deleteConfirmation ? (
          <>
            <span className="text-sm text-red-600 font-medium">
              Are you sure?
            </span>
            <button
              onClick={onCancelDelete}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
          </>
        ) : null}
        <button
          onClick={onDeleteData}
          className={`px-4 py-2 ${
            deleteConfirmation
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"
          } text-white rounded-md transition-colors flex items-center gap-2`}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
          ) : null}
          {deleteConfirmation ? "Confirm Delete" : "Delete All Data"}
        </button>
      </div>
    </div>
  );
};
