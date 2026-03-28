const DEFAULT_API_BASE_URL = 'https://delvonza-exim-backend.onrender.com/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: isFormData
      ? { ...(options.headers || {}) }
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
};

export const adminApi = {
  getProducts: () => request('/products'),
  reorderProducts: (orderedIds) =>
    request('/products/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds })
    }),
  createProduct: (body) => request('/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getInquiries: () => request('/inquiries/admin/all'),
  updateInquiryStatus: (id, status) =>
    request(`/inquiries/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  getOrders: () => request('/orders/admin/all'),
  deleteOrder: (orderId) => request(`/orders/admin/${orderId}`, { method: 'DELETE' }),
  updateOrderStatus: (orderId, status) =>
    request(`/orders/admin/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
};
