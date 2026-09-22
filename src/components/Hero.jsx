import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { WhatsAppIcon, getProductWhatsAppUrl } from '../utils/whatsapp';

export const Hero = () => {
  const { storeInfo, setSelectedProductDetail, products, formatCurrency } = useStore();

  const featuredProduct = products.find(p => p.isFeatured) || products[0];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const heroImage = (featuredProduct?.images && featuredProduct.images[0]) ||
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80';

  return (
    <section className="hero-section">
      <div className="hero-bg-glow"></div>
      <div className="container hero-grid">
        {/* Left Column: Hero Editorial Copy */}
        <div className="hero-content">
          {storeInfo.heroPill && (
            <div className="hero-tagline-pill">
              <Sparkles size={14} color="#E8A598" />
              <span>{storeInfo.heroPill}</span>
            </div>
          )}

          <h1 className="hero-title">
            {storeInfo.heroTitle || 'Make Them Look'}{' '}
            <span className="hero-title-highlight">
              {storeInfo.heroTitleHighlight || 'Twice.'}
            </span>
          </h1>

          <p className="hero-subtitle">
            {storeInfo.heroSubtitle ||
              'Fashion designed to match your mood, your confidence, and your individuality. No rules. No limits.'}
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary" onClick={scrollToCatalog}>
              <span>{storeInfo.heroPrimaryCta || 'Shop Collection'}</span>
              <ArrowRight size={17} />
            </button>
            {featuredProduct && (
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedProductDetail(featuredProduct)}
              >
                <span>{storeInfo.heroSecondaryCta || 'Featured Design'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: High Fashion Visual Showcase */}
        <div className="hero-visual-container">
          {featuredProduct ? (
            <div
              className="hero-main-card"
              onClick={() => setSelectedProductDetail(featuredProduct)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={heroImage}
                alt={featuredProduct.name}
                className="hero-main-img"
              />

              <div className="hero-floating-badge">
                <Star size={13} fill="#D4AF37" color="#D4AF37" />
                <span>{featuredProduct.tag || 'Runway Edit'}</span>
              </div>

              <div className="hero-card-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-burgundy" style={{ width: 'fit-content' }}>
                    {featuredProduct.category || 'Featured'}
                  </span>
                  <a
                    href={getProductWhatsAppUrl(featuredProduct, { formattedPrice: formatCurrency(featuredProduct.price) })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(37, 211, 102, 0.4)'
                    }}
                    title="Reach Admin & Pay via WhatsApp (+233 59 656 8466)"
                  >
                    <WhatsAppIcon size={13} color="#FFFFFF" />
                    <span>WhatsApp / Pay</span>
                  </a>
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF' }}>
                  {featuredProduct.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#E8A598', fontWeight: 600 }}>
                  {formatCurrency(featuredProduct.price)}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="hero-main-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '380px',
                textAlign: 'center',
                padding: '30px',
                background: 'rgba(20, 3, 11, 0.7)'
              }}
            >
              <div>
                <Sparkles size={40} color="#E8A598" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '1.3rem' }}>
                  {storeInfo.heroEmptyTitle || `Welcome to ${storeInfo.storeName || 'FashionYourWay'}`}
                </h3>
                <p style={{ color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.92rem', maxWidth: '280px', margin: '0 auto' }}>
                  {storeInfo.heroEmptyDesc || 'Explore our bespoke handcrafted collections below or contact concierge.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
