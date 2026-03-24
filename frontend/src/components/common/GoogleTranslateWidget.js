import { useEffect } from 'react';
import { LANGUAGE_OPTIONS } from '../../context/LanguageContext';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    // In React StrictMode (development), effects mount/unmount twice.
    // Guard against duplicate script/callback registration.
    if (window.__delvonzaTranslateInitialized) {
      return;
    }
    window.__delvonzaTranslateInitialized = true;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) {
        return;
      }
      if (window.__delvonzaTranslateWidgetMounted) {
        return;
      }
      window.__delvonzaTranslateWidgetMounted = true;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGE_OPTIONS.map((item) => item.code).join(','),
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        // Reset initialization flag if network or script loading fails.
        window.__delvonzaTranslateInitialized = false;
      };
      document.body.appendChild(script);
    } else if (window.google?.translate && window.googleTranslateElementInit) {
      window.googleTranslateElementInit();
    }

    return () => {
      // Keep callback available; removing it can cause cross-origin script
      // callback failures in dev hot reload / StrictMode.
    };
  }, []);

  return <div id="google_translate_element" className="hidden" />;
};

export default GoogleTranslateWidget;
