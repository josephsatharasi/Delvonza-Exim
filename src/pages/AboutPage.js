import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { Target, Eye, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">About Delvonza Exim</h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in exporting premium Indian spices to global markets
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Delvonza Exim specializes in the import and export of different types of spices from India to international markets. India is globally known for its rich variety of spices, and our mission is to deliver high-quality Indian spices to customers around the world.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We carefully select and supply spices that meet high quality and international standards. With a strong supply network and reliable partners, we aim to build long-term and trustworthy business relationships in the global market.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At Delvonza Exim, our focus is to understand customer requirements and provide the best service while introducing the unique flavor and richness of Indian spices to the international market.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Spices"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver high-quality Indian spices to international markets while maintaining the highest standards of quality, reliability, and customer satisfaction. We aim to build long-term relationships with our global partners.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become a trusted global supplier of premium Indian spices and expand our presence in international markets while promoting the rich flavor and heritage of Indian spices.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-lg shadow-lg text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in building long-term partnerships by offering consistent quality, reliable supply, competitive pricing, and professional service to create strong business relationships worldwide.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Global Export Network</h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              At Delvonza Exim, we focus on delivering high-quality Indian spices to international markets. With a reliable supply chain and efficient logistics support, we aim to build strong and long-term business relationships with global partners. We continuously work towards connecting global buyers with the authentic taste and rich aroma of Indian spices.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default AboutPage;
