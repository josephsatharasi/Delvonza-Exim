import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

/** Slugs match product URLs (/products/:slug). Update if you rename products in admin. */
const FOOTER_SPICES = [
  { label: 'Turmeric', slug: 'turmeric' },
  { label: 'Black Pepper', slug: 'black-pepper' },
  { label: 'Cardamom', slug: 'cardamom' },
  { label: 'Dried Chillies', slug: 'dried-red-chillies' },
  { label: 'Cinnamon', slug: 'cinnamon' },
  { label: 'Cloves', slug: 'cloves' }
];

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-primary-400 mb-4">Delvonza Exim</h3>
          <p className="text-gray-400">Delivering the finest Indian spices to the world with premium quality and reliable service.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/" onClick={handleLinkClick} className="hover:text-primary-400 transition">Home</Link></li>
            <li><Link to="/about" onClick={handleLinkClick} className="hover:text-primary-400 transition">About</Link></li>
            <li><Link to="/products" onClick={handleLinkClick} className="hover:text-primary-400 transition">Products</Link></li>
            <li><Link to="/services" onClick={handleLinkClick} className="hover:text-primary-400 transition">Services</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick} className="hover:text-primary-400 transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Our Spices</h4>
          <ul className="space-y-2 text-gray-400">
            {FOOTER_SPICES.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  to={`/products/${slug}`}
                  onClick={handleLinkClick}
                  className="hover:text-primary-400 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>MahabubNagar, Telangana, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span>info@delvonzaexim.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+91 9515046565</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
        <p>© 2024 Delvonza Exim. All rights reserved.</p>
        <p className="mt-2 text-sm">Available 24/7 for your business inquiries</p>
      </div>
    </footer>
  );
};

export default Footer;
