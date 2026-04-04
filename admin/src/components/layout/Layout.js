import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminProfileModal from './AdminProfileModal';
import OrderAlertHost from './OrderAlertHost';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onProfileClick={() => setProfileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      <AdminProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <OrderAlertHost />
    </div>
  );
};

export default Layout;
