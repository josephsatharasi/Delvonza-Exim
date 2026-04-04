import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { ArrowLeft, Package, MapPin, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/productPricing';
import { apiClient } from '../api/client';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800';
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState('');
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { product: result } = await apiClient.getProductBySlug(slug);
        setProduct(result);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-700">{t('product.loading')}</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('product.notFound')}</h1>
          <Link to="/products">
            <Button variant="primary">{t('product.backToProducts')}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <section className="pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <Link 
            to="/products" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('product.backToProducts')}</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                <img 
                  src={product.images?.[selectedImage] || fallbackImage} 
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image || fallbackImage} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{product.shortDescription}</p>
              {product.hidePrice ? (
                <p className="text-xl font-semibold text-gray-700 mb-4">{t('product.contactPricing')}</p>
              ) : (
                <p className="text-2xl font-bold text-primary-700 mb-4" translate="no">
                  {formatCurrency(product.price)}
                </p>
              )}
              
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('product.details')}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">{t('product.origin')}</p>
                      <p className="text-gray-600">{product.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">{t('product.packaging')}</p>
                      <p className="text-gray-600">{product.packaging}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('product.formsTitle')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.forms.map((form, index) => (
                    <span 
                      key={index}
                      className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              </div>

              {message && <p className="mb-3 text-green-700 bg-green-50 p-3 rounded-lg">{message}</p>}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={Boolean(product.hidePrice)}
                  title={
                    product.hidePrice
                      ? t('product.addToCartDisabledHint')
                      : undefined
                  }
                  onClick={async () => {
                    if (product.hidePrice) return;
                    const result = await addToCart(product._id);
                    setMessage(result.message);
                  }}
                >
                  {product.hidePrice ? t('product.addToCartDisabled') : t('product.addToCart')}
                </Button>
                <Link to="/cart" onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="secondary" className="w-full border border-primary-600">
                    {t('product.goToCart')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('product.about', { name: product.name })}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('product.featuresTitle')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProductDetailPage;
