import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';

const ProfilePage = () => {
  const { currentUser, authLoading, updateProfile } = useStore();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  if (authLoading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-700">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await updateProfile(formData);
    setMessage(response.message);
  };

  return (
    <div>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600 mb-6">Manage your account details for faster checkout.</p>
            {message && <p className="mb-4 text-green-700 bg-green-50 p-3 rounded-lg">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                rows={4}
                placeholder="Address"
                value={formData.address}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 font-semibold"
              >
                Update Profile
              </button>
            </form>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/cart" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <h2 className="text-xl font-bold text-gray-800 mb-2">My Cart</h2>
              <p className="text-gray-600">Review quantity and checkout.</p>
            </Link>
            <Link to="/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <h2 className="text-xl font-bold text-gray-800 mb-2">My Orders</h2>
              <p className="text-gray-600">Track all orders placed from your account.</p>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProfilePage;
