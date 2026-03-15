import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Info, Package, Briefcase, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './Button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Phone }
  ];

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-md z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary-600"
            onClick={() => window.scrollTo(0, 0)}
          >
            Delvonza Exim
          </Link>
          
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`hover:text-primary-600 transition ${isActive(item.path) ? 'text-primary-600 font-semibold' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="primary">Get Quote</Button>
            </Link>
          </div>

          <button 
            className="md:hidden text-gray-700 z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-primary-600">Menu</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-primary-600"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-lg">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => handleNavigation('/contact')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
