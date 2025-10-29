import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fetchProducts } from '../utils/fakeStoreApi.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const products = await fetchProducts(limit);

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
}));

export default router;
