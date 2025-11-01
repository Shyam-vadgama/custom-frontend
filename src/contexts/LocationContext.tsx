import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface DistrictInfo {
  district: string;
  state: string;
  district_code?: string;
  coordinates?: Coordinates;
}

interface LocationContextType {
  currentLocation: Coordinates | null;
  detectedDistrict: DistrictInfo | null;
  isDetecting: boolean;
  error: string | null;
  detectLocation: () => Promise<void>;
  clearLocation: () => void;
  setManualDistrict: (district: DistrictInfo) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [detectedDistrict, setDetectedDistrict] = useState<DistrictInfo | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('mgnrega-location');
    const savedDistrict = localStorage.getItem('mgnrega-district');
    
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
    
    if (savedDistrict) {
      try {
        setDetectedDistrict(JSON.parse(savedDistrict));
      } catch (e) {
        console.error('Error parsing saved district:', e);
      }
    }
  }, []);

  const detectLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setCurrentLocation(coords);
      localStorage.setItem('mgnrega-location', JSON.stringify(coords));

      // Call backend API to detect district
      const district = await detectDistrictFromCoordinates(coords);
      if (district) {
        setDetectedDistrict(district);
        localStorage.setItem('mgnrega-district', JSON.stringify(district));
      }
    } catch (err) {
      console.error('Location detection error:', err);
      setError(getLocationErrorMessage(err as GeolocationPositionError));
    } finally {
      setIsDetecting(false);
    }
  };

  const clearLocation = (): void => {
    setCurrentLocation(null);
    setDetectedDistrict(null);
    setError(null);
    localStorage.removeItem('mgnrega-location');
    localStorage.removeItem('mgnrega-district');
  };

  const setManualDistrict = (district: DistrictInfo): void => {
    setDetectedDistrict(district);
    localStorage.setItem('mgnrega-district', JSON.stringify(district));
  };

  const value: LocationContextType = {
    currentLocation,
    detectedDistrict,
    isDetecting,
    error,
    detectLocation,
    clearLocation,
    setManualDistrict,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// Helper functions

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

const detectDistrictFromCoordinates = async (coords: Coordinates): Promise<DistrictInfo | null> => {
  try {
    const response = await fetch('/detect-district', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to detect district');
    }

    const data = await response.json();
    return {
      district: data.district,
      state: data.state,
      district_code: data.district_code,
      coordinates: coords,
    };
  } catch (error) {
    console.error('Error detecting district:', error);
    return null;
  }
};

const getLocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access denied. Please allow location access and try again.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Please check your GPS settings.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while detecting location.';
  }
};
