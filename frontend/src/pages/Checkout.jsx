import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutApi } from '../services/api';
import ReceiptModal from '../components/ReceiptModal';
import { BlurFade } from '../components/BlurFade';

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart.items.length === 0 && !receipt) {
      navigate('/cart');
    }
  }, [cart.items.length, navigate, receipt]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await checkoutApi.process(formData.name, formData.email);
      setReceipt(response.data);
      clearCart();
    } catch (error) {
      alert(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    navigate('/');
  };

  if (cart.items.length === 0 && !receipt) {
    return null;
  }

  return (
    <div className="w-full">
      <BlurFade delay={0.1}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
      </BlurFade>

      <div className="grid lg:grid-cols-3 gap-8">
        <BlurFade delay={0.2} className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-gray-600 dark:text-gray-400 flex-1">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </BlurFade>
      </div>

      {receipt && <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />}
    </div>
  );
};

export default Checkout;
