'use client';

import { useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'ca';
type Translations = Record<string, any>;

const STORAGE_KEY = 'portfolio-language';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/messages/${currentLanguage}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
        console.log('Translations loaded:', currentLanguage, data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English
        try {
          const fallbackResponse = await fetch('/messages/en.json');
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
          console.log('Fallback translations loaded');
        } catch (fallbackError) {
          console.error('Fallback loading failed:', fallbackError);
        }
      }
      setIsLoading(false);
    };

    loadTranslations();
  }, [currentLanguage]);

  // Load language from localStorage after first render
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language;
    if (stored && ['en', 'es', 'ca'].includes(stored)) {
      setCurrentLanguage(stored);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      const detectedLang = ['en', 'es', 'ca'].includes(browserLang) ? browserLang : 'en';
      setCurrentLanguage(detectedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return key; // Return key if translations aren't loaded yet
    }

    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const getLanguageDisplayName = (lang: Language): string => {
    const displayNames = {
      en: 'English',
      es: 'Español', 
      ca: 'Català'
    };
    return displayNames[lang];
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    getLanguageDisplayName,
    availableLanguages: ['en', 'es', 'ca'] as Language[]
  };
}