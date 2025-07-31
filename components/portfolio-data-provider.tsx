"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PortfolioDataContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const PortfolioDataContext = createContext<
  PortfolioDataContextType | undefined
>(undefined);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <PortfolioDataContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (context === undefined) {
    throw new Error(
      "usePortfolioData must be used within a PortfolioDataProvider"
    );
  }
  return context;
}
