import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string;
  inputToken: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRetry: () => void;
  onCancel: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  inputToken,
  onInputChange,
  onRetry,
  onCancel,
}) => {
  const isSuccess = error.includes("successfully");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {error}
        </div>
        {!isSuccess && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiTokenRetry" className="text-sm font-medium">
                API Token
              </label>
              <input
                id="apiTokenRetry"
                type="password"
                value={inputToken}
                onChange={onInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your API token"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
