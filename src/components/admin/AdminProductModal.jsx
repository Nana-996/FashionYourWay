import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Trash2, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

export const AdminProductModal = ({ productToEdit, onClose }) => {
  const { addProduct, updateProduct } = useStore();

  const isEditMode = Boolean(productToEdit);

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Evening & Gala',
    price: '',
    originalPrice: '',
    stock: 15,
    tag: 'New In',
    images: [''],
    sizesText: 'XS, S, M, L, XL',
    colorsText: 'Burgundy Wine (#4A0E23), Blush Rose (#E8A598), Pearl White (#FFFFFF), Noir (#1F0610)',
    description: '',
    featuresText: 'Premium mulberry fabric\nTailored fit silhouette\nDry clean only'
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        subtitle: productToEdit.subtitle || '',
        category: productToEdit.category || 'Evening & Gala',
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        stock: productToEdit.stock ?? 15,
        tag: productToEdit.tag || 'Bestseller',
        images: productToEdit.images && productToEdit.images.length > 0 ? productToEdit.images : [''],
        sizesText: productToEdit.sizes ? productToEdit.sizes.join(', ') : 'XS, S, M, L',
        colorsText: productToEdit.colors
          ? productToEdit.colors.map(c => `${c.name} (${c.hex})`).join(', ')
          : 'Deep Burgundy (#4A0E23)',
        description: productToEdit.description || '',
        featuresText: productToEdit.features ? productToEdit.features.join('\n') : ''
      });
    }
  }, [productToEdit]);

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData(prev => ({ ...prev, images: updated }));
  };

  const handleAddImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleImageChange(index, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse sizes
    const sizes = formData.sizesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse colors
    const colors = formData.colorsText
      .split(',')
      .map(c => {
        const match = c.match(/(.+)\((#[a-fA-F0-9]{3,6})\)/);
        if (match) {
          return { name: match[1].trim(), hex: match[2].trim() };
        }
        return { name: c.trim(), hex: '#6B1736' };
      })
      .filter(Boolean);

    // Parse features
    const features = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    // Filter valid images
    const validImages = formData.images.filter(img => img && img.trim().length > 0);
    const fallbackImage = 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';

    const payload = {
      name: formData.name,
      subtitle: formData.subtitle,
      category: formData.category,
      price: Number(formData.price) || 150,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stock) || 10,
      tag: formData.tag,
      images: validImages.length > 0 ? validImages : [fallbackImage],
      sizes: sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L'],
      colors: colors.length > 0 ? colors : [{ name: 'Burgundy', hex: '#4A0E23' }],
      description: formData.description,
      features: features.length > 0 ? features : ['Handcrafted luxury finish', 'Dry clean only']
    };

    if (isEditMode) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#FFFFFF' }}>
          {isEditMode ? `Edit Product: ${productToEdit.name}` : 'Create New Luxury Product'}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255, 240, 243, 0.7)', marginBottom: '24px' }}>
          Update the product details, stock, pricing, color variants, and imagery.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group form-grid-full">
            <label>Product Title / Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Aurelia Velvet Gala Maxi Gown"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Subtitle / One-line Description</label>
            <input
              type="text"
              placeholder="e.g. Floor-sweeping structured velvet with daring side slit"
              className="form-input"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Evening & Gala">Evening & Gala</option>
              <option value="Outerwear & Suits">Outerwear & Suits</option>
              <option value="Dresses">Dresses</option>
              <option value="Tops & Bodysuits">Tops & Bodysuits</option>
              <option value="Accessories & Bags">Accessories & Bags</option>
            </select>
          </div>

          <div className="form-group">
            <label>Badge Tag</label>
            <select
              className="form-select"
              value={formData.tag}
              onChange={e => setFormData({ ...formData, tag: e.target.value })}
            >
              <option value="Bestseller">Bestseller</option>
              <option value="New In">New In</option>
              <option value="Trending">Trending</option>
              <option value="Runway Exclusive">Runway Exclusive</option>
              <option value="">None</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (GH₵) *</label>
            <input
              type="number"
              required
              placeholder="1850"
              className="form-input"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Original / Strikethrough Price (GH₵)</label>
            <input
              type="number"
              placeholder="2200"
              className="form-input"
              value={formData.originalPrice}
              onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Available Stock Count</label>
            <input
              type="number"
              placeholder="15"
              className="form-input"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Available Sizes (comma separated)</label>
            <input
              type="text"
              placeholder="XS, S, M, L, XL"
              className="form-input"
              value={formData.sizesText}
              onChange={e => setFormData({ ...formData, sizesText: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Color Options (Format: Color Name (#HEX))</label>
            <input
              type="text"
              placeholder="Deep Burgundy (#4A0E23), Blush Rose (#E8A598), Pearl White (#FFFFFF)"
              className="form-input"
              value={formData.colorsText}
              onChange={e => setFormData({ ...formData, colorsText: e.target.value })}
            />
          </div>

          {/* Product Photos Section */}
          <div className="form-group form-grid-full">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Product Image URLs & Direct Uploads</span>
              <button
                type="button"
                onClick={handleAddImageField}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E8A598',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                <span>Add Image</span>
              </button>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {img && (
                    <img
                      src={img}
                      alt="preview"
                      style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(232,165,152,0.3)' }}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                  />
                  <label
                    style={{
                      background: 'rgba(232, 165, 152, 0.15)',
                      border: '1px solid rgba(232, 165, 152, 0.3)',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#E8A598'
                    }}
                    title="Upload image from computer"
                  >
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleFileUpload(e, idx)}
                    />
                  </label>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(idx)}
                      style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group form-grid-full">
            <label>Product Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Detailed description of the garment cut, fabric luxury, styling suggestions..."
              className="form-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Garment Features & Care (One per line)</label>
            <textarea
              rows={3}
              placeholder="Internal steel-boned corset support&#10;100% Mulberry silk&#10;Concealed zipper"
              className="form-textarea"
              value={formData.featuresText}
              onChange={e => setFormData({ ...formData, featuresText: e.target.value })}
            />
          </div>

          <div className="form-grid-full" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              <span>{isEditMode ? 'Save Product Changes' : 'Publish Product to Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
