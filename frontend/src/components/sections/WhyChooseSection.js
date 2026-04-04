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
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Why Choose Delvonza Exim</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Your trusted partner for premium Indian spices with global reach
        </p>
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-[0_1_100%] w-full max-w-[320px] sm:flex-[0_1_calc(50%-12px)] sm:max-w-[calc(50%-12px)] lg:flex-[0_1_300px] lg:max-w-[300px] lg:w-[300px]"
            >
              <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
