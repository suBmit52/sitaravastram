import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CategoryStrip from './components/layout/CategoryStrip';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import BottomNav from './components/layout/BottomNav';
import FloatingActions from './components/ui/FloatingActions';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

// Total fixed header height:
//   Announcement bar: 32px
//   Navbar:           72px (desktop) / 64px (mobile)
//   Category strip:   44px
// Mobile total: 140px   Desktop total: 148px
const HEADER_OFFSET = 'pt-[140px] lg:pt-[148px]';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <CategoryStrip />

      {/* All page content sits below the fixed header */}
      <div className={HEADER_OFFSET}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/:tab" element={<AccountPage />} />
          <Route path="/shop" element={<CollectionPage />} />
          <Route path="/occasions" element={<CollectionPage />} />
          <Route path="/sale" element={<CollectionPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>

      <CartDrawer />
      <BottomNav />
      <FloatingActions />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
