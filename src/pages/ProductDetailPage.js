import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { productsData } from '../data/productsData';
import { ArrowLeft, Package, MapPin, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = productsData.find(p => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button variant="primary">Back to Products</Button>
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
            <span>Back to Products</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-96 object-cover"
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
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{product.shortDescription}</p>
              
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Origin</p>
                      <p className="text-gray-600">{product.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Packaging</p>
                      <p className="text-gray-600">{product.packaging}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Available Forms</h3>
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

              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                <Button variant="primary" className="w-full">Request a Quote</Button>
              </Link>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About {product.name}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Features</h2>
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
