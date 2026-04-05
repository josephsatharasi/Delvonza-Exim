import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import ImageUpload from '../components/common/ImageUpload';
import { Plus, Edit, Trash2, GripVertical, FileDown } from 'lucide-react';
import { adminApi } from '../api/client';
import { downloadProductsPdf } from '../utils/pdfExport';

const joinFeaturesForPayload = (text) =>
  String(text || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',');

const formatFeaturesForInput = (features) =>
  Array.isArray(features) && features.length ? features.join('\n') : '';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [hidePriceUpdatingId, setHidePriceUpdatingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    origin: '',
    images: [],
    hidePrice: false,
    features: ''
  });
  
  // All spices list
  const spiceOptions = [
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
    { value: 'onion', label: 'Onion' }
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
      const desc = (formData.description || '').trim() || `${selectedName} premium spice`;
      const payload = new FormData();
      payload.append('name', selectedName);
      payload.append('slug', formData.name);
      payload.append('shortDescription', desc);
      payload.append('description', desc);
      payload.append('origin', formData.origin);
      payload.append('packaging', formData.stock ? `Available stock: ${formData.stock} kg` : 'Customized packaging available');
      payload.append('price', String(Number(formData.price)));
      payload.append('hidePrice', formData.hidePrice ? 'true' : 'false');
      payload.append('forms', 'Whole');
      payload.append('features', joinFeaturesForPayload(formData.features));
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
        images: [],
        hidePrice: false,
        features: ''
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
      images: [],
      hidePrice: Boolean(product.hidePrice),
      features: formatFeaturesForInput(product.features)
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct?._id) return;
    try {
      const selectedName = spiceOptions.find((item) => item.value === formData.name)?.label || formData.name;
      const desc = (formData.description || '').trim() || `${selectedName} premium spice`;
      const payload = new FormData();
      payload.append('name', selectedName);
      payload.append('slug', formData.name);
      payload.append('shortDescription', desc);
      payload.append('description', desc);
      payload.append('origin', formData.origin);
      payload.append(
        'packaging',
        formData.stock ? `Available stock: ${formData.stock} kg` : editingProduct.packaging || 'Customized packaging available'
      );
      payload.append('price', String(Number(formData.price)));
      payload.append('hidePrice', formData.hidePrice ? 'true' : 'false');
      payload.append('forms', (editingProduct.forms || ['Whole']).join(','));
      payload.append('features', joinFeaturesForPayload(formData.features));
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
        images: [],
        hidePrice: false,
        features: ''
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

  const persistProductOrder = async (orderedList) => {
    try {
      const { products: next } = await adminApi.reorderProducts(orderedList.map((p) => p._id));
      setProducts(next || orderedList);
      setMessage('Storefront order saved.');
    } catch (error) {
      setMessage(error.message);
      await loadProducts();
    }
  };

  const handleDropOnRow = (event, dropIndex) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from) || from === dropIndex) return;
    const next = [...products];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setProducts(next);
    persistProductOrder(next);
  };

  const handleDownloadProductsPdf = () => {
    if (!products.length) {
      setMessage('No products to export.');
      return;
    }
    try {
      downloadProductsPdf(products);
      setMessage('Products PDF downloaded.');
    } catch (e) {
      setMessage(e?.message || 'Could not generate PDF.');
    }
  };

  const handleToggleHidePrice = async (product, nextHidden) => {
    if (!product?._id) return;
    setHidePriceUpdatingId(product._id);
    setMessage('');
    try {
      const { product: updated } = await adminApi.patchProductHidePrice(product._id, nextHidden);
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, hidePrice: updated?.hidePrice ?? nextHidden } : p))
      );
      setMessage(
        nextHidden
          ? 'Price is hidden on the public website (cart still uses stored price).'
          : 'Price is shown on the public website.'
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setHidePriceUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" icon={FileDown} onClick={handleDownloadProductsPdf} disabled={loading || !products.length}>
            All products [PDF]
          </Button>
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Product
          </Button>
        </div>
      </div>
      {message && <p className="mb-4 text-sm text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">{message}</p>}
      <p className="text-sm text-gray-600 mb-3">
        Drag rows by the handle to set the order products appear on the public website.
      </p>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="w-10 py-3 px-2" aria-label="Reorder" />
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 max-w-xs">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-48">
                  <span className="block">Hide price</span>
                  <span className="block text-xs font-normal text-gray-500">on website</span>
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 px-4 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.map((product, index) => (
                <tr
                  key={product._id}
                  draggable
                  onDragStart={(e) => {
                    if (e.target.closest?.('[data-no-row-drag]')) {
                      e.preventDefault();
                      return;
                    }
                    e.dataTransfer.setData('text/plain', String(index));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnRow(e, index)}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-2 text-gray-400 cursor-grab active:cursor-grabbing align-middle">
                    <GripVertical size={20} className="mx-auto" aria-hidden />
                  </td>
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
                  <td className="py-3 px-4 max-w-xs">
                    <p
                      className="text-sm text-gray-600 line-clamp-2"
                      title={product.description || product.shortDescription || ''}
                    >
                      {product.description || product.shortDescription || '—'}
                    </p>
                  </td>
                  <td className="py-3 px-4">{product.packaging || '-'}</td>
                  <td className="py-3 px-4">
                    <span translate="no">INR {product.price}/kg</span>
                  </td>
                  <td
                    className="py-3 px-4 text-center align-middle"
                    data-no-row-drag
                  >
                    <label className="inline-flex items-center justify-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={Boolean(product.hidePrice)}
                        disabled={hidePriceUpdatingId === product._id}
                        onChange={(e) => handleToggleHidePrice(product, e.target.checked)}
                        title={`${product.hidePrice ? 'Price hidden' : 'Price visible'} on storefront — click to toggle`}
                        aria-label={product.hidePrice ? 'Show price on website' : 'Hide price on website'}
                      />
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {product.hidePrice ? 'Hidden' : 'Visible'}
                      </span>
                    </label>
                  </td>
                  <td className="py-3 px-4" data-no-row-drag>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => openEdit(product)}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
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

          <label className="flex items-start gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              name="hidePrice"
              checked={formData.hidePrice}
              onChange={(e) => setFormData((prev) => ({ ...prev, hidePrice: e.target.checked }))}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-gray-900">Hide price on website</span>
              <span className="block text-gray-500 mt-0.5">
                Storefront hides the product price only; cart and orders still use the price you enter above.
              </span>
            </span>
          </label>
          
          <Textarea
            label="Description"
            name="description"
            placeholder="Enter product description..."
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
          />

          <Textarea
            label="Key features"
            name="features"
            placeholder="One point per line (e.g. Export grade, Natural aroma, ISO-focused processes)"
            value={formData.features}
            onChange={handleInputChange}
            rows={5}
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

          <label className="flex items-start gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              name="hidePrice"
              checked={formData.hidePrice}
              onChange={(e) => setFormData((prev) => ({ ...prev, hidePrice: e.target.checked }))}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-gray-900">Hide price on website</span>
              <span className="block text-gray-500 mt-0.5">
                Storefront hides the product price only; cart and orders still use the price above.
              </span>
            </span>
          </label>

          <Textarea
            label="Description"
            name="description"
            placeholder="Enter product description..."
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
          />

          <Textarea
            label="Key features"
            name="features"
            placeholder="One point per line"
            value={formData.features}
            onChange={handleInputChange}
            rows={5}
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
