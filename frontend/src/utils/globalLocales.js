const COUNTRY_CACHE_KEY = 'delvonza_countries_v1';
const LANG_CACHE_KEY = 'delvonza_languages_v1';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readCache = (key, maxAgeMs) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed = safeJsonParse(raw);
  if (!parsed || !parsed.data || !parsed.ts) return null;
  if (Date.now() - parsed.ts > maxAgeMs) return null;
  return parsed.data;
};

const writeCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
};

const normalizeDialCodes = (idd) => {
  const root = idd?.root || '';
  const suffixes = Array.isArray(idd?.suffixes) ? idd.suffixes : [];
  if (!root) return [];
  if (!suffixes.length) return [root];
  return suffixes.map((s) => `${root}${s}`);
};

export async function fetchCountriesWithDialAndLanguages() {
  const cached = readCache(COUNTRY_CACHE_KEY, ONE_WEEK_MS);
  if (cached) return cached;

  const res = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,cca2,idd,languages'
  );
  if (!res.ok) {
    throw new Error('Failed to load country list.');
  }
  const raw = await res.json();

  const countries = (raw || [])
    .map((c) => {
      const dialCodes = normalizeDialCodes(c.idd);
      const languages = c.languages ? Object.values(c.languages) : [];
      return {
        cca2: c.cca2,
        name: c.name?.common || '',
        dialCodes,
        languages
      };
    })
    .filter((c) => c.name && c.dialCodes.length)
    .sort((a, b) => a.name.localeCompare(b.name));

  writeCache(COUNTRY_CACHE_KEY, countries);
  return countries;
}

export async function fetchGlobalLanguages() {
  const cached = readCache(LANG_CACHE_KEY, ONE_WEEK_MS);
  if (cached) return cached;

  // External API returning ISO language codes + names.
  // Use multiple endpoints because public instances can rate-limit or go down.
  const endpoints = [
    'https://libretranslate.de/languages',
    'https://translate.argosopentech.com/languages',
    'https://libretranslate.com/languages'
  ];

  let raw = null;
  let lastErr = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      raw = await res.json();
      if (Array.isArray(raw) && raw.length) break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!raw) {
    throw new Error(lastErr?.message || 'Failed to load languages.');
  }

  const languages = (raw || [])
    .map((l) => ({
      code: String(l.code || '').toLowerCase(),
      label: String(l.name || '').trim()
    }))
    // Keep ISO-639-1 style codes for i18n / locale matching.
    .filter((l) => l.code && l.label && l.code.length <= 3)
    .sort((a, b) => a.label.localeCompare(b.label));

  writeCache(LANG_CACHE_KEY, languages);
  return languages;
}

