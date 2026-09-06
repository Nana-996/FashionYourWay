import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, X, Save, Phone, Mail, MapPin, MessageSquare, Printer } from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderAdminNotes, formatCurrency } = useStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const q = searchQuery.trim().toLowerCase();
  const filteredOrders = orders.filter(ord => {
    if (!ord) return false;
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch =
      !q ||
      (ord.id && ord.id.toLowerCase().includes(q)) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(q)) ||
      (ord.customerEmail && ord.customerEmail.toLowerCase().includes(q)) ||
      (ord.customerPhone && ord.customerPhone.includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal(prev => ({
        ...prev,
        status: newStatus,
        statusHistory: [
          ...(prev.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Status updated to ${newStatus} by Admin`
          }
        ]
      }));
    }
  };

  const handleOpenModal = (ord) => {
    setActiveOrderModal(ord);
    setAdminNoteInput(ord.adminNotes || '');
  };

  const handleSaveNotes = () => {
    if (activeOrderModal) {
      updateOrderAdminNotes(activeOrderModal.id, adminNoteInput);
      setActiveOrderModal(prev => ({ ...prev, adminNotes: adminNoteInput }));
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="admin-header-row" style={{ alignItems: 'stretch' }}>
        <div className="catalog-search-bar" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#E8A598" />
          <input
            type="text"
            placeholder="Search orders by ID, Client, Phone..."
            className="catalog-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#E8A598', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Pills (Scrollable on mobile) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              className={`category-filter-btn ${statusFilter === st ? 'active' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table & Mobile Cards */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.96rem' }}>
            Customer Orders Pipeline ({filteredOrders.length} Orders)
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <>
            {/* 1. DESKTOP VIEW: Table */}
            <div className="admin-desktop-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Client Details</th>
                    <th>Items & Total</th>
                    <th>Date Placed</th>
                    <th>Status (Managed by Admin)</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(ord => (
                    <tr key={ord.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{ord.id}</div>
                        <div style={{ fontSize: '0.75rem', color: '#E8A598' }}>{ord.trackingNumber}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 240, 243, 0.7)' }}>{ord.customerPhone}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 240, 243, 0.5)' }}>{ord.city || 'Accra'}, Ghana</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{formatCurrency(ord.total)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 240, 243, 0.65)' }}>
                          {ord.items?.length || 0} {(ord.items?.length === 1 ? 'piece' : 'pieces')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: ord.paymentStatus === 'Paid' ? '#86EFAC' : '#FDE047' }}>
                          ● {ord.paymentStatus} via {ord.paymentGateway || 'Paystack'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {new Date(ord.orderDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 240, 243, 0.5)' }}>
                          {new Date(ord.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <select
                          className={`status-select ${ord.status.toLowerCase()}`}
                          value={ord.status}
                          onChange={e => handleStatusChange(ord.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenModal(ord)}
                          style={{ gap: '6px' }}
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE VIEW: Responsive Order Cards */}
            <div className="admin-mobile-cards-list">
              {filteredOrders.map(ord => (
                <div key={ord.id} className="admin-mobile-order-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem' }}>{ord.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#E8A598' }}>{ord.trackingNumber}</div>
                    </div>

                    <select
                      className={`status-select ${ord.status.toLowerCase()}`}
                      value={ord.status}
                      onChange={e => handleStatusChange(ord.id, e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '12px', background: 'rgba(20, 3, 11, 0.5)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#FFF5F7', fontSize: '0.95rem' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.82rem', color: '#E8A598', marginTop: '2px' }}>
                      {ord.customerPhone} · {ord.city || 'Accra'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(232, 165, 152, 0.1)' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.1rem' }}>{formatCurrency(ord.total)}</span>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,240,243,0.6)', marginLeft: '6px' }}>
                          ({ord.items?.length || 0} pieces)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: ord.paymentStatus === 'Paid' ? '#86EFAC' : '#FDE047', fontWeight: 600 }}>
                        ● {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Order Action Buttons */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto',
                      gap: '8px',
                      marginTop: '12px'
                    }}
                  >
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'center', gap: '6px', minHeight: '44px', textDecoration: 'none' }}
                    >
                      <Phone size={14} />
                      <span>Call Client</span>
                    </a>

                    <a
                      href={`https://wa.me/${ord.customerPhone?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'center', gap: '6px', minHeight: '44px', textDecoration: 'none' }}
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenModal(ord)}
                      style={{ padding: '0 16px', minHeight: '44px', justifyContent: 'center' }}
                      title="View Full Order Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Clock size={40} color="#E8A598" />
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1.1rem' }}>
              No Orders Found Matching Filter
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem' }}>
              When clients place luxury orders through the storefront or WhatsApp, they will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal (Responsive for Desktop & Mobile) */}
      {activeOrderModal && (
        <div className="modal-backdrop" onClick={() => setActiveOrderModal(null)}>
          <div
            className="checkout-modal"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '820px',
              width: '100%',
              margin: '20px auto'
            }}
          >
            <button className="modal-close-btn" onClick={() => setActiveOrderModal(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-burgundy" style={{ marginBottom: '6px' }}>
                  Luxury Order Record
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0 }}>
                  Order #{activeOrderModal.id}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#E8A598', marginTop: '4px' }}>
                  Courier Tracking: {activeOrderModal.trackingNumber}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  className={`status-select ${activeOrderModal.status.toLowerCase()}`}
                  value={activeOrderModal.status}
                  onChange={e => handleStatusChange(activeOrderModal.id, e.target.value)}
                  style={{ fontSize: '0.92rem', padding: '8px 16px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.print()}
                  style={{ minHeight: '38px', padding: '0 12px' }}
                  title="Print Dispatch Receipt"
                >
                  <Printer size={15} />
                </button>
              </div>
            </div>

            {/* Client & Shipping Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}
            >
              <div style={{ background: 'rgba(20, 3, 11, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(232, 165, 152, 0.15)' }}>
                <div style={{ fontSize: '0.8rem', color: '#E8A598', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Client Profile
                </div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1.05rem' }}>{activeOrderModal.customerName}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 240, 243, 0.8)', marginTop: '4px' }}>
                  📞 <a href={`tel:${activeOrderModal.customerPhone}`} style={{ color: '#FFF5F7' }}>{activeOrderModal.customerPhone}</a>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 240, 243, 0.7)', marginTop: '2px' }}>
                  ✉️ {activeOrderModal.customerEmail}
                </div>
              </div>

              <div style={{ background: 'rgba(20, 3, 11, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(232, 165, 152, 0.15)' }}>
                <div style={{ fontSize: '0.8rem', color: '#E8A598', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Delivery Destination
                </div>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{activeOrderModal.shippingAddress}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 240, 243, 0.8)', marginTop: '4px' }}>
                  📍 {activeOrderModal.city}, {activeOrderModal.region || 'Greater Accra'}
                </div>
                {activeOrderModal.landmark && (
                  <div style={{ fontSize: '0.8rem', color: '#E8A598', marginTop: '2px' }}>
                    Landmark: {activeOrderModal.landmark}
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Pieces */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
                Garments in Order ({activeOrderModal.items?.length || 0})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeOrderModal.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'rgba(20, 3, 11, 0.6)',
                      borderRadius: '8px',
                      border: '1px solid rgba(232, 165, 152, 0.12)',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#E8A598' }}>
                          Size: {item.selectedSize} · Color: {item.selectedColor}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.6)' }}>
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Row */}
            <div
              style={{
                background: 'rgba(43, 7, 21, 0.5)',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(232, 165, 152, 0.2)',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(activeOrderModal.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                <span>Shipping Fee:</span>
                <span>{activeOrderModal.shippingFee === 0 ? 'Complimentary' : formatCurrency(activeOrderModal.shippingFee)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(232, 165, 152, 0.15)'
                }}
              >
                <span>Grand Total:</span>
                <span style={{ color: '#E8A598' }}>{formatCurrency(activeOrderModal.total)}</span>
              </div>
            </div>

            {/* Admin Private Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '6px' }}>
                Private Atelier Notes (Visible only to Store Admin):
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. Courier rider picked up at 3pm, Paystack ref verified..."
                  className="form-input"
                  style={{ flex: 1 }}
                  value={adminNoteInput}
                  onChange={e => setAdminNoteInput(e.target.value)}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleSaveNotes} style={{ gap: '6px' }}>
                  <Save size={15} />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(232, 165, 152, 0.15)' }}>
              <button className="btn btn-primary" onClick={() => setActiveOrderModal(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
