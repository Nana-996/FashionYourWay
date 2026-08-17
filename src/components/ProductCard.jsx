import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { setSelectedProductDetail, addToCart, wishlist, toggleWishlist, formatCurrency } = useStore();

  const isWishlisted = wishlist.includes(product.id);
  const primaryImg = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="product-card" onClick={() => setSelectedProductDetail(product)}>
      <div className="product-card-img-wrap">
        <img
          src={primaryImg}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <div className="product-card-tag">
            <span
              className={`badge ${
                product.tag === 'Bestseller'
                  ? 'badge-burgundy'
                  : product.tag === 'Runway Exclusive'
                  ? 'badge-gold'
                  : 'badge-blush'
              }`}
            >
              {product.tag}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`product-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#14030B" : "none"} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="product-card-quick-overlay">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleQuickAdd}
            style={{ width: '100%', gap: '8px' }}
          >
            <ShoppingBag size={16} />
            <span>Quick Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-card-category">{product.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#F3E5AB' }}>
            <Star size={13} fill="#D4AF37" color="#D4AF37" />
            <span>{product.rating || '5.0'}</span>
          </div>
        </div>

        <h3 className="product-card-name">{product.name}</h3>

        {/* Color Palette Indicators */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', margin: '4px 0' }}>
            {product.colors.map((c, i) => (
              <span
                key={i}
                title={c.name}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: c.hex || '#6B1736',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'inline-block'
                }}
              />
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-price-wrap">
            <span className="product-card-price">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="product-card-original-price">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <div
            className={`product-card-stock ${
              product.stock < 5 ? 'low-stock' : ''
            }`}
          >
            {product.stock <= 0
              ? 'Made to Order'
              : product.stock < 5
              ? `Only ${product.stock} left`
              : 'In Stock'}
          </div>
        </div>
      </div>
    </div>
  );
};
