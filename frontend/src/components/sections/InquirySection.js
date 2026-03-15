import { Link } from 'react-router-dom';
import Button from '../common/Button';

const InquirySection = () => {
  return (
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
        <h2 className="text-4xl font-bold mb-4 text-white">Looking to Import High-Quality Indian Spices?</h2>
        <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
          Get in touch with us for the best deals and premium products. Available 24/7 for your business inquiries.
        </p>
        <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
          <Button variant="secondary">Send Export Inquiry</Button>
        </Link>
      </div>
    </section>
  );
};

export default InquirySection;
