import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Star, ShieldCheck, Heart } from 'lucide-react';

export const Hero = () => {
  const { storeInfo, setSelectedProductDetail, products, formatCurrency } = useStore();

  const featuredProduct = products.find(p => p.id === 'FYW-PROD-001') || products[0];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-bg-glow"></div>
      <div className="container hero-grid">
        {/* Left Column: Hero Editorial Copy */}
        <div className="hero-content">
          <div className="hero-tagline-pill">
            <Sparkles size={14} color="#E8A598" />
            <span>Autumn / Winter Edit</span>
          </div>

          <h1 className="hero-title">
            Make Them Look <span className="hero-title-highlight">Twice.</span>
          </h1>

          <p className="hero-subtitle">
            Fashion designed to match your mood, your confidence, and your individuality. No rules. No limits.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary" onClick={scrollToCatalog}>
              <span>Shop Collection</span>
              <ArrowRight size={17} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => featuredProduct && setSelectedProductDetail(featuredProduct)}
            >
              <span>Featured Design</span>
            </button>
          </div>
        </div>

        {/* Right Column: High Fashion Visual Showcase */}
        <div className="hero-visual-container">
          <div
            className="hero-main-card"
            onClick={() => featuredProduct && setSelectedProductDetail(featuredProduct)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
              alt="Aurelia Velvet Gala Maxi Gown"
              className="hero-main-img"
            />

            <div className="hero-floating-badge">
              <Star size={13} fill="#D4AF37" color="#D4AF37" />
              <span>Runway Edit</span>
            </div>

            <div className="hero-card-overlay">
              <span className="badge badge-burgundy" style={{ width: 'fit-content' }}>
                Bestseller
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF' }}>
                Aurelia Velvet Gala Gown
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#E8A598', fontWeight: 600 }}>
                {formatCurrency(1850)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
