import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const FAQ_IDS = [0, 1, 2, 3, 4, 5];

const FaqSection = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 md:py-20 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2
          id="faq-heading"
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3"
        >
          {t('faq.title')}
        </h2>
        <p className="text-center text-gray-600 mb-10">{t('faq.subtitle')}</p>

        <div className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden divide-y divide-gray-200">
          {FAQ_IDS.map((id) => {
            const isOpen = openId === id;
            return (
              <div key={id} className="bg-white">
                <button
                  type="button"
                  id={`faq-trigger-${id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${id}`}
                  onClick={() => toggle(id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-800 hover:bg-primary-50/60 transition-colors"
                >
                  <span>{t(`faq.items.${id}.q`)}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-primary-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div
                    id={`faq-panel-${id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${id}`}
                    className="px-5 pb-4 pt-0 text-gray-600 leading-relaxed text-sm md:text-base"
                  >
                    {t(`faq.items.${id}.a`)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
