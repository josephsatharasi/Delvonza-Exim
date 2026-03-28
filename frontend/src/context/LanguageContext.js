import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGlobalLanguages } from '../utils/globalLocales';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'delvonza_lang_v1';

const getAutoLanguage = () => {
  const locale = navigator.language || 'en';
  const [languagePart, countryPart] = locale.split('-');
  // Prefer the browser's language code (Google Translate accepts ISO-639-1 codes).
  return (languagePart || 'en').toLowerCase();
};

const setGoogleTranslateCookie = (langCode) => {
  const cookieValue = `/en/${langCode}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${cookieValue}; path=/`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host}`;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [languages, setLanguages] = useState([{ code: 'en', label: 'English' }]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    const nextLanguage = savedLanguage || getAutoLanguage();
    setLanguage(nextLanguage);
    setGoogleTranslateCookie(nextLanguage);
  }, []);

  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await fetchGlobalLanguages();
        if (!cancelled && Array.isArray(list) && list.length) {
          setLanguages(list);
        }
      } catch {
        // Keep fallback language list if API is unavailable.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
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
      languages,
      changeLanguage
    }),
    [language, languages]
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
