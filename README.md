# Nexora

A modern, full-stack e-commerce application built with React and Node.js featuring a shopping cart, product catalog, and checkout system with smooth animations and dark mode support.

## Features

- Product browsing with detailed product views
- Shopping cart management with real-time updates
- Checkout process with form validation
- Dark/Light theme with animated transitions
- Responsive design with Tailwind CSS
- Smooth animations using Framer Motion
- MongoDB-backed cart persistence
- RESTful API integration with Fake Store API

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon system

### Backend
- **Node.js** - Runtime environment
- **Express.js v5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express Validator** - Request validation
- **Axios** - HTTP client for external API

## Project Structure

```
Nexora/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── AnimatedThemeToggler.jsx
│   │   │   ├── BlurFade.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ReceiptModal.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── Products.jsx
│   │   ├── context/       # React Context for state management
│   │   │   └── CartContext.jsx
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.jsx        # Main application component
│   └── package.json
│
└── backend/               # Node.js backend API
    ├── config/            # Configuration files
    ├── models/            # Mongoose models
    │   └── Cart.js
    ├── routes/            # Express routes
    │   ├── cart.js
    │   ├── checkout.js
    │   └── products.js
    ├── middleware/        # Custom middleware
    ├── utils/             # Utility functions
    └── server.js          # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/nexora
PORT=5000
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the backend API URL:
```bash
echo "VITE_API_URL=http://localhost:5000" > .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Products

**Get all products**
```http
GET /api/products
```

**Get product by ID**
```http
GET /api/products/:id
```

#### Cart

**Get cart**
```http
GET /api/cart?userId=guest
```

**Add item to cart**
```http
POST /api/cart
Content-Type: application/json

{
  "productId": 1,
  "quantity": 1,
  "userId": "guest"
}
```

**Remove item from cart**
```http
DELETE /api/cart/:itemId?userId=guest
```

#### Checkout

**Process checkout**
```http
POST /api/checkout
Content-Type: application/json

{
  "userId": "guest",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

## Key Implementation Details

### Cart Context

The cart state is managed using React Context for global state management:

```jsx
// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await cartApi.addItem(productId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, ... }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Cart Model

MongoDB schema with methods for cart operations:

```javascript
// backend/models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

cartSchema.statics.findOrCreateCart = async function(userId) {
  let cart = await this.findOne({ userId });
  if (!cart) {
    cart = await this.create({ userId, items: [] });
  }
  return cart;
};
```

### Routing Configuration

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-black">
          <Navbar />
          <main className="pt-16 w-full">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
```

### API Route Handler

```javascript
// backend/routes/cart.js
import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import Cart from '../models/Cart.js';
import { fetchProductById } from '../utils/fakeStoreApi.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
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
    data: {
      items: cart.items,
      total: cart.calculateTotal(),
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
}));
```

### Express Server Setup

```javascript
// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDatabase();

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Features in Detail

### Dark Mode
The application features a custom animated theme toggler that persists user preference using localStorage and provides smooth transitions between themes.

### Cart Management
- Add items to cart with quantity selection
- Update item quantities
- Remove items from cart
- Real-time total calculation
- Persistent cart state in MongoDB

### Checkout Flow
- Form validation for customer information
- Order summary with itemized pricing
- Receipt modal on successful checkout
- Error handling for failed transactions

### Animations
- BlurFade component for staggered content animations
- Smooth page transitions using Framer Motion
- Animated navbar with scroll-based visibility
- Theme toggle with rotation animations

## Development Notes

### Database
The application uses MongoDB to persist cart data. Each user (identified by userId) has their own cart document that stores items, quantities, and product details.

### External API
Product data is fetched from the Fake Store API (https://fakestoreapi.com) which provides mock e-commerce data for development purposes.

### Validation
Request validation is implemented using express-validator middleware to ensure data integrity and security.

