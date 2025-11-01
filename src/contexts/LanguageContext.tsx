import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Header
    'app.title': 'Our Voice, Our Rights',
    'app.subtitle': 'MGNREGA Data Portal',
    'nav.home': 'Home',
    'nav.compare': 'Compare',
    'nav.about': 'About',
    'language.toggle': 'हिंदी',
    
    // Home page
    'home.welcome': 'Welcome to MGNREGA Data Portal',
    'home.description': 'Access real-time employment data for your district',
    'home.detect.location': 'Detect My Location',
    'home.search.district': 'Search District',
    'home.recent.data': 'Recent Data',
    
    // Location
    'location.detecting': 'Detecting your location...',
    'location.detected': 'Location detected',
    'location.failed': 'Could not detect location',
    'location.permission': 'Please allow location access',
    
    // District data
    'district.data': 'District Data',
    'district.employment': 'Employment',
    'district.expenditure': 'Expenditure',
    'district.works': 'Works',
    'district.performance': 'Performance',
    
    // Metrics
    'metrics.job.cards': 'Job Cards',
    'metrics.active.workers': 'Active Workers',
    'metrics.person.days': 'Person Days',
    'metrics.expenditure': 'Total Expenditure',
    'metrics.wage.rate': 'Average Wage Rate',
    'metrics.completed.works': 'Completed Works',
    'metrics.employment.percentage': 'Employment Provided',
    'metrics.payment.percentage': 'Timely Payments',
    
    // Actions
    'action.view.details': 'View Details',
    'action.compare': 'Compare Districts',
    'action.listen': 'Listen to Summary',
    'action.refresh': 'Refresh Data',
    'action.share': 'Share',
    
    // Status
    'status.loading': 'Loading...',
    'status.error': 'Error loading data',
    'status.no.data': 'No data available',
    'status.offline': 'Offline - Using cached data',
    
    // Units
    'unit.rupees': '₹',
    'unit.lakhs': 'Lakhs',
    'unit.crores': 'Crores',
    'unit.days': 'Days',
    'unit.percentage': '%',
    
    // Voice
    'voice.play': 'Play Audio Summary',
    'voice.pause': 'Pause Audio',
    'voice.stop': 'Stop Audio',
    
    // Comparison
    'compare.title': 'Compare Districts',
    'compare.select': 'Select districts to compare',
    'compare.add.district': 'Add District',
    'compare.remove': 'Remove',
    'compare.summary': 'Comparison Summary',
    
    // About
    'about.title': 'About MGNREGA',
    'about.description': 'The Mahatma Gandhi National Rural Employment Guarantee Act provides employment opportunities in rural areas.',
    'about.features': 'Features',
    'about.contact': 'Contact Us',
  },
  hi: {
    // Header
    'app.title': 'हमारी आवाज़, हमारे अधिकार',
    'app.subtitle': 'मनरेगा डेटा पोर्टल',
    'nav.home': 'होम',
    'nav.compare': 'तुलना',
    'nav.about': 'के बारे में',
    'language.toggle': 'English',
    
    // Home page
    'home.welcome': 'मनरेगा डेटा पोर्टल में आपका स्वागत है',
    'home.description': 'अपने जिले के लिए रियल-टाइम रोजगार डेटा प्राप्त करें',
    'home.detect.location': 'मेरा स्थान खोजें',
    'home.search.district': 'जिला खोजें',
    'home.recent.data': 'हाल का डेटा',
    
    // Location
    'location.detecting': 'आपका स्थान खोजा जा रहा है...',
    'location.detected': 'स्थान मिल गया',
    'location.failed': 'स्थान नहीं मिल सका',
    'location.permission': 'कृपया स्थान की अनुमति दें',
    
    // District data
    'district.data': 'जिला डेटा',
    'district.employment': 'रोजगार',
    'district.expenditure': 'व्यय',
    'district.works': 'कार्य',
    'district.performance': 'प्रदर्शन',
    
    // Metrics
    'metrics.job.cards': 'जॉब कार्ड',
    'metrics.active.workers': 'सक्रिय श्रमिक',
    'metrics.person.days': 'व्यक्ति दिवस',
    'metrics.expenditure': 'कुल व्यय',
    'metrics.wage.rate': 'औसत मजदूरी दर',
    'metrics.completed.works': 'पूर्ण कार्य',
    'metrics.employment.percentage': 'रोजगार प्रदान',
    'metrics.payment.percentage': 'समय पर भुगतान',
    
    // Actions
    'action.view.details': 'विवरण देखें',
    'action.compare': 'जिलों की तुलना करें',
    'action.listen': 'सारांश सुनें',
    'action.refresh': 'डेटा रीफ्रेश करें',
    'action.share': 'साझा करें',
    
    // Status
    'status.loading': 'लोड हो रहा है...',
    'status.error': 'डेटा लोड करने में त्रुटि',
    'status.no.data': 'कोई डेटा उपलब्ध नहीं',
    'status.offline': 'ऑफलाइन - कैश्ड डेटा का उपयोग',
    
    // Units
    'unit.rupees': '₹',
    'unit.lakhs': 'लाख',
    'unit.crores': 'करोड़',
    'unit.days': 'दिन',
    'unit.percentage': '%',
    
    // Voice
    'voice.play': 'ऑडियो सारांश चलाएं',
    'voice.pause': 'ऑडियो रोकें',
    'voice.stop': 'ऑडियो बंद करें',
    
    // Comparison
    'compare.title': 'जिलों की तुलना',
    'compare.select': 'तुलना के लिए जिले चुनें',
    'compare.add.district': 'जिला जोड़ें',
    'compare.remove': 'हटाएं',
    'compare.summary': 'तुलना सारांश',
    
    // About
    'about.title': 'मनरेगा के बारे में',
    'about.description': 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम ग्रामीण क्षेत्रों में रोजगार के अवसर प्रदान करता है।',
    'about.features': 'विशेषताएं',
    'about.contact': 'संपर्क करें',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('mgnrega-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('hi')) {
        setLanguage('hi');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('mgnrega-language', lang);
    
    // Update document language and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'hi' ? 'ltr' : 'ltr'; // Both languages are LTR
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isRTL: false, // Both English and Hindi are LTR
  };

  return (
    <LanguageContext.Provider value={value}>
      <div className={language === 'hi' ? 'font-hindi' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
