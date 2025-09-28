'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es' | 'ca';
type Translations = Record<string, any>;

interface LanguageContextType {
  currentLanguage: Language;
  translations: Translations;
  isLoading: boolean;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => any;
  getLanguageDisplayName: (lang: Language) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [allTranslations, setAllTranslations] = useState<Record<Language, Translations>>({} as Record<Language, Translations>);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load translations for a specific language
  const loadTranslation = async (lang: Language): Promise<Translations> => {
    try {
      const response = await fetch(`/messages/${lang}.json`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded ${lang} translations`);
        return data;
      } else {
        console.error(`❌ Failed to load ${lang} translations`);
        return {};
      }
    } catch (error) {
      console.error(`❌ Error loading ${lang}:`, error);
      return {};
    }
  };

  // Initialize translations and language
  useEffect(() => {
    if (!isClient) return;

    const initTranslations = async () => {
      setIsLoading(true);

      // Load initial language
      let initialLang: Language = 'en';
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Language;
        if (stored && ['en', 'es', 'ca'].includes(stored)) {
          initialLang = stored;
          console.log('🌐 Using stored language:', stored);
        } else {
          const browserLang = navigator.language.split('-')[0] as Language;
          initialLang = ['en', 'es', 'ca'].includes(browserLang) ? browserLang : 'en';
          console.log('🌐 Using detected language:', initialLang);
        }
      } catch (error) {
        console.log('🌐 Using default language: en');
      }

      // Load translation for initial language
      const initialTranslation = await loadTranslation(initialLang);
      
      setCurrentLanguage(initialLang);
      setAllTranslations({ [initialLang]: initialTranslation } as Record<Language, Translations>);
      setIsLoading(false);
    };

    initTranslations();
  }, [isClient]);

  const changeLanguage = async (lang: Language) => {
    console.log('🔄 Changing language from', currentLanguage, 'to', lang);
    
    // If translation not loaded yet, load it
    if (!allTranslations[lang]) {
      console.log(`📥 Loading ${lang} translations...`);
      const translation = await loadTranslation(lang);
      setAllTranslations(prev => ({ ...prev, [lang]: translation }));
    }
    
    setCurrentLanguage(lang);
    
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        console.warn('Could not save language preference');
      }
    }
    
    console.log('✅ Language changed to:', lang);
  };

  const t = (key: string): any => {
    const translations = allTranslations[currentLanguage];
    
    if (!translations) {
      console.warn(`⚠️ No translations for language: ${currentLanguage}`);
      return key;
    }

    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`⚠️ Translation missing for key: ${key} in ${currentLanguage}`);
        return key;
      }
    }
    
    return value !== undefined ? value : key;
  };

  const getLanguageDisplayName = (lang: Language): string => {
    const displayNames = {
      en: 'English',
      es: 'Español', 
      ca: 'Català'
    };
    return displayNames[lang];
  };

  const value: LanguageContextType = {
    currentLanguage,
    translations: allTranslations[currentLanguage] || {},
    isLoading,
    changeLanguage,
    t,
    getLanguageDisplayName,
    availableLanguages: ['en', 'es', 'ca']
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}