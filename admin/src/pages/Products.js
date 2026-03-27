import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import ImageUpload from '../components/common/ImageUpload';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminApi } from '../api/client';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    origin: '',
    images: []
  });
  
  // All spices list
  const spiceOptions = [
    // Your provided list (kept as simple slugs)
    { value: 'red-chilli', label: 'Red Chilli' },
    { value: 'cumin', label: 'Cumin' },
    { value: 'turmeric', label: 'Turmeric' },
    { value: 'coriander', label: 'Coriander' },
    { value: 'ginger', label: 'Ginger' },
    { value: 'black-pepper', label: 'Black Pepper' },
    { value: 'cardamom', label: 'Cardamom' },
    { value: 'fenugreek', label: 'Fenugreek' },
    { value: 'fennel', label: 'Fennel' },
    { value: 'garlic', label: 'Garlic' },
    { value: 'clove', label: 'Clove' },
    { value: 'nutmeg', label: 'Nutmeg' },
    { value: 'mace', label: 'Mace' },
    { value: 'mustard-seeds', label: 'Mustard Seeds' },
    { value: 'celery', label: 'Celery' },
    { value: 'jaggery', label: 'Jaggery' },
    { value: 'onion', label: 'Onion' },

    // Extra options you already had
    { value: 'cinnamon', label: 'Cinnamon' },
    { value: 'cloves', label: 'Cloves' },
    { value: 'cumin-seeds', label: 'Cumin Seeds' },
    { value: 'coriander-seeds', label: 'Coriander Seeds' },
    { value: 'fennel-seeds', label: 'Fennel Seeds' },
    { value: 'dried-red-chillies', label: 'Dried Red Chillies' },
    { value: 'bay-leaves', label: 'Bay Leaves (Thyme)' },
    { value: 'saffron', label: 'Saffron' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products: data } = await adminApi.getProducts();
      setProducts(data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedName = spiceOptions.find((item) => item.value === formData.name)?.label || formData.name;
      const payload = new FormData();
      payload.append('name', selectedName);
      payload.append('slug', formData.name);
      payload.append('shortDescription', formData.description.slice(0, 90) || `${selectedName} premium spice`);
      payload.append('description', formData.description || `${selectedName} premium spice`);
      payload.append('origin', formData.origin);
      payload.append('packaging', formData.stock ? `Available stock: ${formData.stock} kg` : 'Customized packaging available');
      payload.append('price', String(Number(formData.price)));
      payload.append('forms', 'Whole');
      payload.append('features', 'Premium Quality,Export Grade');
      formData.images.forEach((file) => payload.append('images', file));

      await adminApi.createProduct(payload);
      setMessage('Product added successfully.');
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        origin: '',
        images: []
      });
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.slug || '',
      description: product.description || product.shortDescription || '',
      price: product.price ?? '',
      stock: '',
      origin: product.origin || '',
      images: []
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct?._id) return;
    try {
      const selectedName = spiceOptions.find((item) => item.value === formData.name)?.label || formData.name;
      const payload = new FormData();
      payload.append('name', selectedName);
      payload.append('slug', formData.name);
      payload.append('shortDescription', formData.description.slice(0, 90) || `${selectedName} premium spice`);
      payload.append('description', formData.description || `${selectedName} premium spice`);
      payload.append('origin', formData.origin);
      payload.append(
        'packaging',
        formData.stock ? `Available stock: ${formData.stock} kg` : editingProduct.packaging || 'Customized packaging available'
      );
      payload.append('price', String(Number(formData.price)));
      payload.append('forms', (editingProduct.forms || ['Whole']).join(','));
      payload.append('features', (editingProduct.features || ['Premium Quality', 'Export Grade']).join(','));
      formData.images.forEach((file) => payload.append('images', file));

      await adminApi.updateProduct(editingProduct._id, payload);
      setMessage('Product updated successfully.');
      setIsEditOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        origin: '',
        images: []
      });
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct?._id) return;
    try {
      await adminApi.deleteProduct(deletingProduct._id);
      setMessage('Product deleted.');
      setIsDeleteOpen(false);
      setDeletingProduct(null);
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>
      {message && <p className="mb-4 text-sm text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">{message}</p>}
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={
                        product.images?.[0] ||
                        'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=200'
                      }
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=200';
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.packaging || '-'}</td>
                  <td className="py-3 px-4">INR {product.price}/kg</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => openEdit(product)}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => openDelete(product)}
                        title="Delete"
                      >
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

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        <form onSubmit={handleUpdate}>
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

          {editingProduct?.images?.length ? (
            <div className="mb-4">
              <p className="block text-sm font-medium text-gray-700 mb-2">Current images</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingProduct.images.slice(0, 4).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Uploading new images will replace the current images.
              </p>
            </div>
          ) : null}

          <ImageUpload maxImages={4} onChange={handleImagesChange} />

          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" icon={Edit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProduct(null);
        }}
        title="Delete product?"
        size="sm"
      >
        <p className="text-gray-700">
          Are you sure you want to delete <span className="font-semibold">{deletingProduct?.name}</span>? This
          cannot be undone.
        </p>
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setIsDeleteOpen(false);
              setDeletingProduct(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} icon={Trash2}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
