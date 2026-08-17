import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Zap, Heart, Star, Check, Sparkles, Ruler, Truck, ShieldCheck } from 'lucide-react';

export const ProductDetailModal = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
    wishlist,
    toggleWishlist,
    formatCurrency
  } = useStore();

  const product = selectedProductDetail;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'S'
  );
  const [selectedColor, setSelectedColor] = useState(
    product && product.colors && product.colors.length > 0 ? product.colors[0].name : 'Burgundy'
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProductDetail(null)}>
      <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProductDetail(null)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="product-detail-grid">
          {/* Left Column: Gallery */}
          <div className="detail-gallery-wrap">
            <div className="detail-main-image-box">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="detail-main-img"
              />
              {product.tag && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-burgundy">{product.tag}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="detail-thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`detail-thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={img} alt={`view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="detail-info-col">
            <div>
              <span className="detail-category-badge">
                <Sparkles size={14} />
                <span>{product.category}</span>
              </span>
              <h2 className="detail-title">{product.name}</h2>
              {product.subtitle && <p className="detail-subtitle">{product.subtitle}</p>}
            </div>

            {/* Ratings & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{product.rating || '4.9'}</span>
              <span style={{ color: 'rgba(255, 240, 243, 0.5)' }}>
                ({product.reviewsCount || 34} verified client reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="detail-price-row">
              <span className="detail-price">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="detail-orig-price">{formatCurrency(product.originalPrice)}</span>
                  <span className="detail-save-badge">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.94rem', color: 'rgba(255, 245, 247, 0.85)', lineHeight: '1.65' }}>
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="selector-label-row">
                  <span>Selected Color: <strong>{selectedColor}</strong></span>
                </div>
                <div className="color-swatches">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`color-swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c.name)}
                    >
                      <span className="color-dot" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="selector-label-row">
                  <span>Selected Size: <strong>{selectedSize}</strong></span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#E8A598',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'underline'
                    }}
                  >
                    <Ruler size={14} />
                    <span>{showSizeGuide ? 'Hide Size Chart' : 'View Size Chart'}</span>
                  </button>
                </div>

                <div className="size-grid">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Inline Size Chart Drawer */}
                {showSizeGuide && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '14px',
                      background: 'rgba(20, 3, 11, 0.75)',
                      borderRadius: '8px',
                      border: '1px solid rgba(232, 165, 152, 0.2)',
                      fontSize: '0.8rem',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#E8A598', marginBottom: '8px' }}>
                      Size Guide (Inches / CM)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
                      <div style={{ color: 'rgba(255,240,243,0.5)' }}>Size</div>
                      <div style={{ color: 'rgba(255,240,243,0.5)' }}>Bust</div>
                      <div style={{ color: 'rgba(255,240,243,0.5)' }}>Waist</div>
                      <div style={{ color: 'rgba(255,240,243,0.5)' }}>Hips</div>

                      <div>XS</div><div>32" (81cm)</div><div>24" (61cm)</div><div>35" (89cm)</div>
                      <div>S</div><div>34" (86cm)</div><div>26" (66cm)</div><div>37" (94cm)</div>
                      <div>M</div><div>36" (91cm)</div><div>28" (71cm)</div><div>39" (99cm)</div>
                      <div>L</div><div>39" (99cm)</div><div>31" (79cm)</div><div>42" (107cm)</div>
                      <div>XL</div><div>42" (107cm)</div><div>34" (86cm)</div><div>45" (114cm)</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div>
              <div className="detail-actions-row">
                <div className="qty-stepper">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag &middot; {formatCurrency(product.price * quantity)}</span>
                </button>

                <button
                  className={`btn-icon btn-secondary ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  title="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? "#E8A598" : "none"} color="#E8A598" />
                </button>
              </div>

              {/* Instant Direct Order button */}
              <button
                className="btn btn-outline-gold"
                style={{ width: '100%', marginTop: '12px', gap: '8px' }}
                onClick={handleBuyNow}
              >
                <Zap size={17} />
                <span>Instant Direct Order & Checkout</span>
              </button>
            </div>

            {/* Perks & Features */}
            <div className="detail-features">
              <h5>Atelier Standards & Care</h5>
              <ul>
                {product.features && product.features.map((f, i) => (
                  <li key={i}>
                    <Check size={14} color="#86EFAC" />
                    <span>{f}</span>
                  </li>
                ))}
                <li>
                  <Truck size={14} color="#E8A598" />
                  <span>Complimentary signature gift packaging with ribbon</span>
                </li>
                <li>
                  <ShieldCheck size={14} color="#D4AF37" />
                  <span>14-day hassle-free exchange & bespoke tailoring fit guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
