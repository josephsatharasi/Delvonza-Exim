import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import pt from '../locales/pt.json';
import nl from '../locales/nl.json';
import pl from '../locales/pl.json';
import ru from '../locales/ru.json';
import tr from '../locales/tr.json';
import ar from '../locales/ar.json';
import hi from '../locales/hi.json';
import ur from '../locales/ur.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';
import bn from '../locales/bn.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import ko from '../locales/ko.json';

const STORAGE_KEY = 'delvonza_lang_v1';

/** Locales we ship. Each code must have an entry in BUNDLED_TRANSLATIONS (otherwise strings fall back to English). */
export const SUPPORTED_LOCALES = [
  'en',
  'ar',
  'hi',
  'es',
  'fr',
  'de',
  'pt',
  'ru',
  'ur',
  'ta',
  'te',
  'bn',
  'ja',
  'zh',
  'ko',
  'tr',
  'it',
  'nl',
  'pl'
];

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const BUNDLED_TRANSLATIONS = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  nl,
  pl,
  ru,
  tr,
  ar,
  hi,
  ur,
  ta,
  te,
  bn,
  ja,
  zh,
  ko
};

const resources = {};
SUPPORTED_LOCALES.forEach((lng) => {
  const bundle = BUNDLED_TRANSLATIONS[lng];
  resources[lng] = { translation: bundle || clone(en) };
});

const readStoredLng = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && SUPPORTED_LOCALES.includes(v)) return v;
  } catch {
    // ignore
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLng(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LOCALES,
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
});

export default i18n;
