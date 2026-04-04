import React, { useEffect, useRef, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Mail } from 'lucide-react';
import { adminApi } from '../../api/client';
import { getAdminSocket } from '../../socket';

const POLL_MS = 12000;

/**
 * New contact requests: centered modal (same pattern as orders).
 * Uses Socket.IO when available; polls /inquiries as fallback so admins still get updates.
 */
const InquiryAlertHost = () => {
  const [inquiry, setInquiry] = useState(null);
  const initRef = useRef(false);
  const seenRef = useRef(new Set());

  const showIfUnseen = (row) => {
    if (!row?._id) return;
    const id = String(row._id);
    if (seenRef.current.has(id)) return;
    seenRef.current.add(id);
    setInquiry(row);
  };

  useEffect(() => {
    const s = getAdminSocket();
    if (!s) return undefined;

    const onNew = (payload) => {
      const next = payload?.inquiry;
      if (!next?._id) return;
      showIfUnseen({
        _id: next._id,
        name: next.name,
        email: next.email,
        phone: next.phone,
        country: next.country,
        message: next.message,
        status: next.status,
        productSlug: next.productSlug,
        productName: next.productName,
        createdAt: next.createdAt
      });
    };

    s.on('inquiry:new', onNew);
    return () => {
      s.off('inquiry:new', onNew);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const tick = async () => {
      try {
        const { inquiries: list } = await adminApi.getInquiries();
        if (cancelled || !list?.length) return;

        if (!initRef.current) {
          list.forEach((q) => seenRef.current.add(String(q._id)));
          initRef.current = true;
          return;
        }

        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const newestUnseen = sorted.find((q) => !seenRef.current.has(String(q._id)));
        if (newestUnseen) {
          showIfUnseen(newestUnseen);
        }
      } catch {
        /* ignore poll errors */
      }
    };

    tick();
    timer = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!inquiry) return null;

  return (
    <Modal
      isOpen
      onClose={() => setInquiry(null)}
      title="New contact request"
      size="md"
    >
      <div className="flex items-start gap-3 text-gray-700">
        <div className="p-2 rounded-lg bg-primary-50 text-primary-600 shrink-0">
          <Mail size={22} aria-hidden />
        </div>
        <div className="text-sm space-y-2 min-w-0">
          <p>
            <span className="font-semibold text-gray-900">From:</span> {inquiry.name}{' '}
            <span className="text-gray-500">({inquiry.email || '—'})</span>
          </p>
          {inquiry.phone ? (
            <p>
              <span className="font-semibold text-gray-900">Phone:</span> {inquiry.phone}
            </p>
          ) : null}
          {inquiry.country ? (
            <p>
              <span className="font-semibold text-gray-900">Country:</span> {inquiry.country}
            </p>
          ) : null}
          <p className="text-xs text-gray-500 break-all">Inquiry ID: {inquiry._id}</p>
          {inquiry.createdAt ? (
            <p className="text-xs text-gray-500">
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          ) : null}
          {inquiry.productName || inquiry.productSlug ? (
            <div className="pt-2 border-t border-gray-100">
              <p className="font-semibold text-gray-900 mb-1">Product</p>
              <p className="text-gray-700">
                {inquiry.productName || inquiry.productSlug}
                {inquiry.productSlug && inquiry.productName ? (
                  <span className="text-gray-500"> ({inquiry.productSlug})</span>
                ) : null}
              </p>
            </div>
          ) : null}
          <div className="pt-2 border-t border-gray-100">
            <p className="font-semibold text-gray-900 mb-2">Message</p>
            <p className="text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto">{inquiry.message}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button type="button" variant="primary" onClick={() => setInquiry(null)}>
          Dismiss
        </Button>
      </div>
    </Modal>
  );
};

export default InquiryAlertHost;
