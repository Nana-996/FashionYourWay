import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Sparkles, ShieldCheck, Truck, Menu, X, Heart } from 'lucide-react';

export const Navbar = () => {
  const {
    storeInfo,
    cartCount,
    setIsCartOpen,
    currentView,
    setCurrentView,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    wishlist
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (isAdminAuthenticated) {
      setCurrentView(currentView === 'admin' ? 'storefront' : 'admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleNavClick = (view, sectionId = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (sectionId && view === 'storefront') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notice Bar */}
      {storeInfo.noticeBanner && (
        <div className="announcement-bar">
          <div className="announcement-text">
            <span>{storeInfo.noticeBanner}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <div className="brand-logo" onClick={() => handleNavClick('storefront')}>
            <span className="brand-name">{storeInfo.storeName || 'FashionYourWay'}</span>
            <span className="brand-sub">HAUTE COUTURE & READY-TO-WEAR</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <button
              className={`nav-link-btn ${currentView === 'storefront' ? 'active' : ''}`}
              onClick={() => handleNavClick('storefront')}
            >
              Collection
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick('storefront', 'catalog-section')}
            >
              Shop All
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick('storefront', 'statement-section')}
            >
              Our Philosophy
            </button>
            <button
              className={`nav-link-btn ${currentView === 'track' ? 'active' : ''}`}
              onClick={() => handleNavClick('track')}
            >
              Track Order
            </button>
            <button
              className="nav-link-btn"
              onClick={() => handleNavClick('storefront', 'contact-section')}
            >
              Concierge
            </button>
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            {/* Track My Order quick button */}
            <button
              className="nav-action-btn"
              title="Track Order Status"
              onClick={() => handleNavClick('track')}
              style={{ display: currentView === 'track' ? 'none' : 'flex' }}
            >
              <Truck size={19} />
            </button>

            {/* Shopping Bag Button */}
            <button
              className="nav-action-btn"
              onClick={() => setIsCartOpen(true)}
              title="View Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: 'rgba(26, 4, 15, 0.98)',
              borderBottom: '1px solid rgba(232, 165, 152, 0.25)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <button
              className="nav-link-btn"
              style={{ textAlign: 'left', fontSize: '1.05rem' }}
              onClick={() => handleNavClick('storefront')}
            >
              Home & Collection
            </button>
            <button
              className="nav-link-btn"
              style={{ textAlign: 'left', fontSize: '1.05rem' }}
              onClick={() => handleNavClick('storefront', 'catalog-section')}
            >
              Shop All Products
            </button>
            <button
              className="nav-link-btn"
              style={{ textAlign: 'left', fontSize: '1.05rem' }}
              onClick={() => handleNavClick('track')}
            >
              Track Your Order
            </button>
            <button
              className="nav-link-btn"
              style={{ textAlign: 'left', fontSize: '1.05rem' }}
              onClick={() => handleNavClick('storefront', 'contact-section')}
            >
              Showroom & Concierge
            </button>
          </div>
        )}
      </header>
    </>
  );
};
