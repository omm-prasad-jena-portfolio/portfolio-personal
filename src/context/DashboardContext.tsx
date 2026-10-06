import React, { createContext, useContext, useEffect, useState } from 'react';
import { DashboardData, mockDashboardData } from '../data/mockDashboardData';
import { fetchDashboardData } from '../services/dashboardApi';

interface DashboardContextType {
  data: DashboardData;
  isLoading: boolean;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  data: mockDashboardData,
  isLoading: false,
  refreshDashboard: async () => {},
});

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(mockDashboardData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshDashboard = async () => {
    setIsLoading(true);
    const apiData = await fetchDashboardData();
    setData(apiData);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, isLoading, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardData = () => useContext(DashboardContext);
