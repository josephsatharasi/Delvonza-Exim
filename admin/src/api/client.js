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
  createProduct: (body) => request('/products', { method: 'POST', body }),
  getOrders: () => request('/orders/admin/all'),
  updateOrderStatus: (orderId, status) =>
    request(`/orders/admin/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
};
