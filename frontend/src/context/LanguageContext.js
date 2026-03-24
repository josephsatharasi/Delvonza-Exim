import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'delvonza_lang_v1';

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' }
];

const COUNTRY_TO_LANGUAGE = {
  IN: 'hi',
  AE: 'ar',
  SA: 'ar',
  QA: 'ar',
  FR: 'fr'
};

const getAutoLanguage = () => {
  const locale = navigator.language || 'en';
  const [languagePart, countryPart] = locale.split('-');
  const fromCountry = countryPart ? COUNTRY_TO_LANGUAGE[countryPart.toUpperCase()] : null;
  const supportedCodes = LANGUAGE_OPTIONS.map((item) => item.code);
  if (fromCountry && supportedCodes.includes(fromCountry)) {
    return fromCountry;
  }
  if (supportedCodes.includes(languagePart.toLowerCase())) {
    return languagePart.toLowerCase();
  }
  return 'en';
};

const setGoogleTranslateCookie = (langCode) => {
  const cookieValue = `/en/${langCode}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${cookieValue}; path=/`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host}`;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    const nextLanguage = savedLanguage || getAutoLanguage();
    setLanguage(nextLanguage);
    setGoogleTranslateCookie(nextLanguage);
  }, []);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem(STORAGE_KEY, langCode);
    setGoogleTranslateCookie(langCode);
    window.location.reload();
  };

  const value = useMemo(
    () => ({
      language,
      languages: LANGUAGE_OPTIONS,
      changeLanguage
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
