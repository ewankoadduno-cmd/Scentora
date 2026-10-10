import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import CustomerLayout from "./components/CustomerLayout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/user/Home"
import ProductListing from "./pages/user/ProductListing"
import ProductDetail from "./pages/user/ProductDetail"
import Cart from "./pages/user/Cart"
import Checkout from "./pages/user/Checkout"
import OrderConfirmation from "./pages/user/OrderConfirmation"
import MyAccount from "./pages/user/MyAccount"
import MyOrders from "./pages/user/MyOrders"
import OrderDetails from "./pages/user/OrderDetails"
import AboutUs from "./pages/statics/AboutUs"
import ContactUs from "./pages/statics/ContactUs"
import ShippingReturn from "./pages/statics/ShippingReturn"
import FAQ from "./pages/statics/FAQ"
import Dashboard from "./pages/admin/Dashboard"
import ProductManagement from "./pages/admin/ProductManagement"
import Inventory from "./pages/admin/Inventory"
import OrdersManagement from "./pages/admin/OrdersManagement"
import AdminOrderDetail from "./pages/admin/OrderDetail"
import Customers from "./pages/admin/Customers"
import ProtectedRoute from "./pages/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-return" element={<ShippingReturn />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><ProductManagement /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute requiredRole="admin"><Inventory /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><OrdersManagement /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId" element={<ProtectedRoute requiredRole="admin"><AdminOrderDetail /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><Customers /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
