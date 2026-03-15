import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import HeroSection from '../components/sections/HeroSection';
import { Link } from 'react-router-dom';
import { Package, Globe, Award, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      
      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Delvonza Exim</h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Delvonza Exim is a trusted company specializing in the export and import of high-quality spices from India to global markets. We are committed to delivering premium quality spices that reflect the rich agricultural heritage of India.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our goal is to connect international buyers with the authentic taste and aroma of Indian spices while maintaining the highest standards of quality, reliability, and customer satisfaction. With a strong sourcing network and efficient logistics support, Delvonza Exim ensures that every product reaches our customers safely and on time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-white rounded-lg shadow-lg">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully selected spices from trusted suppliers across India
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-white rounded-lg shadow-lg">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Global Reach</h3>
              <p className="text-gray-600">
                Serving international markets with reliable export services
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-white rounded-lg shadow-lg">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Trusted Partner</h3>
              <p className="text-gray-600">
                Building long-term relationships through quality and service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spices Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Premium Indian Spices</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We export a wide range of authentic Indian spices, carefully selected for their quality, aroma, and flavor
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {[
              { name: 'Turmeric', image: 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'turmeric' },
              { name: 'Black Pepper', image: 'https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'black-pepper' },
              { name: 'Cardamom', image: 'https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cardamom' },
              { name: 'Red Chilli', image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'dried-red-chillies' },
              { name: 'Cinnamon', image: 'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cinnamon' },
              { name: 'Cumin', image: 'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=500', slug: 'cumin-seeds' }
            ].map((spice, index) => (
              <Link key={index} to={`/products/${spice.slug}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer">
                  <div className="h-40 overflow-hidden">
                    <img src={spice.image} alt={spice.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-semibold text-gray-800">{spice.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/products" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/75 to-primary-700/70"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Spice Import Journey?</h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Connect with us today to discuss your requirements. We're available 24/7 to serve you.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              to="/products" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default HomePage;
