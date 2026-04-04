import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Mail, Phone, Globe, RefreshCw } from 'lucide-react';
import { adminApi } from '../api/client';
import { getAdminSocket } from '../socket';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { inquiries: data } = await adminApi.getInquiries();
      setInquiries(data || []);
      setMessage('');
    } catch (e) {
      setMessage(e.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const s = getAdminSocket();
    if (!s) return undefined;

    const onNew = (payload) => {
      const raw = payload?.inquiry;
      if (!raw?._id) return;
      setInquiries((prev) => {
        if (prev.some((q) => String(q._id) === String(raw._id))) return prev;
        const row = {
          _id: raw._id,
          name: raw.name,
          email: raw.email,
          phone: raw.phone,
          country: raw.country,
          message: raw.message,
          status: raw.status || 'new',
          productSlug: raw.productSlug,
          productName: raw.productName,
          createdAt: raw.createdAt || new Date().toISOString()
        };
        return [row, ...prev];
      });
    };

    s.on('inquiry:new', onNew);
    return () => {
      s.off('inquiry:new', onNew);
    };
  }, []);

  const markRead = async (id) => {
    try {
      await adminApi.updateInquiryStatus(id, 'read');
      setInquiries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: 'read' } : q))
      );
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Inquiries</h1>
        <Button icon={RefreshCw} variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>
      {message && <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{message}</p>}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : !inquiries.length ? (
        <Card>
          <p className="text-gray-600">No inquiries yet. Submissions from the website contact form appear here.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inquiry) => (
            <Card key={inquiry._id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{inquiry.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    inquiry.status === 'new'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {inquiry.status === 'new' ? 'New' : 'Read'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{inquiry.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">{inquiry.phone || '—'}</span>
                </div>
                {inquiry.country ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <span className="text-sm">{inquiry.country}</span>
                  </div>
                ) : null}
              </div>

              {(inquiry.productName || inquiry.productSlug) && (
                <p className="text-sm text-primary-700 bg-primary-50 px-3 py-2 rounded-lg mb-3">
                  <span className="font-semibold">Product:</span>{' '}
                  {inquiry.productName || inquiry.productSlug}
                  {inquiry.productSlug && inquiry.productName ? (
                    <span className="text-gray-500"> ({inquiry.productSlug})</span>
                  ) : null}
                </p>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>

              {inquiry.status === 'new' && (
                <div className="flex gap-3 mt-4">
                  <a
                    href={`mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(
                      'Re: Delvonza Exim inquiry'
                    )}`}
                    className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Reply
                  </a>
                  <button
                    type="button"
                    onClick={() => markRead(inquiry._id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inquiries;
