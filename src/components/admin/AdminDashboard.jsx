import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminStoreSettings } from './AdminStoreSettings';
import {
  ShoppingBag,
  Package,
  Clock,
  ShieldCheck,
  TrendingUp,
  Settings,
  Eye,
  Store,
  Layers,
  Lock
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders,
    products,
    storeInfo,
    activeAdminTab,
    setActiveAdminTab,
    setCurrentView,
    logoutAdmin,
    formatCurrency
  } = useStore();

  // Compute Live KPIs
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="admin-view">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div className="admin-header-title">
            <h1>
              <ShieldCheck size={32} color="#D4AF37" />
              <span>FashionYourWay Executive Admin</span>
            </h1>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', marginTop: '4px' }}>
              Private management portal for Customer Orders, Catalog Inventory, and Boutique Details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setCurrentView('storefront');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ gap: '8px' }}
            >
              <Eye size={16} />
              <span>View Customer Storefront</span>
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={logoutAdmin}
              style={{ gap: '8px' }}
              title="Lock Admin session"
            >
              <Lock size={15} />
              <span>Lock & Log Out</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Stats Grid */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <TrendingUp size={26} color="#86EFAC" />
            </div>
            <div>
              <div className="admin-kpi-val">{formatCurrency(totalRevenue)}</div>
              <div className="admin-kpi-label">Gross Revenue</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <ShoppingBag size={26} color="#E8A598" />
            </div>
            <div>
              <div className="admin-kpi-val">{orders.length}</div>
              <div className="admin-kpi-label">Total Customer Orders</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ borderColor: 'rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.12)' }}>
              <Clock size={26} color="#FDE047" />
            </div>
            <div>
              <div className="admin-kpi-val">{pendingOrdersCount}</div>
              <div className="admin-kpi-label">Pending Action</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Layers size={26} color="#D8B4FE" />
            </div>
            <div>
              <div className="admin-kpi-val">{processingOrdersCount}</div>
              <div className="admin-kpi-label">In Tailoring / Shipped</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Package size={26} color="#D4AF37" />
            </div>
            <div>
              <div className="admin-kpi-val">{products.length}</div>
              <div className="admin-kpi-label">Active Catalog Pieces</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeAdminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Order Management ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span
                style={{
                  background: '#EAB308',
                  color: '#14030B',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  marginLeft: '4px'
                }}
              >
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('products')}
          >
            <Package size={18} />
            <span>Product Catalog & Photos ({products.length})</span>
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('settings')}
          >
            <Settings size={18} />
            <span>Store Profile, Location & Phone</span>
          </button>
        </div>

        {/* Active Tab View */}
        <div className="admin-tab-content">
          {activeAdminTab === 'orders' && <AdminOrders />}
          {activeAdminTab === 'products' && <AdminProducts />}
          {activeAdminTab === 'settings' && <AdminStoreSettings />}
        </div>
      </div>
    </div>
  );
};
