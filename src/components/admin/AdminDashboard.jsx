import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminContentEditor } from './AdminContentEditor';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminLogoStudio } from './AdminLogoStudio';
import { AdminColorStudio } from './AdminColorStudio';
import { BrandLogo } from '../BrandLogo';
import {
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  Settings,
  Eye,
  Layers,
  Lock,
  Sparkles,
  Type,
  Palette
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders,
    products,
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

  return (
    <div className="admin-view">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div className="admin-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <BrandLogo size="md" showSub={false} />
              <span className="admin-header-badge">Executive Admin Portal</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', marginTop: '6px', fontSize: '0.88rem' }}>
              Private management portal for Customer Orders, Catalog Inventory, Website Copy & Boutique Settings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setCurrentView('storefront');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ gap: '8px' }}
            >
              <Eye size={16} />
              <span>View Storefront</span>
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
              <TrendingUp size={24} color="#86EFAC" />
            </div>
            <div>
              <div className="admin-kpi-val">{formatCurrency(totalRevenue)}</div>
              <div className="admin-kpi-label">Gross Revenue</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <ShoppingBag size={24} color="#E8A598" />
            </div>
            <div>
              <div className="admin-kpi-val">{orders.length}</div>
              <div className="admin-kpi-label">Total Customer Orders</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon" style={{ borderColor: 'rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.12)' }}>
              <Clock size={24} color="#FDE047" />
            </div>
            <div>
              <div className="admin-kpi-val">{pendingOrdersCount}</div>
              <div className="admin-kpi-label">Pending Action</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Layers size={24} color="#D8B4FE" />
            </div>
            <div>
              <div className="admin-kpi-val">{processingOrdersCount}</div>
              <div className="admin-kpi-label">In Tailoring / Shipped</div>
            </div>
          </div>

          <div className="admin-kpi-card admin-kpi-card-wide">
            <div className="admin-kpi-icon">
              <Package size={24} color="#D4AF37" />
            </div>
            <div>
              <div className="admin-kpi-val">{products.length}</div>
              <div className="admin-kpi-label">Active Catalog Pieces</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Scrollable on mobile) */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeAdminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('orders')}
          >
            <ShoppingBag size={17} />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span
                style={{
                  background: '#EAB308',
                  color: '#14030B',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
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
            <Package size={17} />
            <span>Products & Photos ({products.length})</span>
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'text-editor' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('text-editor')}
          >
            <Type size={17} />
            <span>Site Text & Copy Editor</span>
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'logo' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('logo')}
          >
            <Sparkles size={17} />
            <span>Brand Logo Studio</span>
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('colors')}
          >
            <Palette size={17} />
            <span>Site Colors & Theme</span>
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('settings')}
          >
            <Settings size={17} />
            <span>Location & Contacts</span>
          </button>
        </div>

        {/* Active Tab View */}
        <div className="admin-tab-content">
          {activeAdminTab === 'orders' && <AdminOrders />}
          {activeAdminTab === 'products' && <AdminProducts />}
          {activeAdminTab === 'text-editor' && <AdminContentEditor />}
          {activeAdminTab === 'logo' && <AdminLogoStudio />}
          {activeAdminTab === 'colors' && <AdminColorStudio />}
          {activeAdminTab === 'settings' && <AdminStoreSettings />}
        </div>
      </div>
    </div>
  );
};
