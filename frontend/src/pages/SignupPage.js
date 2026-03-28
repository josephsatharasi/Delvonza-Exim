import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';
import { fetchCountriesWithDialAndLanguages } from '../utils/globalLocales';
import PasswordField from '../components/common/PasswordField';

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
  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setCountryLoading(true);
        const list = await fetchCountriesWithDialAndLanguages();
        if (cancelled) return;
        setCountries(list);
        // Pick a sensible default based on browser locale if available, else first.
        const locale = navigator.language || '';
        const countryPart = locale.split('-')[1]?.toUpperCase();
        const match = countryPart ? list.find((c) => c.cca2 === countryPart) : null;
        setCountry(match || list[0] || null);
      } catch (e) {
        if (!cancelled) {
          setCountries([]);
          setCountry(null);
        }
      } finally {
        if (!cancelled) setCountryLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dialCode = useMemo(() => {
    if (!country?.dialCodes?.length) return '';
    // Use the first dial code as default.
    return country.dialCodes[0];
  }, [country]);

  if (!authLoading && currentUser) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedPhone = String(formData.phone || '').trim();
    const fullPhone =
      normalizedPhone && dialCode ? `${dialCode}${normalizedPhone.replace(/^\+/, '')}` : normalizedPhone;
    const response = await register({ ...formData, phone: fullPhone });
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
              <PasswordField
                placeholder="Password"
                minLength={6}
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                required
                autoComplete="new-password"
              />
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                <div className="sm:col-span-5">
                  <select
                    value={country?.cca2 || ''}
                    onChange={(event) => {
                      const next = countries.find((c) => c.cca2 === event.target.value) || null;
                      setCountry(next);
                    }}
                    disabled={countryLoading || !countries.length}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100"
                    aria-label="Select country code"
                    required
                  >
                    {countries.map((c) => {
                      const langs = (c.languages || []).slice(0, 2).join(', ');
                      const label = `${c.name} (${c.dialCodes[0]})${langs ? ` — ${langs}` : ''}`;
                      return (
                        <option key={c.cca2} value={c.cca2}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="sm:col-span-2 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 shrink-0">
                  {dialCode || '—'}
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="tel"
                    placeholder="Phone number (without country code)"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                required
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
