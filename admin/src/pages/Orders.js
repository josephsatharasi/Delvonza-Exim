import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Eye, Download, Truck, CheckCircle, XCircle, Clock, Package, Wallet, Trash2 } from 'lucide-react';
import { adminApi } from '../api/client';

const THUMB_FALLBACK =
  'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=200';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { orders: data } = await adminApi.getOrders();
      setOrders(data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const timer = setInterval(() => loadOrders(true), 10000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const awaiting = orders.filter((o) => o.status === 'payment_pending').length;
    const accepted = orders.filter((o) => o.status === 'accepted' || o.status === 'placed').length;
    return {
      awaitingPayment: awaiting,
      accepted,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      total: orders
        .filter((o) => o.paymentStatus === 'paid' || o.status !== 'payment_pending')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }, [orders]);

  const getStatusColor = (status) => {
    const colors = {
      payment_pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-emerald-100 text-emerald-800',
      placed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      payment_pending: Wallet,
      accepted: CheckCircle,
      placed: CheckCircle,
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return icons[status] || Clock;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setMessage('Order status updated.');
      await loadOrders(true);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const adminStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
  const canDeleteOrder = (status) => ['delivered', 'cancelled'].includes(status);
  const getPaymentBadge = (order) => {
    const method = String(order.paymentMethod || '').toLowerCase();
    if (method === 'cod') {
      return { label: 'Cash on Delivery', className: 'bg-amber-100 text-amber-800' };
    }
    return { label: 'Online', className: 'bg-blue-100 text-blue-800' };
  };

  const deleteOrder = async (orderId) => {
    try {
      await adminApi.deleteOrder(orderId);
      setMessage('Order deleted successfully.');
      setIsModalOpen(false);
      setSelectedOrder(null);
      await loadOrders(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600 mt-1">
            New paid orders start as <strong>Accepted</strong>. Update fulfillment below. Auto refresh every 10s.
          </p>
        </div>
        <Button icon={Download} variant="outline" onClick={() => loadOrders()}>
          Refresh
        </Button>
      </div>

      {message && <p className="mb-4 text-sm text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">{message}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2">
            <Wallet className="text-amber-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.awaitingPayment}</p>
          <p className="text-sm text-gray-600">Awaiting pay</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-2">
            <CheckCircle className="text-emerald-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.accepted}</p>
          <p className="text-sm text-gray-600">Accepted</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <Package className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.processing}</p>
          <p className="text-sm text-gray-600">Processing</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <Truck className="text-purple-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.shipped}</p>
          <p className="text-sm text-gray-600">Shipped</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.delivered}</p>
          <p className="text-sm text-gray-600">Delivered</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2">
            <span className="text-primary-600 font-bold text-lg">₹</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{inr(stats.total)}</p>
          <p className="text-sm text-gray-600">Paid revenue</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 px-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const paymentBadge = getPaymentBadge(order);
                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex -space-x-2">
                          {(order.items || []).slice(0, 4).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image || THUMB_FALLBACK}
                              alt=""
                              className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-100"
                              onError={(e) => {
                                e.currentTarget.src = THUMB_FALLBACK;
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-primary-600 text-sm max-w-[120px] truncate">
                        {order._id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.user?.name || 'Customer'}</p>
                          <p className="text-sm text-gray-600">{order.user?.email || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold">{inr(order.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge.className}`}>
                          {paymentBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <StatusIcon size={14} />
                          {String(order.status || '').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {canDeleteOrder(order.status) && (
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order — ${selectedOrder._id}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {selectedOrder.user?.name || 'Customer'}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {selectedOrder.user?.email || '-'}
                </p>
                <p>
                  <span className="font-medium">Shipping:</span> {selectedOrder.shippingAddress || '-'}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {selectedOrder.paymentStatus || '-'}
                </p>
                <p>
                  <span className="font-medium">Payment mode:</span> {getPaymentBadge(selectedOrder).label}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Order items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 w-14">Pic</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Product</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Price</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-2">
                          <img
                            src={item.image || THUMB_FALLBACK}
                            alt=""
                            className="w-12 h-12 rounded object-cover bg-gray-100"
                            onError={(e) => {
                              e.currentTarget.src = THUMB_FALLBACK;
                            }}
                          />
                        </td>
                        <td className="py-2 px-2">{item.name}</td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-right">{inr(item.price)}</td>
                        <td className="py-2 px-2 text-right font-medium">{inr(item.subtotal)}</td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50">
                      <td colSpan="4" className="py-3 px-2 text-right font-semibold">
                        Total:
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-lg text-primary-600">
                        {inr(selectedOrder.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {selectedOrder.status === 'payment_pending' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 text-sm">
                Customer has not completed payment yet. Fulfillment actions unlock after payment (status
                becomes <strong>Accepted</strong>).
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Update status</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Move the order forward: Processing → Shipped → Delivered. Use Cancel if needed.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {adminStatuses.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedOrder.status === status ? 'primary' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
                {canDeleteOrder(selectedOrder.status) && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteOrder(selectedOrder._id)}
                      icon={Trash2}
                    >
                      Delete this order
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Delete is enabled only for delivered or cancelled orders.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
