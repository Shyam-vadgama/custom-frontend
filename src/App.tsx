import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DistrictPage from './pages/DistrictPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <LocationProvider>
          <DataProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="pb-20">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/district/:districtCode" element={<DistrictPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </DataProvider>
        </LocationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
