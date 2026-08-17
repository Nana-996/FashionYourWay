import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandStatement } from './components/BrandStatement';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

const MainAppContent = () => {
  const { currentView, isAdminAuthenticated, setIsAdminLoginModalOpen } = useStore();

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <Navbar />

      {/* Main View Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'storefront' && (
          <>
            <Hero />
            <BrandStatement />
            <ProductCatalog />
          </>
        )}

        {currentView === 'track' && <OrderTrackingView />}

        {currentView === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard />
          ) : (
            <>
              <Hero />
              <BrandStatement />
              <ProductCatalog />
            </>
          )
        )}
      </main>

      {/* Luxury Footer with Live Admin Business Info */}
      <Footer />

      {/* Global Drawers, Modals & Alerts */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AdminLoginModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
