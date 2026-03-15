import FeatureCard from '../common/FeatureCard';
import { Award, Truck, Globe, Handshake, DollarSign, TrendingUp } from 'lucide-react';

const WhyChooseSection = () => {
  const features = [
    { icon: Globe, title: 'Global Trade Expertise', description: 'We understand international trade requirements and ensure smooth operations' },
    { icon: Award, title: 'Quality Assurance', description: 'Strict quality standards to meet global expectations' },
    { icon: Truck, title: 'Reliable Supply Chain', description: 'Strong logistics network for safe and timely delivery worldwide' },
    { icon: Handshake, title: 'Customer-Centric', description: 'Building long-term relationships through transparent communication' },
    { icon: DollarSign, title: 'Competitive Pricing', description: 'High-quality products at competitive prices' },
    { icon: TrendingUp, title: 'Commitment to Excellence', description: 'Delivering excellence in every transaction' }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Why Choose Delvonza Exim</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Your trusted partner for premium Indian spices with global reach
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
