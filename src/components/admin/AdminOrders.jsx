import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, X, Save, Phone, Mail, MapPin } from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderAdminNotes, formatCurrency } = useStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
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
      <div className="admin-header-row">
        <div className="catalog-search-bar" style={{ width: '360px' }}>
          <Search size={18} color="#E8A598" />
          <input
            type="text"
            placeholder="Search orders by ID, Client, Phone..."
            className="catalog-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              className={`category-filter-btn ${statusFilter === st ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
            Customer Orders Pipeline ({filteredOrders.length} Orders)
          </div>
        </div>

        <div className="admin-table-wrap">
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
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      {ord.id}
                    </span>
                    {ord.trackingNumber && (
                      <div style={{ fontSize: '0.72rem', color: '#E8A598' }}>{ord.trackingNumber}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,245,247,0.7)' }}>{ord.customerPhone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,240,243,0.5)' }}>{ord.city}{ord.region ? `, ${ord.region}` : ''}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{formatCurrency(ord.total)}</div>
                    <div style={{ fontSize: '0.78rem', color: '#E8A598', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>{ord.items.length} item{ord.items.length > 1 ? 's' : ''}</span>
                      {ord.paymentReference ? (
                        <span className="badge badge-burgundy" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          ⚡ Paid (Paystack)
                        </span>
                      ) : ord.paymentStatus === 'Paid' ? (
                        <span className="badge badge-burgundy" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          Paid
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,245,247,0.8)' }}>
                      {new Date(ord.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td>
                    {/* Admin Status Dropdown */}
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
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Notes Drawer Modal */}
      {activeOrderModal && (
        <div className="modal-backdrop" onClick={() => setActiveOrderModal(null)}>
          <div className="admin-order-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveOrderModal(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', borderBottom: '1px solid rgba(232,165,152,0.15)', paddingBottom: '16px' }}>
              <div>
                <span className="badge badge-burgundy" style={{ marginBottom: '6px' }}>
                  Admin Order Review
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF' }}>Order #{activeOrderModal.id}</h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,240,243,0.7)' }}>
                  Placed on {new Date(activeOrderModal.orderDate).toLocaleString()}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#E8A598', display: 'block', marginBottom: '4px' }}>
                  Live Status Selector
                </label>
                <select
                  className={`status-select ${activeOrderModal.status.toLowerCase()}`}
                  style={{ fontSize: '0.95rem', padding: '8px 16px' }}
                  value={activeOrderModal.status}
                  onChange={e => handleStatusChange(activeOrderModal.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Client Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(20, 3, 11, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(232,165,152,0.1)' }}>
                <h5 style={{ color: '#E8A598', marginBottom: '10px' }}>Recipient & Delivery</h5>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{activeOrderModal.customerName}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,245,247,0.85)', marginTop: '4px' }}>
                  {activeOrderModal.shippingAddress}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,245,247,0.85)' }}>
                  {activeOrderModal.city}{activeOrderModal.region ? `, ${activeOrderModal.region}` : ''}, {activeOrderModal.country || 'Ghana'}
                </div>
                {activeOrderModal.landmark && (
                  <div style={{ fontSize: '0.8rem', color: '#E8A598', marginTop: '2px' }}>
                    Landmark: {activeOrderModal.landmark}
                  </div>
                )}
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: '#E8A598' }}>
                  <div>📞 {activeOrderModal.customerPhone}</div>
                  <div>✉️ {activeOrderModal.customerEmail}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(20, 3, 11, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(232,165,152,0.1)' }}>
                <h5 style={{ color: '#E8A598', marginBottom: '10px' }}>Payment & Courier</h5>
                <div style={{ fontSize: '0.88rem', color: '#FFFFFF' }}>
                  <strong>Payment:</strong> {activeOrderModal.paymentMethod}
                </div>
                {activeOrderModal.paymentReference && (
                  <div style={{ fontSize: '0.82rem', color: '#86EFAC', marginTop: '4px', wordBreak: 'break-all' }}>
                    <strong>Paystack Ref:</strong> {activeOrderModal.paymentReference}
                  </div>
                )}
                <div style={{ fontSize: '0.88rem', color: '#FFFFFF', marginTop: '6px' }}>
                  <strong>Tracking ID:</strong> {activeOrderModal.trackingNumber || 'Pending Dispatch'}
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span className={`badge ${activeOrderModal.paymentStatus === 'Paid' ? 'badge-burgundy' : 'badge-blush'}`} style={{ fontSize: '0.72rem' }}>
                    Status: {activeOrderModal.paymentStatus || 'Pending'}
                  </span>
                </div>
                {activeOrderModal.customerNotes && (
                  <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'rgba(255,240,243,0.8)' }}>
                    <strong>Client Instructions:</strong> "{activeOrderModal.customerNotes}"
                  </div>
                )}
              </div>
            </div>

            {/* Items Ordered List */}
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ color: '#E8A598', marginBottom: '12px' }}>Ordered Garments</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeOrderModal.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(20,3,11,0.4)', padding: '10px', borderRadius: '8px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#E8A598' }}>
                        Size: {item.selectedSize} &middot; Color: {item.selectedColor}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,240,243,0.5)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Internal Notes Editor */}
            <div style={{ background: 'rgba(43,7,21,0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(232,165,152,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Admin Atelier & Dispatch Notes (Internal)
                </label>
                <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} style={{ gap: '6px' }}>
                  <Save size={14} />
                  <span>Save Notes</span>
                </button>
              </div>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. VIP gift packaging added, dispatched with FedEx Priority on 17th..."
                value={adminNoteInput}
                onChange={e => setAdminNoteInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
