import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Nexora</Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Products</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">
            Cart {cart.itemCount > 0 && <span className="badge">{cart.itemCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
