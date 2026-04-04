import React from 'react';
import { Menu, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Header = ({ onMenuClick, onProfileClick }) => {
  const { adminEmail } = useAdminAuth();
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Center: Page Title (optional, can be dynamic) */}
        <div className="hidden lg:block">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        
        {/* Right: Profile */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <button
            type="button"
            onClick={() => onProfileClick?.()}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-left"
            aria-label="Open admin profile"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-600 truncate max-w-[200px]">{adminEmail}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
