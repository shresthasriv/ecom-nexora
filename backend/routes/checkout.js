import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { checkoutValidation } from '../middleware/validator.js';
import Cart from '../models/Cart.js';

const router = express.Router();

router.post('/', checkoutValidation, asyncHandler(async (req, res) => {
  const { name, email, userId = 'guest' } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const total = cart.calculateTotal();
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const receipt = {
    orderNumber,
    customer: {
      name,
      email,
    },
    items: cart.items.map(item => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    })),
    total: parseFloat(total.toFixed(2)),
    timestamp: new Date().toISOString(),
  };

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Order placed successfully',
    data: receipt,
  });
}));

export default router;
