import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import ContactSection from '../components/sections/ContactSection';

const ContactPage = () => {
  return (
    <div>
      <Header />
      
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Thank you for your interest in Delvonza Exim. We are always ready to assist you with inquiries related to spice export, product sourcing, and international trade partnerships.
          </p>
        </div>
      </section>

      <ContactSection />

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ContactPage;
