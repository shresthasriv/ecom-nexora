import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BlurFade } from '../components/BlurFade';

const Cart = () => {
  const { cart, loading, fetchCart, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      alert('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (item, change) => {
    setUpdating(item._id);

    if (item.quantity === 1 && change === -1) {
      await removeFromCart(item._id);
    } else {
      const result = await addToCart(item.productId, change);
      if (!result.success) {
        alert('Failed to update quantity');
      }
    }

    setUpdating(null);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gray-900 dark:border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BlurFade delay={0.1}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
      </BlurFade>

      {cart.items.length === 0 ? (
        <BlurFade delay={0.2}>
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </BlurFade>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <BlurFade key={item._id} delay={index * 0.05} inView>
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item, -1)}
                            disabled={updating === item._id}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item, 1)}
                            disabled={updating === item._id}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemove(item._id)}
                            disabled={loading}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          <div className="lg:col-span-1">
            <BlurFade delay={0.3} inView>
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Items ({cart.itemCount})</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105 font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </BlurFade>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
