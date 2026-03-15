import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Eye, Download, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const orders = [
    {
      id: 'ORD-001',
      customer: 'ABC Trading Co.',
      email: 'contact@abctrading.com',
      country: 'United States',
      products: [
        { name: 'Black Pepper', quantity: 500, price: 25 },
        { name: 'Turmeric', quantity: 300, price: 18 }
      ],
      total: 17900,
      status: 'pending',
      date: '2024-03-15',
      shippingAddress: '123 Main St, New York, NY 10001, USA'
    },
    {
      id: 'ORD-002',
      customer: 'Global Spices Ltd.',
      email: 'orders@globalspices.com',
      country: 'United Kingdom',
      products: [
        { name: 'Cardamom', quantity: 200, price: 45 },
        { name: 'Cinnamon', quantity: 150, price: 22 }
      ],
      total: 12300,
      status: 'processing',
      date: '2024-03-14',
      shippingAddress: '45 Oxford Street, London, UK'
    },
    {
      id: 'ORD-003',
      customer: 'Euro Foods GmbH',
      email: 'info@eurofoods.de',
      country: 'Germany',
      products: [
        { name: 'Cumin Seeds', quantity: 400, price: 15 }
      ],
      total: 6000,
      status: 'shipped',
      date: '2024-03-13',
      shippingAddress: 'Hauptstraße 10, Berlin, Germany'
    },
    {
      id: 'ORD-004',
      customer: 'Asian Market Inc.',
      email: 'purchase@asianmarket.com',
      country: 'Singapore',
      products: [
        { name: 'Cloves', quantity: 100, price: 35 },
        { name: 'Nutmeg', quantity: 80, price: 40 }
      ],
      total: 6700,
      status: 'delivered',
      date: '2024-03-10',
      shippingAddress: '88 Orchard Road, Singapore'
    },
    {
      id: 'ORD-005',
      customer: 'Middle East Traders',
      email: 'orders@metraders.ae',
      country: 'UAE',
      products: [
        { name: 'Saffron', quantity: 10, price: 500 }
      ],
      total: 5000,
      status: 'cancelled',
      date: '2024-03-12',
      shippingAddress: 'Dubai Marina, Dubai, UAE'
    }
  ];
  
  const getStatusColor = (status) => {
    const colors = {
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
  
  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // Here you would update the order status in your backend
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <Button icon={Download} variant="outline">
          Export Orders
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <Package className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'processing').length}
          </p>
          <p className="text-sm text-gray-600">Processing</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <Truck className="text-purple-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
          <p className="text-sm text-gray-600">Shipped</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
          <p className="text-sm text-gray-600">Delivered</p>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2">
            <span className="text-primary-600 font-bold text-lg">$</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </Card>
      </div>
      
      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-primary-600">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.country}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4 font-semibold">${order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <StatusIcon size={14} />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order Details - ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">Name:</span> {selectedOrder.customer}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                <p><span className="font-medium">Country:</span> {selectedOrder.country}</p>
                <p><span className="font-medium">Shipping Address:</span> {selectedOrder.shippingAddress}</p>
              </div>
            </div>
            
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">Quantity (kg)</th>
                      <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Price/kg</th>
                      <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4 text-center">{product.quantity}</td>
                        <td className="py-2 px-4 text-right">${product.price}</td>
                        <td className="py-2 px-4 text-right font-medium">
                          ${(product.quantity * product.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50">
                      <td colSpan="3" className="py-3 px-4 text-right font-semibold">Total:</td>
                      <td className="py-3 px-4 text-right font-bold text-lg text-primary-600">
                        ${selectedOrder.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Status Update */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Order Status</h3>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedOrder.status === status ? 'primary' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
