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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('productsPage.sectionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {t('productsPage.sectionBody')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                name={product.name} 
                image={product.images[0]}
                slug={product.slug}
                description={product.shortDescription || product.description || ''}
              />
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('productsPage.highlightsTitle')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight1')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight2')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight3')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{t('productsPage.highlight4')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
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
