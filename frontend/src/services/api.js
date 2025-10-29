const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'Something went wrong',
      response.status,
      errorData
    );
  }
  return response.json();
};

const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

export const productsApi = {
  getAll: (limit = 10) => apiClient.get(`/products?limit=${limit}`),
};

export const cartApi = {
  get: (userId = 'guest') => apiClient.get(`/cart?userId=${userId}`),

  addItem: (productId, quantity, userId = 'guest') =>
    apiClient.post('/cart', { productId, quantity, userId }),

  removeItem: (itemId, userId = 'guest') =>
    apiClient.delete(`/cart/${itemId}?userId=${userId}`),
};

export const checkoutApi = {
  process: (name, email, userId = 'guest') =>
    apiClient.post('/checkout', { name, email, userId }),
};

export { ApiError };
