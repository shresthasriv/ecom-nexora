import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { addToCartValidation, idParamValidation } from '../middleware/validator.js';
import Cart from '../models/Cart.js';
import { fetchProductById } from '../utils/fakeStoreApi.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const userId = req.query.userId || 'guest';
  const cart = await Cart.findOrCreateCart(userId);

  res.json({
    success: true,
    data: {
      cartId: cart._id,
      items: cart.items,
      total: cart.calculateTotal(),
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
}));

router.post('/', addToCartValidation, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.body.userId || 'guest';

  const product = await fetchProductById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const cart = await Cart.findOrCreateCart(userId);

  const existingItemIndex = cart.items.findIndex(
    item => item.productId === productId
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    data: {
      cartId: cart._id,
      items: cart.items,
      total: cart.calculateTotal(),
    },
  });
}));

router.delete('/:id', idParamValidation, asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const userId = req.query.userId || 'guest';

  const cart = await Cart.findOrCreateCart(userId);

  const itemExists = cart.items.id(itemId);

  if (!itemExists) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  cart.items.pull(itemId);
  await cart.save();

  res.json({
    success: true,
    message: 'Item removed from cart',
    data: {
      cartId: cart._id,
      items: cart.items,
      total: cart.calculateTotal(),
    },
  });
}));

export default router;
