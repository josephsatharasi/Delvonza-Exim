import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { apiClient } from '../../api/client';

const ContactSection = () => {
  const { t } = useTranslation();
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
      setStatus({ type: 'ok', text: t('contact.success') });
      setForm({ name: '', email: '', phone: '', country: '', message: '' });
    } catch (err) {
      setStatus({ type: 'err', text: err.message || t('contact.error') });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">{t('contact.title')}</h2>
        <p className="text-center text-gray-600 mb-12">
          {t('contact.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formHeading')}</h3>
            {status.text && (
              <p
                className={`mb-4 p-3 rounded-lg text-sm ${
                  status.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
                }`}
              >
                {status.text}
              </p>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact.name')}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact.email')}
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('contact.phone')}
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder={t('contact.country')}
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <textarea
                name="message"
                placeholder={t('contact.message')}
                rows="5"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />

              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md disabled:opacity-60"
              >
                {sending ? t('contact.sending') : t('contact.submit')}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.infoHeading')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('contact.addressLabel')}</h4>
                    <p className="text-gray-600">{t('footer.address')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('contact.emailLabel')}</h4>
                    <p className="text-gray-600">info@delvonzaexim.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('contact.phoneLabel')}</h4>
                    <p className="text-gray-600">+91 9515046565</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('contact.hoursLabel')}</h4>
                    <p className="text-gray-600">{t('contact.hoursValue')}</p>
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
              <span className="font-semibold">{t('contact.whatsapp')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
