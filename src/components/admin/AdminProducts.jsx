import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminProductModal } from './AdminProductModal';
import { Plus, Edit2, Trash2, Search, Sparkles, ExternalLink, Package } from 'lucide-react';

export const AdminProducts = () => {
  const { products, deleteProduct, setSelectedProductDetail, formatCurrency } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div>
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

        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add New Fashion Piece</span>
        </button>
      </div>

      {/* Products Table Card */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
            Store Catalog Inventory ({filteredProducts.length} Items)
          </div>
        </div>

        <div className="admin-table-wrap">
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
                        src={(prod.images && prod.images[0]) || ''}
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
    </div>
  );
};
