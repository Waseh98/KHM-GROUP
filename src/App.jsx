import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Pages
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Sale from './pages/Sale';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import ReturnPolicy from './pages/ReturnPolicy';
import AboutUs from './pages/AboutUs';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminMessages from './admin/AdminMessages';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <CartDrawer />
          <FloatingWhatsApp />
          <AppFrame />
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;

function AppFrame() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && (
        <>
          <PromoBar />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<CollectionDetail />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/returns" element={<Navigate to="/return-policy" replace />} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Route>
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}
