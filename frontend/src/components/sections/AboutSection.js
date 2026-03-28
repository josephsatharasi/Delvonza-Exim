import { Link } from 'react-router-dom';
import Button from '../common/Button';
import aboutImage from '../../assets/about.jpg';

const AboutSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 lg:gap-12 items-stretch">
        <div className="rounded-lg overflow-hidden shadow-xl min-h-[280px] h-full flex order-2 md:order-1">
          <img
            src={aboutImage}
            alt="Indian Spices"
            className="w-full h-full min-h-[280px] md:min-h-[24rem] object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-between gap-6 order-1 md:order-2">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Delvonza Exim</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Delvonza Exim is a trusted company specializing in the export and import of high-quality spices from India to global markets. We are committed to delivering premium quality that reflects India&apos;s agricultural heritage—from sourcing and grading to packing and shipment.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We connect international buyers with authentic taste, aroma, and consistency. Our team supports you with clear specifications, reliable timelines, and packaging options suited to wholesale, retail, and food-industry needs.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Whether you are sampling a new line or scaling recurring orders, we focus on responsive service and long-term partnerships built on trust and repeat quality.
            </p>
          </div>
          <div>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="primary">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
