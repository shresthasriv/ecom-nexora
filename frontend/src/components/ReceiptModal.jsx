import { useNavigate } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptModal = ({ receipt, onClose }) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you for your order!</h3>
              <p className="text-gray-600 dark:text-gray-400">Your order has been placed successfully</p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receipt.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Customer</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receipt.customer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Email</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receipt.customer.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Date</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(receipt.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h4>
              <div className="space-y-3">
                {receipt.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleContinueShopping}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReceiptModal;
