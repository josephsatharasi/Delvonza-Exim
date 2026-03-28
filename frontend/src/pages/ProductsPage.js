import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import ProductCard from '../components/common/ProductCard';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';

const ProductsPage = () => {
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
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Our Premium Spices</h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            We specialize in exporting a wide range of premium quality spices sourced from trusted suppliers in India
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Spices We Export</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Our products are carefully selected to maintain freshness, purity, and international quality standards. We supply these spices in different forms such as whole, crushed, or ground, based on the requirements of our global clients.
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
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Key Highlights</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">Premium Quality Indian Spices</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">Reliable Global Supply</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">Strong Supplier Network</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">Quality Assurance Standards</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-gray-800">Professional Export Services</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl text-gray-600 mb-6">
              Our focus is to deliver authentic Indian spices with rich aroma, natural flavor, and consistent quality to international markets.
            </p>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="primary">Request a Quote</Button>
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
