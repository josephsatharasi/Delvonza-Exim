import React from 'react';
import Card from '../components/common/Card';
import { Mail, Phone } from 'lucide-react';

const Inquiries = () => {
  const inquiries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', message: 'Interested in bulk order of Black Pepper', date: '2024-03-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', message: 'Need quote for Turmeric export', date: '2024-03-14' },
  ];
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Inquiries</h1>
      
      <div className="grid gap-6">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{inquiry.name}</h3>
                <p className="text-sm text-gray-500">{inquiry.date}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">New</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">{inquiry.phone}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{inquiry.message}</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Reply
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Mark as Read
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inquiries;
