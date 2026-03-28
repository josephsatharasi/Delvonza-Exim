import { useEffect } from 'react';

const stripGoogleTranslateChrome = () => {
  document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame, .goog-te-balloon-frame').forEach((el) => {
    try {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('height', '0', 'important');
      el.remove();
    } catch {
      // Ignore if element is detached or cross-origin.
    }
  });
  document.body.style.setProperty('margin-top', '0', 'important');
  document.body.style.setProperty('top', '0', 'important');
  document.documentElement.style.setProperty('margin-top', '0', 'important');
  document.documentElement.style.setProperty('top', '0', 'important');
  document.body.classList.remove('goog-te-mt', 'ft');
};

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

  useEffect(() => {
    stripGoogleTranslateChrome();
    const observer = new MutationObserver(stripGoogleTranslateChrome);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const timer = window.setInterval(stripGoogleTranslateChrome, 250);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return <div id="google_translate_element" className="hidden" />;
};

export default GoogleTranslateWidget;
