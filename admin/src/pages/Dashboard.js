import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import { Package, MessageSquare, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Products" 
          value="14" 
          icon={Package} 
          color="primary"
          trend={12}
        />
        <StatCard 
          title="New Inquiries" 
          value="23" 
          icon={MessageSquare} 
          color="blue"
          trend={8}
        />
        <StatCard 
          title="Total Orders" 
          value="156" 
          icon={TrendingUp} 
          color="green"
          trend={15}
        />
        <StatCard 
          title="Active Customers" 
          value="89" 
          icon={Users} 
          color="orange"
          trend={-3}
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Inquiries" subtitle="Latest customer inquiries">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Customer Name {item}</p>
                  <p className="text-sm text-gray-600">Inquiry about Black Pepper</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Top Products" subtitle="Best selling spices">
          <div className="space-y-4">
            {['Black Pepper', 'Turmeric', 'Cardamom'].map((product, index) => (
              <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="font-medium text-gray-800">{product}</p>
                </div>
                <span className="text-sm text-gray-600">{150 - index * 20} orders</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
