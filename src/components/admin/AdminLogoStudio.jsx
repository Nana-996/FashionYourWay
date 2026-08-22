import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../BrandLogo';
import {
  Upload,
  Sparkles,
  Crown,
  Gem,
  ShieldCheck,
  Scissors,
  Feather,
  Sliders,
  Maximize2,
  Minimize2,
  Sun,
  Palette,
  Layout,
  Eye,
  Save,
  RotateCcw,
  Trash2,
  Check,
  CheckCircle2,
  Layers,
  Smartphone,
  FileText,
  ShoppingBag
} from 'lucide-react';

export const AdminLogoStudio = () => {
  const { storeInfo, updateStoreInfo } = useStore();

  const [logoConfig, setLogoConfig] = useState({
    storeName: storeInfo.storeName || 'FashionYourWay',
    tagline: storeInfo.tagline || 'HAUTE COUTURE & READY-TO-WEAR',
    logoUrl: storeInfo.logoUrl || null,
    logoType: storeInfo.logoType || (storeInfo.logoUrl ? 'image' : 'preset'),
    logoPreset: storeInfo.logoPreset || 'crown',
    logoHeight: storeInfo.logoHeight || 44,
    logoScale: storeInfo.logoScale ?? 100,
    logoPadding: storeInfo.logoPadding ?? 4,
    logoShape: storeInfo.logoShape || 'circle',
    logoFilter: storeInfo.logoFilter || 'none',
    logoBgColor: storeInfo.logoBgColor || 'glass',
    logoDisplayMode: storeInfo.logoDisplayMode || 'both',
    logoLayout: storeInfo.logoLayout || 'horizontal'
  });

  const [urlInput, setUrlInput] = useState('');
  const [activePreviewSurface, setActivePreviewSurface] = useState('navbar'); // 'navbar' | 'footer' | 'receipt' | 'mobile'
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpdate = (field, val) => {
    setLogoConfig(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoConfig(prev => ({
        ...prev,
        logoUrl: e.target.result,
        logoType: 'image'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlLoad = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setLogoConfig(prev => ({
        ...prev,
        logoUrl: urlInput.trim(),
        logoType: 'image'
      }));
      setUrlInput('');
    }
  };

  const handleSelectPreset = (presetName) => {
    setLogoConfig(prev => ({
      ...prev,
      logoPreset: presetName,
      logoType: 'preset',
      logoUrl: null
    }));
  };

  const handleRemoveLogo = () => {
    setLogoConfig(prev => ({
      ...prev,
      logoUrl: null,
      logoType: 'text',
      logoDisplayMode: 'text-only'
    }));
  };

  const handleResetDefaults = () => {
    setLogoConfig({
      storeName: storeInfo.storeName || 'FashionYourWay',
      tagline: storeInfo.tagline || 'HAUTE COUTURE & READY-TO-WEAR',
      logoUrl: null,
      logoType: 'preset',
      logoPreset: 'crown',
      logoHeight: 44,
      logoScale: 100,
      logoPadding: 4,
      logoShape: 'circle',
      logoFilter: 'none',
      logoBgColor: 'glass',
      logoDisplayMode: 'both',
      logoLayout: 'horizontal'
    });
  };

  const handleSaveToApp = () => {
    updateStoreInfo(logoConfig);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 4500);
  };

  const presets = [
    { id: 'crown', name: 'Royal Crown', icon: <Crown size={20} color="#D4AF37" /> },
    { id: 'gem', name: 'Haute Gem', icon: <Gem size={20} color="#E8A598" /> },
    { id: 'sparkle', name: 'Starlight', icon: <Sparkles size={20} color="#F3E5AB" /> },
    { id: 'crest', name: 'Atelier Crest', icon: <ShieldCheck size={20} color="#86EFAC" /> },
    { id: 'scissors', name: 'Tailor Craft', icon: <Scissors size={20} color="#D8B4FE" /> },
    { id: 'feather', name: 'Silk Feather', icon: <Feather size={20} color="#E8A598" /> }
  ];

  return (
    <div className="logo-studio-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(74, 14, 35, 0.6) 0%, rgba(20, 3, 11, 0.95) 100%)',
          border: '1px solid rgba(232, 165, 152, 0.3)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Sparkles size={22} color="#D4AF37" />
            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0 }}>Brand Logo & Emblem Studio</h2>
            <span className="badge badge-gold">Interactive Customizer</span>
          </div>
          <p style={{ color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.9rem', maxWidth: '780px' }}>
            Upload custom graphics, adjust dimensions, apply luxury color filters, and configure framing shapes. All changes apply live across the Navbar, Footer, Mobile view, and Order receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetDefaults}
            style={{ gap: '6px' }}
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveToApp}
            style={{ gap: '8px', padding: '12px 28px' }}
          >
            <Save size={17} />
            <span>Apply Logo to App</span>
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.18)',
            border: '1px solid rgba(34, 197, 94, 0.45)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#86EFAC',
            fontSize: '0.95rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <CheckCircle2 size={20} />
          <span><strong>Custom Logo Saved & Applied!</strong> The website header, footer, checkout, and order receipts have been updated.</span>
        </div>
      )}

      {/* Main Studio Grid: Left Controls | Right Live Multi-View Preview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Editing Tools & Customizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Logo Upload & Source */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="#E8A598" />
              <span>1. Logo Source & Upload</span>
            </h4>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: dragOver ? '2px dashed #E8A598' : '2px dashed rgba(232, 165, 152, 0.3)',
                background: dragOver ? 'rgba(232, 165, 152, 0.1)' : 'rgba(20, 3, 11, 0.5)',
                borderRadius: '12px',
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(232, 165, 152, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E8A598'
                  }}
                >
                  <Upload size={22} />
                </div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.95rem' }}>
                  Click to Upload or Drag & Drop Logo
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 240, 243, 0.6)', margin: 0 }}>
                  PNG with transparent background, SVG vector, or high-res JPG (Max 5MB)
                </p>
              </div>
            </div>

            {/* URL Input */}
            <form onSubmit={handleUrlLoad} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Or paste direct image URL (https://...)"
                className="form-input"
                style={{ flex: 1, fontSize: '0.86rem' }}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Import URL
              </button>
            </form>

            {/* Quick Luxury Presets Picker */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-blush)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '10px' }}>
                Or Select a Curated Luxury Emblem Preset:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {presets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      background: (logoConfig.logoType === 'preset' && logoConfig.logoPreset === p.id)
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'rgba(255, 240, 243, 0.05)',
                      border: (logoConfig.logoType === 'preset' && logoConfig.logoPreset === p.id)
                        ? '1px solid #D4AF37'
                        : '1px solid rgba(232, 165, 152, 0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {p.icon}
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {logoConfig.logoUrl && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F87171',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Remove Custom Image</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Logo Editing & Dimensions */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#E8A598" />
              <span>2. Dimensions, Scale & Safe Padding</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Size / Height Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <label style={{ fontWeight: 600, color: '#FFFFFF' }}>Logo Height / Frame Size</label>
                  <span style={{ color: '#E8A598', fontWeight: 600 }}>{logoConfig.logoHeight}px</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="90"
                  value={logoConfig.logoHeight}
                  onChange={(e) => handleUpdate('logoHeight', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#B33D62', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {[
                    { label: 'Compact (36px)', val: 36 },
                    { label: 'Standard (44px)', val: 44 },
                    { label: 'Prominent (58px)', val: 58 },
                    { label: 'Statement (72px)', val: 72 }
                  ].map(b => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => handleUpdate('logoHeight', b.val)}
                      style={{
                        padding: '4px 10px',
                        background: logoConfig.logoHeight === b.val ? 'rgba(232, 165, 152, 0.25)' : 'rgba(255, 240, 243, 0.05)',
                        border: logoConfig.logoHeight === b.val ? '1px solid #E8A598' : '1px solid rgba(232, 165, 152, 0.15)',
                        borderRadius: '4px',
                        color: logoConfig.logoHeight === b.val ? '#FFFFFF' : 'rgba(255, 240, 243, 0.7)',
                        fontSize: '0.74rem',
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Scale / Zoom */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <label style={{ fontWeight: 600, color: '#FFFFFF' }}>Graphic Zoom / Scale Factor</label>
                  <span style={{ color: '#E8A598', fontWeight: 600 }}>{logoConfig.logoScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={logoConfig.logoScale}
                  onChange={(e) => handleUpdate('logoScale', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#B33D62', cursor: 'pointer' }}
                />
              </div>

              {/* Padding */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <label style={{ fontWeight: 600, color: '#FFFFFF' }}>Internal Safe Padding</label>
                  <span style={{ color: '#E8A598', fontWeight: 600 }}>{logoConfig.logoPadding}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={logoConfig.logoPadding}
                  onChange={(e) => handleUpdate('logoPadding', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#B33D62', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Framing Shapes, Filters & Treatments */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} color="#E8A598" />
              <span>3. Framing Shape & Visual Lighting Treatment</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Badge Shape */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Emblem Badge Shape
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'circle', label: 'Circular Ring' },
                    { id: 'rounded', label: 'Rounded Glass' },
                    { id: 'diamond', label: 'Haute Diamond' },
                    { id: 'square', label: 'Sleek Square' },
                    { id: 'natural', label: 'Natural Contour' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleUpdate('logoShape', s.id)}
                      style={{
                        padding: '10px 8px',
                        textAlign: 'center',
                        background: logoConfig.logoShape === s.id ? 'rgba(232, 165, 152, 0.25)' : 'rgba(255, 240, 243, 0.05)',
                        border: logoConfig.logoShape === s.id ? '1px solid #E8A598' : '1px solid rgba(232, 165, 152, 0.15)',
                        borderRadius: '6px',
                        color: logoConfig.logoShape === s.id ? '#FFFFFF' : 'rgba(255, 240, 243, 0.75)',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Enhancement Filter */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Color & Lighting Filter (Optimized for Dark Theme)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'Original Colors', desc: 'No Filter' },
                    { id: 'white', label: 'Crisp White', desc: 'Inverts Dark Logos' },
                    { id: 'gold', label: 'Champagne Gold', desc: 'Luxury Shimmer' },
                    { id: 'rose', label: 'Rose Blush', desc: 'Atelier Glow' },
                    { id: 'contrast', label: 'High Contrast', desc: 'Sharpened' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleUpdate('logoFilter', f.id)}
                      style={{
                        padding: '8px 10px',
                        textAlign: 'left',
                        background: logoConfig.logoFilter === f.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 240, 243, 0.05)',
                        border: logoConfig.logoFilter === f.id ? '1px solid #D4AF37' : '1px solid rgba(232, 165, 152, 0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255, 240, 243, 0.6)' }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Background */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Frame Backdrop Fill
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'glass', label: 'Dark Velvet Glass' },
                    { id: 'burgundy', label: 'Royal Burgundy' },
                    { id: 'gold-tint', label: 'Gold Shimmer' },
                    { id: 'white', label: 'Pure White Card' },
                    { id: 'transparent', label: 'Transparent' }
                  ].map(bg => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleUpdate('logoBgColor', bg.id)}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        background: logoConfig.logoBgColor === bg.id ? 'rgba(232, 165, 152, 0.25)' : 'rgba(255, 240, 243, 0.05)',
                        border: logoConfig.logoBgColor === bg.id ? '1px solid #E8A598' : '1px solid rgba(232, 165, 152, 0.15)',
                        borderRadius: '6px',
                        color: logoConfig.logoBgColor === bg.id ? '#FFFFFF' : 'rgba(255, 240, 243, 0.75)',
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Mode & Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                    Display Mode
                  </label>
                  <select
                    className="form-select"
                    value={logoConfig.logoDisplayMode}
                    onChange={(e) => handleUpdate('logoDisplayMode', e.target.value)}
                  >
                    <option value="both">Logo Graphic + Brand Text</option>
                    <option value="logo-only">Logo Graphic Only</option>
                    <option value="text-only">Brand Text Only</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                    Alignment Layout
                  </label>
                  <select
                    className="form-select"
                    value={logoConfig.logoLayout}
                    onChange={(e) => handleUpdate('logoLayout', e.target.value)}
                  >
                    <option value="horizontal">Horizontal (Inline)</option>
                    <option value="stacked">Stacked (Emblem Above)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Multi-Surface Live Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8A598', fontWeight: 600 }}>
                <Eye size={18} />
                <span>Live Multi-Placement Simulator</span>
              </div>
              <span className="badge badge-blush">Real-time</span>
            </div>

            {/* Preview Surface Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                background: 'rgba(14, 2, 7, 0.8)',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid rgba(232, 165, 152, 0.15)',
                marginBottom: '20px'
              }}
            >
              {[
                { id: 'navbar', label: 'Navbar Header', icon: <Layers size={14} /> },
                { id: 'footer', label: 'Store Footer', icon: <FileText size={14} /> },
                { id: 'receipt', label: 'Order Receipt', icon: <ShoppingBag size={14} /> },
                { id: 'mobile', label: 'Mobile Header', icon: <Smartphone size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePreviewSurface(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 6px',
                    borderRadius: '6px',
                    background: activePreviewSurface === tab.id ? 'linear-gradient(135deg, #6A1735, #B33D62)' : 'transparent',
                    color: activePreviewSurface === tab.id ? '#FFFFFF' : 'rgba(255, 240, 243, 0.65)',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* PREVIEW 1: Navbar Header Simulation */}
            {activePreviewSurface === 'navbar' && (
              <div
                style={{
                  background: 'rgba(32, 7, 20, 0.95)',
                  border: '1px solid rgba(232, 165, 152, 0.25)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#E8A598', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Sticky Glass Header Bar
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(232,165,152,0.1)', paddingBottom: '14px' }}>
                  <BrandLogo customConfig={logoConfig} />
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.82rem', color: 'rgba(255,240,243,0.7)' }}>
                    <span>Collection</span>
                    <span>Shop All</span>
                    <span>Concierge</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,240,243,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={15} color="#E8A598" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW 2: Footer Simulation */}
            {activePreviewSurface === 'footer' && (
              <div
                style={{
                  background: '#12020A',
                  border: '1px solid rgba(232, 165, 152, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#E8A598', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Luxury Footer Presentation
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <BrandLogo customConfig={logoConfig} size="lg" />
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 240, 243, 0.6)', lineHeight: '1.5', margin: 0 }}>
                    Bespoke luxury silhouettes crafted from rich velvets and pure silks. Designed to match your confidence.
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#E8A598', marginTop: '4px' }}>
                    Plot 24, Lagos Avenue, East Legon &middot; Accra, Ghana
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW 3: Order Receipt Simulation */}
            {activePreviewSurface === 'receipt' && (
              <div
                style={{
                  background: '#1A040F',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(232,165,152,0.15)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <BrandLogo customConfig={logoConfig} size="sm" />
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Official Invoice</span>
                    <div style={{ fontSize: '0.75rem', color: '#E8A598', marginTop: '4px' }}>#FYW-94821</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,240,243,0.8)' }}>
                  <span>Aurelia Velvet Gala Gown</span>
                  <strong style={{ color: '#FFFFFF' }}>GH₵ 1,850</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid rgba(232,165,152,0.1)', marginTop: '12px', paddingTop: '8px' }}>
                  <span style={{ color: '#E8A598' }}>Total Amount Paid:</span>
                  <strong style={{ color: '#D4AF37' }}>GH₵ 1,850</strong>
                </div>
              </div>
            )}

            {/* PREVIEW 4: Mobile Screen Simulation */}
            {activePreviewSurface === 'mobile' && (
              <div
                style={{
                  maxWidth: '300px',
                  margin: '0 auto',
                  background: '#14030B',
                  border: '2px solid rgba(232, 165, 152, 0.35)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)'
                }}
              >
                {/* Simulated Notch */}
                <div style={{ height: '18px', background: '#0D0107', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px' }} />
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(32, 7, 20, 0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(232,165,152,0.15)' }}>
                  <BrandLogo customConfig={logoConfig} size="sm" showSub={false} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,240,243,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={14} color="#E8A598" />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#E8A598', fontWeight: 600 }}>Make Them Look Twice</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,240,243,0.6)', marginTop: '4px' }}>Autumn / Winter 2026 Collection</div>
                </div>
              </div>
            )}

            {/* Quick Apply Button in Preview Box */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveToApp}
                style={{ width: '100%', gap: '10px' }}
              >
                <Save size={17} />
                <span>Save & Publish Logo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
