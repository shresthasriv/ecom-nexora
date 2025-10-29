import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { BlurFade } from '../components/BlurFade';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchCart]);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll(10);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCartItem = (productId) => {
    return cart.items.find(item => item.productId === productId);
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleIncrement = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleDecrement = async (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      if (cartItem.quantity === 1) {
        await removeFromCart(cartItem._id);
      } else {
        await addToCart(productId, -1);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gray-900 dark:border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-4">Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BlurFade delay={0.1}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Products</h1>
      </BlurFade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <BlurFade key={product.id} delay={index * 0.05} inView>
            <div className="group bg-white dark:bg-neutral-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-square bg-white dark:bg-neutral-900 p-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4">
                {getCartItem(product.id) ? (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(product.id);
                      }}
                      className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-all"
                    >
                      <Minus className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {getCartItem(product.id).quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(product.id);
                      }}
                      className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-all"
                    >
                      <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105 font-semibold"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default Products;
