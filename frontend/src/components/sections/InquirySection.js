import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import homeCta from '../../assets/home.jpg';

const InquirySection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSending(true);
    try {
      await apiClient.submitInquiry(form);
      setStatus({ type: 'ok', text: 'Thank you. We received your inquiry and will reply soon.' });
      setForm({ name: '', email: '', phone: '', country: '', message: '' });
    } catch (err) {
      setStatus({ type: 'err', text: err.message || 'Could not send your inquiry.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-20 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${homeCta})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/75" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-4 text-white">Looking to Import High-Quality Indian Spices?</h2>
            <p className="text-xl text-gray-100 leading-relaxed mb-6">
              Send your export inquiry below. Our team receives it in the admin panel and will get back to you.
              Available 24/7 for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block text-center text-primary-700 bg-white hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition shadow-md"
              >
                Full contact page
              </Link>
              <Link
                to="/products"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block text-center border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition"
              >
                Browse products
              </Link>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Export inquiry</h3>
            <p className="text-sm text-gray-600 mb-6">Fields match the contact form and are stored for admin review.</p>

            {status.text && (
              <p
                className={`mb-4 p-3 rounded-lg text-sm ${
                  status.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
                }`}
              >
                {status.text}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (with country code)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Your inquiry — products, volumes, destination port, timeline…"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md disabled:opacity-60 transition"
              >
                {sending ? 'Sending…' : 'Send export inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquirySection;
