import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ArrowUp } from 'lucide-react';

const FloatingButtons = () => {
  const { t } = useTranslation();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <a
        href="https://wa.me/919515046565"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50"
        aria-label={t('floating.whatsapp')}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition z-50"
          aria-label={t('floating.scrollTop')}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default FloatingButtons;
