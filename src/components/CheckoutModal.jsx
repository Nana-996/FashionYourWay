import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, Smartphone, Landmark, Truck, Check, ArrowRight, ArrowLeft, Lock, MapPin } from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    storeInfo,
    placeOrder,
    setCurrentView,
    setTrackQuery,
    formatCurrency
  } = useStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: 'Accra',
    region: 'Greater Accra Region',
    landmark: '',
    shippingType: 'standard', // 'standard' | 'express'
    paymentMethod: 'Mobile Money (MTN MoMo / Telecel)',
    customerNotes: '',
    momoNetwork: 'MTN Mobile Money',
    momoNumber: ''
  });

  const [errors, setErrors] = useState({});

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartSubtotal >= (storeInfo.freeShippingThreshold || 800);
  const shippingFee = formData.shippingType === 'express'
    ? (storeInfo.expressShippingFee || 85)
    : (isFreeShipping ? 0 : (storeInfo.standardShippingFee || 45));
  const finalTotal = cartSubtotal + shippingFee;

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Please enter your full name';
    if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@'))
      errs.customerEmail = 'Please provide a valid email';
    if (!formData.customerPhone.trim()) errs.customerPhone = 'Active Ghanaian phone number is required';
    if (!formData.shippingAddress.trim()) errs.shippingAddress = 'Delivery address / house location is required';
    if (!formData.city.trim()) errs.city = 'Town / City is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const createdOrder = placeOrder(formData);
    if (createdOrder) {
      setTrackQuery(createdOrder.id);
      setCurrentView('track');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close checkout"
        >
          <X size={20} />
        </button>

        {/* Stepper Header */}
        <div className="checkout-stepper">
          <div className={`checkout-step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="checkout-step-number">1</span>
            <span>Delivery Info</span>
          </div>
          <div style={{ width: '30px', height: '1px', background: 'rgba(232, 165, 152, 0.2)' }} />
          <div className={`checkout-step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="checkout-step-number">2</span>
            <span>Payment & Review</span>
          </div>
        </div>

        {/* STEP 1: Customer & Delivery Details (No Zip Code) */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#FFFFFF' }}>
              Client Delivery Information
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 240, 243, 0.7)', marginBottom: '24px' }}>
              Please provide your recipient details for direct rider dispatch across Ghana.
            </p>

            <div className="form-grid">
              <div className="form-group form-grid-full">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Nana Ama Boateng"
                  className="form-input"
                  value={formData.customerName}
                  onChange={e => handleInputChange('customerName', e.target.value)}
                />
                {errors.customerName && <span style={{ color: '#F87171', fontSize: '0.78rem' }}>{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number (For Rider / Dispatch Call) *</label>
                <input
                  type="tel"
                  placeholder="054 XXX XXXX or +233 XX XXX XXXX"
                  className="form-input"
                  value={formData.customerPhone}
                  onChange={e => handleInputChange('customerPhone', e.target.value)}
                />
                {errors.customerPhone && <span style={{ color: '#F87171', fontSize: '0.78rem' }}>{errors.customerPhone}</span>}
              </div>

              <div className="form-group">
                <label>Email Address (For Order Receipts) *</label>
                <input
                  type="email"
                  placeholder="ama@example.com"
                  className="form-input"
                  value={formData.customerEmail}
                  onChange={e => handleInputChange('customerEmail', e.target.value)}
                />
                {errors.customerEmail && <span style={{ color: '#F87171', fontSize: '0.78rem' }}>{errors.customerEmail}</span>}
              </div>

              <div className="form-group form-grid-full">
                <label>Delivery Address / Street / Area *</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 18, 5th Circular Road, Cantonments"
                  className="form-input"
                  value={formData.shippingAddress}
                  onChange={e => handleInputChange('shippingAddress', e.target.value)}
                />
                {errors.shippingAddress && <span style={{ color: '#F87171', fontSize: '0.78rem' }}>{errors.shippingAddress}</span>}
              </div>

              <div className="form-group">
                <label>Town / City *</label>
                <input
                  type="text"
                  placeholder="e.g. Accra, Kumasi, Takoradi, Tema"
                  className="form-input"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                />
                {errors.city && <span style={{ color: '#F87171', fontSize: '0.78rem' }}>{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>Region *</label>
                <select
                  className="form-select"
                  value={formData.region}
                  onChange={e => handleInputChange('region', e.target.value)}
                >
                  <option value="Greater Accra Region">Greater Accra Region</option>
                  <option value="Ashanti Region">Ashanti Region</option>
                  <option value="Central Region">Central Region</option>
                  <option value="Eastern Region">Eastern Region</option>
                  <option value="Western Region">Western Region</option>
                  <option value="Volta Region">Volta Region</option>
                  <option value="Northern Region">Northern Region</option>
                  <option value="Other Region">Other Region</option>
                </select>
              </div>

              <div className="form-group form-grid-full">
                <label>Prominent Landmark / Delivery Guide (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near A&C Mall / Opposite Mensvic Grand Hotel / Shell Fuel Station"
                  className="form-input"
                  value={formData.landmark}
                  onChange={e => handleInputChange('landmark', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Special Tailoring or Delivery Instructions</label>
                <textarea
                  placeholder="Add custom sizing measurements or gate codes..."
                  className="form-textarea"
                  value={formData.customerNotes}
                  onChange={e => handleInputChange('customerNotes', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button className="btn btn-primary" onClick={handleNext} style={{ gap: '10px' }}>
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Shipping, Ghanaian Payment & Order Review */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#FFFFFF' }}>
              Payment & Order Confirmation
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 240, 243, 0.7)', marginBottom: '20px' }}>
              Choose your preferred payment method and review your luxury order summary.
            </p>

            {/* Shipping Speed Option */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E8A598', display: 'block', marginBottom: '10px' }}>
                Select Delivery Speed
              </label>
              <div className="payment-methods-grid">
                <div
                  className={`payment-method-card ${formData.shippingType === 'standard' ? 'active' : ''}`}
                  onClick={() => handleInputChange('shippingType', 'standard')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Standard Courier Dispatch</span>
                    <span>{isFreeShipping ? 'FREE' : formatCurrency(storeInfo.standardShippingFee || 45)}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
                    Delivered within 24-48 hours across Accra & major cities
                  </div>
                </div>

                <div
                  className={`payment-method-card ${formData.shippingType === 'express' ? 'active' : ''}`}
                  onClick={() => handleInputChange('shippingType', 'express')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>VIP Priority Same-Day Rider</span>
                    <span>{formatCurrency(storeInfo.expressShippingFee || 85)}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
                    Immediate dedicated dispatch within Accra
                  </div>
                </div>
              </div>
            </div>

            {/* Ghanaian Payment Method */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E8A598', display: 'block', marginBottom: '10px' }}>
                Payment Method (Ghana)
              </label>
              <div className="payment-methods-grid">
                <div
                  className={`payment-method-card ${formData.paymentMethod === 'Mobile Money (MTN MoMo / Telecel)' ? 'active' : ''}`}
                  onClick={() => handleInputChange('paymentMethod', 'Mobile Money (MTN MoMo / Telecel)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Smartphone size={18} color="#FDE047" />
                    <span>Mobile Money (MoMo / Telecel)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
                    Direct prompt to your phone or merchant transfer
                  </div>
                </div>

                <div
                  className={`payment-method-card ${formData.paymentMethod === 'Direct Bank Transfer' ? 'active' : ''}`}
                  onClick={() => handleInputChange('paymentMethod', 'Direct Bank Transfer')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Landmark size={18} color="#D4AF37" />
                    <span>Direct Bank Wire / Instant EFT</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
                    Ecobank, Stanbic, GTBank, Fidelity transfer details
                  </div>
                </div>

                <div
                  className={`payment-method-card ${formData.paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
                  onClick={() => handleInputChange('paymentMethod', 'Cash on Delivery')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Truck size={18} color="#86EFAC" />
                    <span>Cash on Delivery</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
                    Pay rider upon receipt and inspection of package
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div
              style={{
                background: 'rgba(20, 3, 11, 0.7)',
                border: '1px solid rgba(232, 165, 152, 0.15)',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '24px'
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
                Order Breakdown ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '140px', overflowY: 'auto' }}>
                {cart.map(item => (
                  <div key={item.itemKey} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(255, 245, 247, 0.85)' }}>
                      {item.quantity}x {item.name} ({item.selectedSize} / {item.selectedColor})
                    </span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(232, 165, 152, 0.1)', marginTop: '12px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#E8A598' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#E8A598' }}>
                  <span>Delivery Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                  <span>Total Amount Due</span>
                  <span style={{ color: '#E8A598' }}>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button className="btn btn-primary" onClick={handleSubmitOrder} style={{ gap: '10px' }}>
                <Lock size={16} />
                <span>Complete Order &middot; {formatCurrency(finalTotal)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
