import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { currentUser, authLoading, register } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  if (!authLoading && currentUser) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await register(formData);
    if (!response.success) {
      setError(response.message);
      return;
    }
    navigate('/login', { state: { message: response.message } });
  };

  return (
    <div>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600 mb-6">Register to place and track your orders.</p>
            {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
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
                placeholder="Email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                minLength={6}
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-3 font-semibold"
              >
                Sign Up
              </button>
            </form>
            <p className="text-gray-600 mt-6">
              Already have an account?{' '}
              <Link className="text-primary-600 font-semibold" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default SignupPage;
