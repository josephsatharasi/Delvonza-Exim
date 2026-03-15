import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import ImageUpload from '../components/common/ImageUpload';
import { Plus, Edit, Trash2, Package as PackageIcon } from 'lucide-react';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    origin: '',
    images: []
  });
  
  // All spices list
  const spiceOptions = [
    { value: 'black-pepper', label: 'Black Pepper' },
    { value: 'turmeric', label: 'Turmeric' },
    { value: 'cardamom', label: 'Cardamom' },
    { value: 'dried-red-chillies', label: 'Dried Red Chillies' },
    { value: 'cinnamon', label: 'Cinnamon' },
    { value: 'cloves', label: 'Cloves' },
    { value: 'cumin-seeds', label: 'Cumin Seeds' },
    { value: 'coriander-seeds', label: 'Coriander Seeds' },
    { value: 'fennel-seeds', label: 'Fennel Seeds' },
    { value: 'ginger', label: 'Ginger' },
    { value: 'nutmeg', label: 'Nutmeg' },
    { value: 'bay-leaves', label: 'Bay Leaves (Thyme)' },
    { value: 'saffron', label: 'Saffron' },
    { value: 'vanilla', label: 'Vanilla' }
  ];
  
  const products = [
    { id: 1, name: 'Black Pepper', category: 'Spices', stock: 500, price: '$25/kg' },
    { id: 2, name: 'Turmeric', category: 'Spices', stock: 350, price: '$18/kg' },
    { id: 3, name: 'Cardamom', category: 'Spices', stock: 200, price: '$45/kg' },
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product Data:', formData);
    // Here you would send the data to your backend
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      stock: '',
      origin: '',
      images: []
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.stock} kg</td>
                  <td className="py-3 px-4">{product.price}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Product Name"
              name="name"
              placeholder="Select a spice"
              value={formData.name}
              onChange={handleInputChange}
              options={spiceOptions}
              required
            />
            
            <Input
              label="Category"
              name="category"
              placeholder="e.g., Spices"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Price (per kg)"
              name="price"
              type="number"
              placeholder="e.g., 25"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Stock (kg)"
              name="stock"
              type="number"
              placeholder="e.g., 500"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Origin"
              name="origin"
              placeholder="e.g., Kerala, India"
              value={formData.origin}
              onChange={handleInputChange}
            />
          </div>
          
          <Textarea
            label="Description"
            name="description"
            placeholder="Enter product description..."
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
          
          <ImageUpload
            maxImages={4}
            onChange={handleImagesChange}
          />
          
          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" icon={Plus}>
              Add Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
