import axios from 'axios';

const BASE_URL = process.env.FAKE_STORE_API_URL || 'https://fakestoreapi.com';

const fakeStoreClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProducts = async (limit = 10) => {
  const { data } = await fakeStoreClient.get(`/products?limit=${limit}`);
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await fakeStoreClient.get(`/products/${id}`);
  return data;
};

export default fakeStoreClient;
