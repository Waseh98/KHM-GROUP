import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { syncProductsFromBackend, syncCategoriesFromBackend } from './data';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Men = lazy(() => import('./pages/Men'));
const Women = lazy(() => import('./pages/Women'));
const Kids = lazy(() => import('./pages/Kids'));
const Product = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));
const Sale = lazy(() => import('./pages/Sale'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQs = lazy(() => import('./pages/FAQs'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./admin/AdminOrders'));
const AdminProducts = lazy(() => import('./admin/AdminProducts'));
const AdminCategories = lazy(() => import('./admin/AdminCategories'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));
const AdminProtectedRoute = lazy(() => import('./admin/AdminProtectedRoute'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #eee', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <span style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <CartDrawer />
          <WishlistDrawer />
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

  useEffect(() => {
    if (!isAdmin) {
      syncProductsFromBackend();
      syncCategoriesFromBackend();
    }
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && (
        <>
          <PromoBar />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="/men" element={<Suspense fallback={<PageLoader />}><Men /></Suspense>} />
        <Route path="/women" element={<Suspense fallback={<PageLoader />}><Women /></Suspense>} />
        <Route path="/kids" element={<Suspense fallback={<PageLoader />}><Kids /></Suspense>} />
        <Route path="/product/:id" element={<Suspense fallback={<PageLoader />}><Product /></Suspense>} />
        <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><Checkout /></Suspense>} />
        <Route path="/order-success" element={<Suspense fallback={<PageLoader />}><OrderSuccess /></Suspense>} />
        <Route path="/track-order" element={<Suspense fallback={<PageLoader />}><TrackOrder /></Suspense>} />
        <Route path="/collections" element={<Suspense fallback={<PageLoader />}><Collections /></Suspense>} />
        <Route path="/collections/:slug" element={<Suspense fallback={<PageLoader />}><CollectionDetail /></Suspense>} />
        <Route path="/sale" element={<Suspense fallback={<PageLoader />}><Sale /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactUs /></Suspense>} />
        <Route path="/faqs" element={<Suspense fallback={<PageLoader />}><FAQs /></Suspense>} />
        <Route path="/return-policy" element={<Suspense fallback={<PageLoader />}><ReturnPolicy /></Suspense>} />
        <Route path="/returns" element={<Navigate to="/return-policy" replace />} />
        <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutUs /></Suspense>} />

        <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
        <Route element={<Suspense fallback={<PageLoader />}><AdminProtectedRoute /></Suspense>}>
          <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
            <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
            <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategories /></Suspense>} />
            <Route path="messages" element={<Suspense fallback={<PageLoader />}><AdminMessages /></Suspense>} />
          </Route>
        </Route>
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}
