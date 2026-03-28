import { useCallback, useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

const AUTO_MS = 5500;

const SLIDES = [
  {
    quote:
      'The soul of Indian cooking travels in the spice—authentic, bold, and honest. We export that legacy with the care it deserves.',
    attribution: 'Our promise to global partners',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80'
  },
  {
    quote:
      'Excellence is a habit forged in every harvest, every roast, every seal. Your reputation lands in the same box as ours.',
    attribution: 'Quality without compromise',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80'
  },
  {
    quote:
      'From Telangana’s networks to your port—clear communication, steady logistics, and spices that match the sample every time.',
    attribution: 'Export you can plan around',
    image:
      'https://images.unsplash.com/photo-1517686469429-8b88fef79ca9?auto=format&fit=crop&w=1600&q=80'
  },
  {
    quote:
      'Trade grows where trust is cultivated. We don’t just ship commodities—we build seasons of repeat orders and friendship.',
    attribution: 'Long-term relationships',
    image:
      'https://images.unsplash.com/photo-1466637574441-449b1a07fd7d?auto=format&fit=crop&w=1600&q=80'
  }
];

const QuoteBannerCarousel = () => {
  const [active, setActive] = useState(0);
  const n = SLIDES.length;
  const pct = 100 / n;

  const go = useCallback(
    (index) => {
      setActive(((index % n) + n) % n);
    },
    [n]
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      go(active + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [active, go]);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-6 text-gray-700">
          <Quote className="w-8 h-8 opacity-80" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Words we live by</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200/80">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{
              width: `${n * 100}%`,
              transform: `translateX(-${active * pct}%)`
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex-shrink-0 overflow-hidden md:items-stretch"
                style={{ width: `${pct}%` }}
              >
                <div className="relative h-48 sm:h-52 md:h-auto md:w-[52%] md:min-h-[320px] shrink-0">
                  <img
                    src={slide.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center border-t border-gray-100 bg-white px-8 py-8 sm:px-10 md:w-[48%] md:border-l md:border-t-0">
                  <blockquote className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-gray-800">
                    &ldquo;{slide.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-5 text-sm font-medium text-gray-500">
                    {slide.attribution}
                  </footer>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5" role="tablist" aria-label="Quote slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show quote ${i + 1} of ${n}`}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                i === active
                  ? 'h-2.5 w-10 bg-primary-600 shadow-md'
                  : 'h-2.5 w-2.5 bg-primary-300 hover:bg-primary-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteBannerCarousel;
