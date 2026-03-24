import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Info, Package, Briefcase, Phone, ShoppingCart, User, Languages, ClipboardList, LogOut, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './Button';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, cartCount, logout } = useStore();
  const { language, languages, changeLanguage } = useLanguage();

  const isActive = (path) => location.pathname === path;

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
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

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    handleNavigation('/');
  };

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

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
              <Languages className="w-4 h-4 text-gray-600" />
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                className="text-sm bg-transparent outline-none"
                aria-label="Select language"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600"
              onClick={() => window.scrollTo(0, 0)}
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 border rounded-lg px-3 py-2"
                >
                  <User className="w-5 h-5" />
                  <span className="max-w-28 truncate">{currentUser.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <button onClick={() => handleNavigation('/profile')} className="w-full text-left px-4 py-2 hover:bg-gray-50">Profile</button>
                    <button onClick={() => handleNavigation('/cart')} className="w-full text-left px-4 py-2 hover:bg-gray-50">My Cart</button>
                    <button onClick={() => handleNavigation('/orders')} className="w-full text-left px-4 py-2 hover:bg-gray-50">My Orders</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                <Button variant="primary">Login</Button>
              </Link>
            )}
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
            <div className="px-4 mt-4 space-y-2">
              <div className="px-4 py-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <Languages className="w-4 h-4" />
                  <span>Language</span>
                </div>
                <select
                  value={language}
                  onChange={(event) => changeLanguage(event.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  aria-label="Select language"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleNavigation('/cart')}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ShoppingCart className="w-5 h-5" />
                My Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </button>
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    My Profile
                  </button>
                  <button
                    onClick={() => handleNavigation('/orders')}
                    className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <ClipboardList className="w-5 h-5" />
                    My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-primary-600 hover:bg-primary-50"
                >
                  <LogIn className="w-5 h-5" />
                  Login / Sign Up
                </button>
              )}
            </div>
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
