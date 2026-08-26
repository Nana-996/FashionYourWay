import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminProductModal } from './AdminProductModal';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  ExternalLink,
  Package,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  FileCode,
  AlertTriangle,
  X
} from 'lucide-react';

export const AdminProducts = () => {
  const {
    products,
    deleteProduct,
    clearAllProducts,
    restoreDemoProducts,
    importProducts,
    setSelectedProductDetail,
    formatCurrency,
    showToast
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredProducts = products.filter(p =>
    !searchQuery.trim() ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to remove "${product.name}" from the store catalog?`)) {
      deleteProduct(product.id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove ALL placeholder products? This will give you a clean slate to add your own pieces.')) {
      clearAllProducts();
    }
  };

  const handleRestoreDemo = () => {
    if (window.confirm('Restore the original sample showcase catalog? Any custom products currently not exported will be replaced.')) {
      restoreDemoProducts();
    }
  };

  const handleCopyCode = () => {
    const formatted = `export const initialProducts = ${JSON.stringify(products, null, 2)};\n`;
    navigator.clipboard.writeText(formatted);
    setCopiedCode(true);
    showToast('Code Copied 📋', 'Product catalog code copied to clipboard', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleProcessImport = (e) => {
    e.preventDefault();
    try {
      let parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed) && parsed.initialProducts) {
        parsed = parsed.initialProducts;
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        importProducts(parsed);
        setIsImportModalOpen(false);
        setImportJsonText('');
      } else {
        alert('Please paste a valid JSON array of products.');
      }
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
    }
  };

  return (
    <div>
      {/* Top Banner Status & Actions */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          border: '1px solid rgba(232, 165, 152, 0.25)',
          background: 'rgba(20, 3, 11, 0.65)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#86EFAC',
              boxShadow: '0 0 10px #86EFAC'
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
              Live Storefront Synchronization: Active
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
              All additions, edits, and removals automatically save and reflect live for customers.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsExportModalOpen(true)}
            style={{ gap: '6px' }}
            title="Export or copy product catalog code"
          >
            <Download size={14} />
            <span>Export Catalog</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsImportModalOpen(true)}
            style={{ gap: '6px' }}
            title="Import products from JSON"
          >
            <Upload size={14} />
            <span>Import JSON</span>
          </button>

          {products.length > 0 ? (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleClearAll}
              style={{ gap: '6px' }}
              title="Remove all placeholder items in 1 click"
            >
              <Trash2 size={14} />
              <span>Clear Placeholders</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRestoreDemo}
              style={{ gap: '6px' }}
              title="Load demo showroom catalog"
            >
              <RotateCcw size={14} />
              <span>Restore Demo Items</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Management Toolbar */}
      <div className="admin-header-row">
        <div className="catalog-search-bar" style={{ width: '360px' }}>
          <Search size={18} color="#E8A598" />
          <input
            type="text"
            placeholder="Search products by title, category, ID..."
            className="catalog-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ gap: '8px' }}
          >
            <Plus size={18} />
            <span>Add New Fashion Piece</span>
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
            Store Catalog Inventory ({products.length} Total Pieces{searchQuery ? ` &middot; ${filteredProducts.length} Matching` : ''})
          </div>
          {products.length > 0 && (
            <button
              onClick={handleRestoreDemo}
              style={{
                background: 'none',
                border: 'none',
                color: '#E8A598',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'underline'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset to Demo Catalog</span>
            </button>
          )}
        </div>

        <div className="admin-table-wrap">
          {filteredProducts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sizes & Colors</th>
                  <th>Tag</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80'}
                          alt={prod.name}
                          className="admin-product-thumb"
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#E8A598' }}>{prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-blush">{prod.category}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(prod.price)}</div>
                      {prod.originalPrice && (
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,240,243,0.4)', textDecoration: 'line-through' }}>
                          {formatCurrency(prod.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: prod.stock <= 3 ? '#F87171' : '#86EFAC'
                        }}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,245,247,0.8)' }}>
                        {prod.sizes ? prod.sizes.join(', ') : 'Standard'}
                      </div>
                      {prod.colors && prod.colors.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {prod.colors.map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: c.hex || '#6B1736',
                                display: 'inline-block',
                                border: '1px solid rgba(255,255,255,0.3)'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {prod.tag ? (
                        <span className="badge badge-burgundy">{prod.tag}</span>
                      ) : (
                        <span style={{ color: 'rgba(255,240,243,0.4)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-icon btn-secondary"
                          style={{ width: '32px', height: '32px' }}
                          title="Preview on Storefront"
                          onClick={() => setSelectedProductDetail(prod)}
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          className="btn-icon btn-secondary"
                          style={{ width: '32px', height: '32px' }}
                          title="Edit Product Details & Photos"
                          onClick={() => setEditingProduct(prod)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          style={{ width: '32px', height: '32px' }}
                          title="Delete Product"
                          onClick={() => handleDelete(prod)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                padding: '50px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <Package size={44} color="#E8A598" />
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1.1rem' }}>
                {products.length === 0 ? 'No Products in Store Catalog' : 'No Products Matching Search'}
              </div>
              <p style={{ color: 'rgba(255, 240, 243, 0.7)', maxWidth: '400px', fontSize: '0.88rem' }}>
                {products.length === 0
                  ? 'Your store is ready for your unique collection! Click below to create your first fashion piece or restore sample showcase items.'
                  : 'Try clearing your search query to view all items.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={15} />
                  <span>Add First Fashion Piece</span>
                </button>
                {products.length === 0 && (
                  <button className="btn btn-secondary btn-sm" onClick={handleRestoreDemo}>
                    <RotateCcw size={15} />
                    <span>Restore Demo Items</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <AdminProductModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <AdminProductModal
          productToEdit={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsExportModalOpen(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <button className="modal-close-btn" onClick={() => setIsExportModalOpen(false)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Download size={22} color="#E8A598" />
              <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.3rem' }}>
                Export Store Product Catalog
              </h3>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.88rem', marginBottom: '16px' }}>
              You can copy this product catalog array for backups, or paste it directly into <code>src/data/initialProducts.js</code> to permanently hardcode it into git defaults.
            </p>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <textarea
                readOnly
                rows={12}
                value={JSON.stringify(products, null, 2)}
                className="form-textarea"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  background: 'rgba(10, 2, 6, 0.9)',
                  color: '#86EFAC'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setIsExportModalOpen(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleCopyCode}>
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Products JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsImportModalOpen(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close-btn" onClick={() => setIsImportModalOpen(false)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Upload size={22} color="#E8A598" />
              <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.3rem' }}>
                Import Product Catalog
              </h3>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Paste a JSON array of product objects to replace or bulk-load your store catalog.
            </p>

            <form onSubmit={handleProcessImport}>
              <textarea
                required
                rows={10}
                placeholder='[ { "id": "FYW-PROD-001", "name": "...", "price": 1200, ... } ]'
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                className="form-textarea"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  background: 'rgba(10, 2, 6, 0.9)'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Import & Apply Live</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
