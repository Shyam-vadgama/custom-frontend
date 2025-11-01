import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">MG</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t('app.title')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-rural-base font-medium transition-colors duration-200 ${
                isActivePage('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/compare"
              className={`text-rural-base font-medium transition-colors duration-200 ${
                isActivePage('/compare') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.compare')}
            </Link>
            <Link
              to="/about"
              className={`text-rural-base font-medium transition-colors duration-200 ${
                isActivePage('/about') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.about')}
            </Link>
          </nav>

          {/* Language Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="btn-icon-large bg-gray-100 hover:bg-gray-200 text-gray-700"
              aria-label="Toggle Language"
            >
              <Globe className="w-6 h-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden btn-icon-large bg-gray-100 hover:bg-gray-200 text-gray-700"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4 animate-slide-up">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 text-rural-base font-medium rounded-lg transition-colors duration-200 ${
                isActivePage('/') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 text-rural-base font-medium rounded-lg transition-colors duration-200 ${
                isActivePage('/compare') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.compare')}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 text-rural-base font-medium rounded-lg transition-colors duration-200 ${
                isActivePage('/about') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.about')}
            </Link>
            
            {/* Language Toggle in Mobile Menu */}
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="w-full btn-rural-secondary flex items-center justify-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>{t('language.toggle')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
