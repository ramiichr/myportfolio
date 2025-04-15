import { useState, useEffect } from "react";

interface UseAuthReturn {
  apiToken: string;
  inputToken: string;
  setInputToken: (token: string) => void;
  setApiToken: (token: string) => void;
  handleLogout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [apiToken, setApiToken] = useState("");
  const [inputToken, setInputToken] = useState("");

  useEffect(() => {
    // Get the API token from localStorage if available
    const storedToken = localStorage.getItem("visitorApiToken");
    if (storedToken) {
      setApiToken(storedToken);
      setInputToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    // Clear the API token from localStorage
    localStorage.removeItem("visitorApiToken");
    // Reset the state
    setApiToken("");
    setInputToken("");
  };

  return {
    apiToken,
    inputToken,
    setInputToken,
    setApiToken,
    handleLogout,
    isAuthenticated: !!apiToken,
  };
};
