import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  inputToken: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  inputToken,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="container mx-auto py-4 px-4 sm:py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Please enter your API token to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apiToken" className="text-sm font-medium block">
                  API Token
                </label>
                <input
                  id="apiToken"
                  type="password"
                  value={inputToken}
                  onChange={onInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your API token"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
