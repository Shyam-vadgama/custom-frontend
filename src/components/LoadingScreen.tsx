import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
          <span className="text-white font-bold text-2xl">MG</span>
        </div>
        
        {/* App Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Our Voice, Our Rights
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          MGNREGA Data Portal
        </p>
        
        {/* Loading Spinner */}
        <div className="w-12 h-12 loading-spinner mx-auto mb-4"></div>
        
        {/* Loading Text */}
        <p className="text-rural-base text-gray-700 animate-pulse">
          Loading your data...
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
