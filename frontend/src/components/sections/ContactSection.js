import Button from '../common/Button';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Get In Touch</h2>
        <p className="text-center text-gray-600 mb-12">
          We're here to help with your spice export inquiries 24/7
        </p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
              
              <Button variant="primary" className="w-full">Send Message</Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600">MahabubNagar, Telangana, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">info@delvonzaexim.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600">+91 9515046565</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Business Hours</h4>
                    <p className="text-gray-600">24 Hours / 7 Days a Week</p>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/919515046565" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
