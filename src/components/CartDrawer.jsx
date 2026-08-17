import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    storeInfo,
    formatCurrency
  } = useStore();

  if (!isCartOpen) return null;

  const threshold = storeInfo.freeShippingThreshold || 800;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / threshold) * 100);
  const remainingForFreeShipping = Math.max(0, threshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <h3>
            <ShoppingBag size={22} color="#E8A598" />
            <span>Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </h3>
          <button
            className="modal-close-btn"
            style={{ position: 'static' }}
            onClick={() => setIsCartOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '0 24px', marginTop: '16px' }}>
          <div className="free-shipping-progress-box">
            {remainingForFreeShipping > 0 ? (
              <div>
                Add <strong>{formatCurrency(remainingForFreeShipping)}</strong> more to unlock <strong>Complimentary Nationwide Delivery</strong>!
              </div>
            ) : (
              <div style={{ color: '#86EFAC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} />
                <span>You qualify for Complimentary VIP Delivery across Ghana!</span>
              </div>
            )}
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={54} color="rgba(232, 165, 152, 0.4)" />
              <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.9rem' }}>
                Explore our signature runway pieces and curate your look today.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsCartOpen(false)}
                style={{ marginTop: '10px' }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.itemKey} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-meta">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>&middot;</span>
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div className="qty-stepper" style={{ padding: '2px' }}>
                      <button
                        className="qty-btn"
                        style={{ width: '26px', height: '26px' }}
                        onClick={() => updateCartQuantity(item.itemKey, -1)}
                      >
                        -
                      </button>
                      <span className="qty-val" style={{ minWidth: '24px', fontSize: '0.85rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        style={{ width: '26px', height: '26px' }}
                        onClick={() => updateCartQuantity(item.itemKey, 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>

                <button
                  className="cart-item-remove-btn"
                  onClick={() => removeFromCart(item.itemKey)}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Delivery</span>
              <span>{remainingForFreeShipping === 0 ? 'FREE' : formatCurrency(storeInfo.standardShippingFee || 45)}</span>
            </div>
            <div className="cart-total-row">
              <span>Estimated Total</span>
              <span style={{ color: '#E8A598' }}>
                {formatCurrency(cartSubtotal + (remainingForFreeShipping === 0 ? 0 : (storeInfo.standardShippingFee || 45)))}
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255, 240, 243, 0.5)' }}>
              <ShieldCheck size={14} color="#D4AF37" />
              <span>Secure checkout with live order tracking & concierge</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
