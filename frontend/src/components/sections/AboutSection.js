import { Link } from 'react-router-dom';
import Button from '../common/Button';

const AboutSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Indian Spices"
            className="w-full h-96 object-cover"
          />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About Delvonza Exim</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Delvonza Exim is a trusted company specializing in the export and import of high-quality spices from India to global markets. We are committed to delivering premium quality spices that reflect the rich agricultural heritage of India.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our goal is to connect international buyers with the authentic taste and aroma of Indian spices while maintaining the highest standards of quality, reliability, and customer satisfaction.
          </p>
          <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
            <Button variant="primary">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
