import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(err => err.msg).join(', '));
  }
  next();
};

export const addToCartValidation = [
  body('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  validate,
];

export const updateCartValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate,
];

export const checkoutValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
];

export const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid cart item ID'),
  validate,
];
