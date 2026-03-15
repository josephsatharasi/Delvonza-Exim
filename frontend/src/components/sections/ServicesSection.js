import FeatureCard from '../common/FeatureCard';
import { Package, Search, CheckCircle, Box, Truck } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { icon: Package, title: 'Spice Export', description: 'Export of premium quality Indian spices worldwide' },
    { icon: Search, title: 'Product Sourcing', description: 'Sourcing the best products from trusted suppliers' },
    { icon: CheckCircle, title: 'Quality Control', description: 'Rigorous quality checks at every stage' },
    { icon: Box, title: 'Packaging Solutions', description: 'Secure and hygienic packaging for freshness' },
    { icon: Truck, title: 'Logistics Support', description: 'Reliable delivery to international customers' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional services for smooth international spice trade
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FeatureCard key={index} icon={service.icon} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
