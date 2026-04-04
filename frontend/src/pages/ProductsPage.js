import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import ProductCard from '../components/common/ProductCard';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products: responseProducts } = await apiClient.getProducts();
        setProducts(responseProducts || []);
      } catch (error) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">{t('productsPage.heroTitle')}</h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            {t('productsPage.heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('productsPage.sectionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {t('productsPage.sectionBody')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mb-12 md:mb-16">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-[0_1_100%] w-full max-w-[280px] sm:flex-[0_1_calc(50%-12px)] sm:max-w-[calc(50%-12px)] md:flex-[0_1_calc(33.333%-16px)] md:max-w-[calc(33.333%-16px)] lg:flex-[0_1_260px] lg:max-w-[260px] lg:w-[260px]"
              >
                <ProductCard
                  name={product.name}
                  image={product.images[0]}
                  slug={product.slug}
                  description={product.shortDescription || product.description || ''}
                />
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('productsPage.highlightsTitle')}</h3>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.28rem)]">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight1')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.28rem)]">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight2')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.28rem)]">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight3')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.28rem)]">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight4')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.28rem)]">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight5')}</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl text-gray-600 mb-6">
              {t('productsPage.closing')}
            </p>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="primary">{t('productsPage.requestQuote')}</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProductsPage;
