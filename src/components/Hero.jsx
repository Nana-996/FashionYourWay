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
            <Sparkles size={15} color="#E8A598" />
            <span>Autumn / Winter Luxury Edit</span>
          </div>

          <h1 className="hero-title">
            Make Them Look <span className="hero-title-highlight">Twice.</span>
          </h1>

          {/* User's Exact Brand Description highlighted */}
          <div className="hero-statement-box">
            <p className="hero-statement-text">
              "{storeInfo.brandDescription || "FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way."}"
            </p>
          </div>

          <div className="hero-cta-group">
            <button className="btn btn-primary" onClick={scrollToCatalog}>
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => featuredProduct && setSelectedProductDetail(featuredProduct)}
            >
              <span>Featured Runway Piece</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <h4>100%</h4>
              <p>Handcrafted Velvet & Silk</p>
            </div>
            <div className="hero-stat-item">
              <h4>4.9 ★</h4>
              <p>VIP Client Rating</p>
            </div>
            <div className="hero-stat-item">
              <h4>Ghana</h4>
              <p>Nationwide VIP Delivery</p>
            </div>
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
              <Star size={14} fill="#D4AF37" color="#D4AF37" />
              <span>Couture Spotlight</span>
            </div>

            <div className="hero-card-overlay">
              <span className="badge badge-burgundy" style={{ width: 'fit-content' }}>
                Runway Collection 2026
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>
                Aurelia Velvet Gala Maxi Gown
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#F7D6DC' }}>
                Sculpted stretch mulberry velvet with boned corset bodice &middot; {formatCurrency(1850)}
              </p>
            </div>
          </div>

          {/* Floating Luxury Pill */}
          <div className="hero-floating-pill">
            <div className="hero-floating-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                Custom Tailoring Service
              </div>
              <div style={{ fontSize: '0.78rem', color: '#E8A598' }}>
                Made to fit your unique silhouette & style
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
