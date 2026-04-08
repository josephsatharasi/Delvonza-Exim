import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { Target, Eye, Award } from 'lucide-react';
import aboutImage from '../assets/about.jpg';

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
          <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-stretch mb-20">
            <div className="flex flex-col justify-between gap-8 min-h-0">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Delvonza Exim specializes in the import and export of premium spices from India to international markets. India is globally recognized for its diversity of spices—from black pepper and cardamom to turmeric, cumin, and beyond—and our mission is to bring that authenticity to buyers who expect consistent quality and dependable supply.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We work closely with trusted growers and processors across key producing regions. Every lot is evaluated for aroma, color, moisture, and purity before it moves forward. Whether you need whole spices, standardized grades, or customized packaging for retail or food service, we align sourcing and documentation with your specifications.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Logistics and timing matter as much as the product itself. We coordinate packing, labeling, and shipment schedules so your orders arrive in good condition and on time. Our team stays responsive from first inquiry through delivery, because we believe export partnerships grow on clarity, honesty, and repeat performance—not one-off transactions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  At Delvonza Exim, we listen first: your market, your volume, your compliance needs. Then we propose practical solutions—samples, pricing structures, and steady replenishment—so you can introduce or scale Indian spices in your region with confidence.
                </p>
              </div>
              <div className="rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50/80 to-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 mb-3">
                  What you can expect from us
                </p>
                <ul className="space-y-2.5 text-gray-700 text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold shrink-0">·</span>
                    Transparent communication on grades, origin, and availability
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold shrink-0">·</span>
                    Flexible packaging options suited to wholesale, private label, or bulk
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold shrink-0">·</span>
                    Support for documentation and smooth coordination with freight partners
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold shrink-0">·</span>
                    A long-term mindset—we invest in relationships, not only in single shipments
                  </li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl h-[360px] md:h-full flex">
              <img
                src={aboutImage}
                alt="Premium Indian spices — whole and ground varieties"
                className="w-full h-full object-contain object-center"
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
