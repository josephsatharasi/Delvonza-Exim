import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGlobalLanguages } from '../utils/globalLocales';
import i18n, { SUPPORTED_LOCALES, LOCALE_NATIVE_LABELS } from '../i18n/config';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'delvonza_lang_v1';

const supportedSet = new Set(SUPPORTED_LOCALES);

const getAutoLanguage = () => {
  const locale = navigator.language || 'en';
  const [languagePart] = locale.split('-');
  const code = (languagePart || 'en').toLowerCase();
  return supportedSet.has(code) ? code : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => i18n.language || 'en');
  const [languages, setLanguages] = useState(() =>
    SUPPORTED_LOCALES.map((code) => ({
      code,
      label: LOCALE_NATIVE_LABELS[code] || code
    }))
  );

  useEffect(() => {
    const onLang = (lng) => {
      setLanguage(lng);
      document.documentElement.lang = lng;
    };
    i18n.on('languageChanged', onLang);
    onLang(i18n.language);
    return () => {
      i18n.off('languageChanged', onLang);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || !supportedSet.has(saved)) {
      const next = getAutoLanguage();
      if (next !== i18n.language) {
        i18n.changeLanguage(next);
      }
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const fallback = SUPPORTED_LOCALES.map((code) => ({
        code,
        label: LOCALE_NATIVE_LABELS[code] || code
      }));
      try {
        const list = await fetchGlobalLanguages();
        if (!cancelled && Array.isArray(list) && list.length) {
          const apiMap = new Map(list.map((l) => [l.code, l.label]));
          const merged = SUPPORTED_LOCALES.map((code) => ({
            code,
            label: apiMap.get(code) || LOCALE_NATIVE_LABELS[code] || code
          }));
          setLanguages(merged);
          return;
        }
      } catch {
        // ignore
      }
      if (!cancelled) setLanguages(fallback);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const changeLanguage = (langCode) => {
    const code = String(langCode || '').toLowerCase();
    if (!supportedSet.has(code)) return;
    localStorage.setItem(STORAGE_KEY, code);
    i18n.changeLanguage(code);
  };

  const value = useMemo(
    () => ({
      language,
      languages,
      changeLanguage,
      supportedLocales: SUPPORTED_LOCALES
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
