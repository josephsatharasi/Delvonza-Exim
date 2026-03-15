import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-700/60"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">Delvonza Exim</h1>
        <p className="text-2xl md:text-3xl mb-4 font-light">Delivering the Finest Indian Spices to the World</p>
        <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
          Trusted exporter of premium quality spices from India to global markets
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button variant="secondary">Explore Products</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Get Quote</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
