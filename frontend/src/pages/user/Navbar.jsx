import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/orders">My Orders</Link>
      <Link to="/account">My Account</Link>
    </nav>
  )
}
