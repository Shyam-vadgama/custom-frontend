import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DistrictData {
  district_code: string;
  district_name: string;
  state_name: string;
  year: number;
  total_job_cards: number;
  active_job_cards: number;
  total_workers: number;
  active_workers: number;
  total_person_days: number;
  average_days_per_household: number;
  households_completed_100_days: number;
  total_expenditure: number;
  wage_expenditure: number;
  material_expenditure: number;
  average_wage_rate: number;
  total_works: number;
  completed_works: number;
  ongoing_works: number;
  employment_provided_percentage: number;
  timely_payment_percentage: number;
  last_updated: string;
  is_cached: boolean;
  data_source: string;
}

interface DataContextType {
  districtData: { [key: string]: DistrictData };
  isLoading: boolean;
  error: string | null;
  fetchDistrictData: (districtCode: string, year?: number) => Promise<DistrictData | null>;
  refreshData: (districtCode: string) => Promise<void>;
  clearCache: () => void;
  isOffline: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [districtData, setDistrictData] = useState<{ [key: string]: DistrictData }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Load cached data from localStorage
    const cachedData = localStorage.getItem('mgnrega-cached-data');
    if (cachedData) {
      try {
        setDistrictData(JSON.parse(cachedData));
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mock data generator for development
  const generateMockData = (districtCode: string, year: number): DistrictData => {
    const districts = {
      'AP001': { name: 'Anantapur', state: 'Andhra Pradesh' },
      'AP002': { name: 'Chittoor', state: 'Andhra Pradesh' },
      'BR001': { name: 'Patna', state: 'Bihar' },
      'BR002': { name: 'Gaya', state: 'Bihar' },
      'MH001': { name: 'Mumbai', state: 'Maharashtra' },
      'MH002': { name: 'Pune', state: 'Maharashtra' },
      'UP001': { name: 'Lucknow', state: 'Uttar Pradesh' },
      'UP002': { name: 'Kanpur Nagar', state: 'Uttar Pradesh' },
      'WB001': { name: 'Kolkata', state: 'West Bengal' },
      'RJ001': { name: 'Jaipur', state: 'Rajasthan' },
    };

    const district = districts[districtCode as keyof typeof districts] || { name: 'Unknown', state: 'Unknown' };
    const baseMultiplier = districtCode.charCodeAt(2) / 10;
    
    return {
      district_code: districtCode,
      district_name: district.name,
      state_name: district.state,
      year: year,
      total_job_cards: Math.floor((50000 + baseMultiplier * 10000) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      active_job_cards: Math.floor((35000 + baseMultiplier * 7000) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      total_workers: Math.floor((75000 + baseMultiplier * 15000) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      active_workers: Math.floor((45000 + baseMultiplier * 9000) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      total_person_days: Math.floor((2500000 + baseMultiplier * 500000) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      average_days_per_household: 45 + baseMultiplier * 5,
      households_completed_100_days: Math.floor((8000 + baseMultiplier * 1500) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      total_expenditure: (850 + baseMultiplier * 150) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1),
      wage_expenditure: (600 + baseMultiplier * 100) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1),
      material_expenditure: (250 + baseMultiplier * 50) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1),
      average_wage_rate: 220 + baseMultiplier * 30,
      total_works: Math.floor((1200 + baseMultiplier * 200) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      completed_works: Math.floor((800 + baseMultiplier * 150) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      ongoing_works: Math.floor((300 + baseMultiplier * 50) * (year === 2024 ? 1.1 : year === 2023 ? 1.05 : 1)),
      employment_provided_percentage: 75 + baseMultiplier * 10,
      timely_payment_percentage: 85 + baseMultiplier * 8,
      last_updated: new Date().toISOString(),
      is_cached: true,
      data_source: 'mock'
    };
  };

  const fetchDistrictData = async (districtCode: string, year?: number): Promise<DistrictData | null> => {
    const cacheKey = `${districtCode}-${year || new Date().getFullYear()}`;
    
    // Return cached data if available and not stale
    if (districtData[cacheKey] && !isDataStale(districtData[cacheKey])) {
      return districtData[cacheKey];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from API first
      const yearParam = year ? `?year=${year}` : '';
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/data/${districtCode}${yearParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DistrictData = await response.json();
      
      // Update state and cache
      const newDistrictData = { ...districtData, [cacheKey]: data };
      setDistrictData(newDistrictData);
      localStorage.setItem('mgnrega-cached-data', JSON.stringify(newDistrictData));
      
      return data;
    } catch (err) {
      console.warn('API failed, using mock data:', err);
      
      // Generate mock data as fallback
      const mockData = generateMockData(districtCode, year || new Date().getFullYear());
      
      // Update state and cache with mock data
      const newDistrictData = { ...districtData, [cacheKey]: mockData };
      setDistrictData(newDistrictData);
      localStorage.setItem('mgnrega-cached-data', JSON.stringify(newDistrictData));
      
      return mockData;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async (districtCode: string): Promise<void> => {
    const currentYear = new Date().getFullYear();
    const cacheKey = `${districtCode}-${currentYear}`;
    
    // Remove from cache to force fresh fetch
    const newDistrictData = { ...districtData };
    delete newDistrictData[cacheKey];
    setDistrictData(newDistrictData);
    
    // Fetch fresh data
    await fetchDistrictData(districtCode, currentYear);
  };

  const clearCache = (): void => {
    setDistrictData({});
    localStorage.removeItem('mgnrega-cached-data');
  };

  const value: DataContextType = {
    districtData,
    isLoading,
    error,
    fetchDistrictData,
    refreshData,
    clearCache,
    isOffline,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Helper function to check if data is stale (older than 1 hour)
const isDataStale = (data: DistrictData): boolean => {
  const lastUpdated = new Date(data.last_updated);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursDiff > 1;
};
