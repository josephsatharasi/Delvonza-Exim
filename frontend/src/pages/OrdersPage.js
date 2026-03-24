import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/productPricing';
import Button from '../components/common/Button';

const statusStyle = (status) => {
  const s = String(status || '').toLowerCase();
  const map = {
    payment_pending: 'bg-amber-100 text-amber-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    placed: 'bg-emerald-100 text-emerald-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return map[s] || 'bg-gray-100 text-gray-800';
};

const OrdersPage = () => {
  const { currentUser, authLoading, userOrders, openStripeCheckoutForOrder } = useStore();
  const [payNote, setPayNote] = useState('');

  if (authLoading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-700">Loading orders...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
          {payNote && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{payNote}</p>}
          {!userOrders.length ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No orders placed yet.</p>
              <Link className="text-primary-600 font-semibold" to="/products">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-gray-800">{order._id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt || order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle(
                          order.status
                        )}`}
                      >
                        {String(order.status || '').replace('_', ' ')}
                      </p>
                      <p className="font-bold text-gray-800">{formatCurrency(order.total)}</p>
                      {order.status === 'payment_pending' && (
                        <Button
                          variant="primary"
                          className="text-sm py-2 px-4"
                          onClick={async () => {
                            setPayNote('');
                            const result = await openStripeCheckoutForOrder(order._id);
                            if (!result.success && !result.redirecting) setPayNote(result.message);
                          }}
                        >
                          Pay now
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={`${order._id}-${item.product || item.name}`} className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded object-cover bg-gray-100"
                          onError={(e) => {
                            e.target.src =
                              'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=200';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default OrdersPage;
