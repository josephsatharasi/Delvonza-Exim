import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import homeHero from '../../assets/home.jpg';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="min-h-[55vh] sm:min-h-[65vh] md:min-h-screen relative flex items-center justify-center pt-20 pb-12 md:pb-0">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${homeHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-700/60"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">{t('hero.title')}</h1>
        <p className="text-2xl md:text-3xl mb-4 font-light">{t('hero.subtitle')}</p>
        <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button variant="secondary">{t('hero.exploreProducts')}</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">{t('hero.getQuote')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
