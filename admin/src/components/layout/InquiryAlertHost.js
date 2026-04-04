import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Mail } from 'lucide-react';
import { getAdminSocket } from '../../socket';

/**
 * Subscribes to Socket.IO `inquiry:new` so admins see website contact submissions in real time.
 */
const InquiryAlertHost = () => {
  const [inquiry, setInquiry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const s = getAdminSocket();
    if (!s) return undefined;

    const onNew = (payload) => {
      const next = payload?.inquiry;
      if (next?._id) setInquiry(next);
    };

    s.on('inquiry:new', onNew);
    return () => {
      s.off('inquiry:new', onNew);
    };
  }, []);

  if (!inquiry) return null;

  return (
    <Modal isOpen onClose={() => setInquiry(null)} title="New customer inquiry" size="md">
      <div className="flex items-start gap-3 text-gray-700">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
          <Mail size={22} aria-hidden />
        </div>
        <div className="text-sm space-y-2 min-w-0">
          <p>
            <span className="font-semibold text-gray-900">From:</span> {inquiry.name}
            <span className="text-gray-500"> ({inquiry.email})</span>
          </p>
          {inquiry.phone ? (
            <p>
              <span className="font-semibold text-gray-900">Phone:</span> {inquiry.phone}
            </p>
          ) : null}
          {inquiry.productName || inquiry.productSlug ? (
            <p className="text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-md inline-block">
              Product: {inquiry.productName || inquiry.productSlug}
            </p>
          ) : null}
          <p className="text-gray-600 whitespace-pre-wrap line-clamp-6 border-t border-gray-100 pt-2 mt-1">
            {inquiry.message}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setInquiry(null);
            navigate('/inquiries');
          }}
        >
          Open inquiries
        </Button>
        <Button type="button" variant="primary" onClick={() => setInquiry(null)}>
          Dismiss
        </Button>
      </div>
    </Modal>
  );
};

export default InquiryAlertHost;
