import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import FeatureCard from '../components/common/FeatureCard';
import { Package, Search, CheckCircle, Box, Truck } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    { 
      icon: Package, 
      title: 'Spice Export', 
      description: 'We specialize in exporting a wide variety of premium Indian spices to international markets. Our export process follows proper quality checks and international trade standards to ensure safe and timely delivery.'
    },
    { 
      icon: Search, 
      title: 'Product Sourcing', 
      description: 'We source our spices from trusted farmers and suppliers across India. Each product is carefully selected to ensure freshness, purity, and consistent quality.'
    },
    { 
      icon: CheckCircle, 
      title: 'Quality Control', 
      description: 'Our team ensures that every spice product undergoes proper cleaning, grading, and quality inspection before export to meet international standards.'
    },
    { 
      icon: Box, 
      title: 'Packaging Solutions', 
      description: 'We provide secure and hygienic packaging to maintain the freshness and aroma of spices during transportation and international shipping.'
    },
    { 
      icon: Truck, 
      title: 'Logistics Support', 
      description: 'With reliable logistics partners, we ensure that products are delivered safely and on time to our international customers.'
    }
  ];

  return (
    <div>
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Our Services</h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            We provide reliable and professional services to ensure smooth international trade of high-quality Indian spices
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <FeatureCard key={index} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Professional Approach</h3>
                <p className="text-gray-100 leading-relaxed">
                  We follow international trade standards and maintain transparency in all our business operations. Our team is dedicated to providing professional service at every step.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quality Commitment</h3>
                <p className="text-gray-100 leading-relaxed">
                  Every product goes through rigorous quality checks to ensure it meets international standards. We are committed to delivering only the best to our clients.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Reliable Network</h3>
                <p className="text-gray-100 leading-relaxed">
                  With a strong network of suppliers and logistics partners, we ensure smooth operations from sourcing to delivery across global markets.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
                <p className="text-gray-100 leading-relaxed">
                  We understand customer requirements and work closely with our clients to provide customized solutions that meet their specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ServicesPage;
