'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, getLanguageDisplayName, availableLanguages } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'es' | 'ca') => {
    console.log('🔄 LanguageSelector: Changing language to:', lang);
    changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-1 text-sm">
      {availableLanguages.map((lang, index) => (
        <div key={lang} className="flex items-center">
          <button
            onClick={() => handleLanguageChange(lang)}
            className={`px-2 py-1 rounded transition-all duration-200 hover:text-blue-400 ${
              currentLanguage === lang 
                ? 'text-blue-400 font-medium' 
                : 'text-gray-300 hover:text-blue-400'
            }`}
          >
            {getLanguageDisplayName(lang)}
          </button>
          {index < availableLanguages.length - 1 && (
            <span className="text-gray-500 mx-1">|</span>
          )}
        </div>
      ))}
    </div>
  );
}