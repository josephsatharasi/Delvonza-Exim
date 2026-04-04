import React, { useEffect, useRef, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { adminApi } from '../../api/client';
import { Package } from 'lucide-react';

const POLL_MS = 12000;

const lineItemHidesPrice = (item) =>
  item?.product && typeof item.product === 'object' && item.product.hidePrice === true;

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/**
 * Polls for new orders and shows a centered modal (all admin routes).
 * First successful fetch seeds "seen" ids so existing orders do not spam popups.
 */
const OrderAlertHost = () => {
  const [order, setOrder] = useState(null);
  const initRef = useRef(false);
  const seenRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    let timer;

    const tick = async () => {
      try {
        const { orders: list } = await adminApi.getOrders();
        if (cancelled || !list?.length) return;

        if (!initRef.current) {
          list.forEach((o) => seenRef.current.add(o._id));
          initRef.current = true;
          return;
        }

        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const newestUnseen = sorted.find((o) => !seenRef.current.has(o._id));
        if (newestUnseen) {
          seenRef.current.add(newestUnseen._id);
          setOrder(newestUnseen);
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

  if (!order) return null;

  return (
    <Modal
      isOpen
      onClose={() => setOrder(null)}
      title="New order"
      size="md"
    >
      <div className="flex items-start gap-3 text-gray-700">
        <div className="p-2 rounded-lg bg-primary-50 text-primary-600 shrink-0">
          <Package size={22} aria-hidden />
        </div>
        <div className="text-sm space-y-2 min-w-0">
          <p>
            <span className="font-semibold text-gray-900">Customer:</span>{' '}
            {order.user?.name || 'Customer'}{' '}
            <span className="text-gray-500">({order.user?.email || '—'})</span>
          </p>
          <p className="text-xs text-gray-500 break-all">Order ID: {order._id}</p>
          <p>
            <span className="font-semibold text-gray-900">Status:</span>{' '}
            {String(order.status || '').replace(/_/g, ' ')}
          </p>
          <div className="pt-2 border-t border-gray-100">
            <p className="font-semibold text-gray-900 mb-2">Items</p>
            <ul className="space-y-1.5">
              {(order.items || []).map((item, i) => {
                const hide = lineItemHidesPrice(item);
                return (
                  <li key={i} className="flex justify-between gap-4 text-xs sm:text-sm">
                    <span className="truncate">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 text-gray-600">
                      {hide ? 'Amount on request' : inr(item.subtotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="pt-2 font-semibold text-gray-900">
            Order total: {inr(order.total)}
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button type="button" variant="primary" onClick={() => setOrder(null)}>
          Dismiss
        </Button>
      </div>
    </Modal>
  );
};

export default OrderAlertHost;
