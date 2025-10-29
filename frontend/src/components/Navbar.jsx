import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { AnimatedThemeToggler } from './AnimatedThemeToggler';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { cart } = useCart();
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const initialLoadRef = useRef(true);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    if (latest > 50) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-50 w-full">
      <motion.nav
        animate={{
          width: visible ? '60%' : '100%',
          y: visible ? 12 : 0,
          borderRadius: visible ? '9999px' : '0px',
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 30,
        }}
        className={cn(
          'mx-auto backdrop-blur-md border-b transition-colors duration-200 bg-gray-900 dark:bg-white border-gray-800 dark:border-gray-200',
          visible ? 'shadow-lg' : ''
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-white dark:text-gray-900 font-bold text-xl"
            >
              Nexora
            </Link>

            <div className="flex items-center gap-4">
              <AnimatedThemeToggler className="p-2 rounded-full text-white dark:text-gray-900 hover:bg-white/20 dark:hover:bg-black/10 transition-colors" />

              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
