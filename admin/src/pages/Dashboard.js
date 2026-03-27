import React, { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import { Package, TrendingUp, Wallet, Truck } from 'lucide-react';
import { adminApi } from '../api/client';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [p, o] = await Promise.all([adminApi.getProducts(), adminApi.getOrders()]);
        if (cancelled) return;
        setProducts(p.products || []);
        setOrders(o.orders || []);
      } catch (err) {
        if (!cancelled) setMessage(err.message || 'Failed to load dashboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.paymentStatus === 'paid' || o.status !== 'payment_pending')
        .reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );

  const shippedCount = useMemo(() => orders.filter((o) => o.status === 'shipped').length, [orders]);
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);

  const topProducts = useMemo(() => {
    const counts = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.name || String(item.product || 'unknown');
        counts.set(key, (counts.get(key) || 0) + Number(item.quantity || 0));
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
  }, [orders]);

  const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {message && <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{message}</p>}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Products" 
          value={loading ? '—' : String(products.length)} 
          icon={Package} 
          color="primary"
        />
        <StatCard 
          title="Total Orders" 
          value={loading ? '—' : String(orders.length)} 
          icon={TrendingUp} 
          color="blue"
        />
        <StatCard 
          title="Paid Revenue" 
          value={loading ? '—' : inr(revenue)} 
          icon={Wallet} 
          color="green"
        />
        <StatCard 
          title="Delivered / Shipped" 
          value={loading ? '—' : `${deliveredCount} / ${shippedCount}`} 
          icon={Truck} 
          color="orange"
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Orders" subtitle="Latest orders (auto from database)">
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-600">Loading…</p>
            ) : orders.length ? (
              orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{order.user?.name || 'Customer'}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {order._id} • {String(order.status || '').replace('_', ' ')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt || order.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No orders yet.</p>
            )}
          </div>
        </Card>
        
        <Card title="Top Products" subtitle="Best selling spices">
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-600">Loading…</p>
            ) : topProducts.length ? (
              topProducts.map((p, index) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-800 truncate">{p.name}</p>
                  </div>
                  <span className="text-sm text-gray-600">{p.qty} qty</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No sales data yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
