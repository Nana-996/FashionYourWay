import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Package, Clock, CheckCircle2, Truck, Sparkles, MapPin, Phone, Mail, ArrowRight, Printer, AlertCircle } from 'lucide-react';

export const OrderTrackingView = () => {
  const { orders, trackQuery, setTrackQuery, setCurrentView, formatCurrency } = useStore();

  const [searchInput, setSearchInput] = useState(trackQuery || '');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // If trackQuery changes from context (e.g. after placing order)
  useEffect(() => {
    if (trackQuery) {
      setSearchInput(trackQuery);
      const found = orders.find(
        o => o.id.toLowerCase() === trackQuery.toLowerCase().trim()
      );
      if (found) setSelectedOrder(found);
    } else if (orders.length > 0 && !selectedOrder) {
      // Default to the most recent order for convenient preview
      setSelectedOrder(orders[0]);
    }
  }, [trackQuery, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const match = orders.find(
      o =>
        o.id.toLowerCase() === query ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.customerPhone.includes(query) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query))
    );

    setSelectedOrder(match || null);
  };

  const getStepStatus = (stepName, currentStatus) => {
    const sequence = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepName);

    if (currentStatus === 'Cancelled') {
      return stepName === 'Pending' ? 'completed' : 'cancelled';
    }

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Pending': return 10;
      case 'Confirmed': return 35;
      case 'Processing': return 65;
      case 'Shipped': return 88;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="track-section">
      <div className="container">
        {/* Track Hero Banner */}
        <div className="track-hero-box">
          <span className="badge badge-burgundy" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>VIP Client Concierge</span>
          </span>
          <h1>Client Order Management & Tracking</h1>
          <p>
            Track your bespoke tailoring, packaging status, and courier dispatch in real time.
          </p>

          {/* Search Lookup Card */}
          <form onSubmit={handleSearch} className="track-search-card" style={{ marginTop: '30px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', textAlign: 'left', display: 'block' }}>
              Lookup Order by Order ID (#FYW-XXXXX) or Phone Number:
            </label>
            <div className="track-input-group">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. FYW-84920) or Phone / Email..."
                className="track-input"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                <Search size={18} />
                <span>Track Order</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,240,243,0.6)' }}>Sample Active Orders:</span>
              {orders.slice(0, 3).map(ord => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setSearchInput(ord.id);
                    setSelectedOrder(ord);
                  }}
                  style={{
                    background: 'rgba(232, 165, 152, 0.12)',
                    border: '1px solid rgba(232, 165, 152, 0.25)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    color: '#E8A598',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {ord.id} ({ord.status})
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Order Details & Live Stepper Card */}
        {selectedOrder ? (
          <div className="order-result-card animate-fade-in">
            {/* Header */}
            <div className="order-result-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span className="order-result-id">Order #{selectedOrder.id}</span>
                  <span className={`badge ${
                    selectedOrder.status === 'Delivered'
                      ? 'badge-blush'
                      : selectedOrder.status === 'Cancelled'
                      ? 'btn-danger'
                      : 'badge-burgundy'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="order-result-date">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary btn-sm" onClick={handlePrint} style={{ gap: '6px' }}>
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Visual Live Status Progress Bar */}
            <div className="order-stepper-wrap">
              <div className="stepper-progress-bar">
                <div
                  className="stepper-line-active"
                  style={{ width: `${getProgressPercentage(selectedOrder.status)}%` }}
                />

                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const state = getStepStatus(step, selectedOrder.status);
                  return (
                    <div key={step} className={`stepper-node ${state}`}>
                      <div className="stepper-circle">
                        {state === 'completed' ? (
                          <CheckCircle2 size={20} />
                        ) : state === 'current' ? (
                          <Clock size={18} />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className="stepper-label">
                        {step === 'Processing' ? 'Tailoring & Atelier' : step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Breakdown Grid */}
            <div className="order-summary-grid">
              {/* Left Column: Ordered Items & Timeline */}
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '16px' }}>
                  Items in this Order ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h4>

                <div className="order-items-table">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-thumb" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#E8A598', marginTop: '2px' }}>
                          Size: <strong>{item.selectedSize}</strong> &middot; Color: <strong>{item.selectedColor}</strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,240,243,0.5)', marginTop: '2px' }}>
                          Qty: {item.quantity} &times; {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Timeline Logs */}
                <div className="order-history-timeline">
                  <h4 style={{ fontSize: '1rem', color: '#E8A598', marginBottom: '14px' }}>
                    Live Status History
                  </h4>
                  {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                    selectedOrder.statusHistory.map((hist, i) => (
                      <div key={i} className="timeline-entry">
                        <div className="timeline-time">
                          {new Date(hist.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} &middot; <strong>{hist.status}</strong>
                        </div>
                        <div className="timeline-note">{hist.note}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,240,243,0.6)' }}>
                      Order created and logged in the Atelier system.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Delivery & Payment Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="order-delivery-box">
                  <h4>Delivery Details</h4>
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.customerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 245, 247, 0.8)', marginTop: '4px' }}>
                      {selectedOrder.shippingAddress}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 245, 247, 0.8)' }}>
                      {selectedOrder.city}{selectedOrder.region ? `, ${selectedOrder.region}` : ''}, {selectedOrder.country || 'Ghana'}
                    </div>
                    {selectedOrder.landmark && (
                      <div style={{ fontSize: '0.8rem', color: '#E8A598', marginTop: '2px' }}>
                        Landmark: {selectedOrder.landmark}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(232, 165, 152, 0.1)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color="#E8A598" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} color="#E8A598" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div style={{ background: 'rgba(232, 165, 152, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(232, 165, 152, 0.2)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#E8A598' }}>Tracking / Courier ID</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {selectedOrder.trackingNumber}
                      </div>
                    </div>
                  )}

                  {selectedOrder.customerNotes && (
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255, 240, 243, 0.75)', fontStyle: 'italic' }}>
                      <strong>Client Note:</strong> "{selectedOrder.customerNotes}"
                    </div>
                  )}
                </div>

                {/* Price Breakdown Box */}
                <div className="order-delivery-box">
                  <h4>Payment Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 245, 247, 0.8)' }}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 245, 247, 0.8)' }}>
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem', color: '#FFFFFF', borderTop: '1px solid rgba(232, 165, 152, 0.1)', paddingTop: '10px' }}>
                      <span>Total Paid / Due</span>
                      <span style={{ color: '#E8A598' }}>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#D4AF37', marginTop: '4px' }}>
                      Method: {selectedOrder.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="glass-panel text-center"
            style={{ padding: '60px 20px', maxWidth: '640px', margin: '0 auto' }}
          >
            <AlertCircle size={48} color="#F87171" style={{ margin: '0 auto 16px' }} />
            <h3>No order found matching "{searchInput}"</h3>
            <p style={{ marginTop: '8px', color: 'rgba(255, 240, 243, 0.7)' }}>
              Please check that the order ID starts with "FYW-" or try searching using the email or phone number provided during checkout.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '20px' }}
              onClick={() => setCurrentView('storefront')}
            >
              Return to Boutique Catalog
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
