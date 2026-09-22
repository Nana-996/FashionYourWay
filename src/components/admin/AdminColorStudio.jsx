import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DEFAULT_THEME_COLORS,
  PRESET_THEMES,
  applyThemeColors,
  hexToRgba
} from '../../utils/themeEngine';
import {
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Eye,
  Save,
  Sliders,
  Sun,
  Layout,
  ShoppingBag,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

// Quick Luxury Swatches for convenient 1-tap color picking
const LUXURY_QUICK_SWATCHES = [
  { name: 'Velvet Wine', hex: '#872046' },
  { name: 'Rose Deep', hex: '#B33D62' },
  { name: 'Blush Pink', hex: '#E8A598' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Imperial Emerald', hex: '#0A3822' },
  { name: 'Mint Jade', hex: '#10B981' },
  { name: 'Midnight Sapphire', hex: '#0F2B59' },
  { name: 'Ice Blue', hex: '#93C5FD' },
  { name: 'Obsidian Noir', hex: '#0A0A0A' },
  { name: 'Charcoal Silk', hex: '#1C1917' },
  { name: 'Royal Amethyst', hex: '#581C87' },
  { name: 'Lavender Blush', hex: '#C084FC' },
  { name: 'Espresso Mocha', hex: '#451A03' },
  { name: 'Cashmere Cream', hex: '#FFF5F7' }
];

export const AdminColorStudio = () => {
  const {
    storeInfo,
    updateThemeColors,
    resetThemeColors,
    setCurrentView,
    formatCurrency,
    showToast
  } = useStore();

  // Local working colors state (synced with storeInfo.themeColors)
  const [colors, setColors] = useState(() => ({
    ...DEFAULT_THEME_COLORS,
    ...(storeInfo?.themeColors || {})
  }));

  const [activeSectionTab, setActiveSectionTab] = useState('global');
  const [activePresetId, setActivePresetId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state when storeInfo changes externally
  useEffect(() => {
    if (storeInfo?.themeColors) {
      setColors({
        ...DEFAULT_THEME_COLORS,
        ...storeInfo.themeColors
      });
    }
  }, [storeInfo?.themeColors]);

  // Handle color change for a specific property
  const handleColorChange = (key, value) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    setHasUnsavedChanges(true);
    setActivePresetId(null);
    // Instant real-time preview across the site
    applyThemeColors(updated);
  };

  // Apply a 1-click preset
  const handleApplyPreset = (preset) => {
    const newColors = { ...DEFAULT_THEME_COLORS, ...preset.colors };
    setColors(newColors);
    setActivePresetId(preset.id);
    setHasUnsavedChanges(true);
    // Instant real-time preview
    applyThemeColors(newColors);
    showToast('Theme Preset Applied ✨', `${preset.name} loaded. Click "Save & Publish" to keep changes permanently.`, 'info');
  };

  // Save changes to StoreContext & Cloud
  const handleSave = () => {
    updateThemeColors(colors);
    setHasUnsavedChanges(false);
  };

  // Revert back to default Pink Burgundy Luxury
  const handleReset = () => {
    if (window.confirm('Reset all site colors back to the original Pink Burgundy Luxury palette?')) {
      resetThemeColors();
      setColors({ ...DEFAULT_THEME_COLORS });
      setActivePresetId('pink-burgundy');
      setHasUnsavedChanges(false);
    }
  };

  // Sections definition for "Where they want" customization
  const sections = [
    { id: 'global', label: '🌟 Global Core Palette', desc: 'Main brand tones, site background, card surfaces, and text' },
    { id: 'announcement', label: '📢 Announcement Bar', desc: 'Top promotional ribbon across the site' },
    { id: 'header', label: '🧭 Header & Navigation', desc: 'Sticky navbar, brand logo, nav links, and shopping bag badge' },
    { id: 'hero', label: '👑 Hero Section', desc: 'Ambient glow, tagline pill, and title highlights' },
    { id: 'catalog', label: '🛍️ Catalog & Cards', desc: 'Product card surfaces, borders, price tags, and badges' },
    { id: 'buttons', label: '🔘 Buttons & CTAs', desc: 'Primary action buttons, secondary buttons, and hover styles' },
    { id: 'footer', label: '🏛️ Luxury Footer', desc: 'Bottom brand manifesto, links, heading colors, and glow' }
  ];

  // Helper component for a color field with picker and swatches
  const ColorField = ({ label, propKey, description, showSwatches = true }) => {
    const value = colors[propKey] || '#FFFFFF';
    const isGradient = typeof value === 'string' && value.includes('gradient');

    return (
      <div
        style={{
          background: 'rgba(255, 240, 243, 0.03)',
          border: '1px solid rgba(232, 165, 152, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <label style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-cream)', display: 'block' }}>
              {label}
            </label>
            {description && (
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.6)', marginTop: '2px', display: 'block' }}>
                {description}
              </span>
            )}
          </div>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: value,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
          />
        </div>

        {/* Input Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {!isGradient && (
            <input
              type="color"
              value={value.startsWith('#') ? value : '#872046'}
              onChange={(e) => handleColorChange(propKey, e.target.value)}
              style={{
                width: '42px',
                height: '38px',
                padding: '2px',
                borderRadius: '8px',
                border: '1px solid rgba(232, 165, 152, 0.3)',
                background: 'rgba(20, 3, 11, 0.6)',
                cursor: 'pointer'
              }}
              title="Click to open color wheel"
            />
          )}

          <input
            type="text"
            value={value}
            onChange={(e) => handleColorChange(propKey, e.target.value)}
            placeholder="#HEX or rgba()"
            style={{
              flex: 1,
              minWidth: '140px',
              background: 'rgba(20, 3, 11, 0.7)',
              border: '1px solid rgba(232, 165, 152, 0.25)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#FFFFFF',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}
          />

          {/* Revert button for this field */}
          {DEFAULT_THEME_COLORS[propKey] && colors[propKey] !== DEFAULT_THEME_COLORS[propKey] && (
            <button
              onClick={() => handleColorChange(propKey, DEFAULT_THEME_COLORS[propKey])}
              style={{
                background: 'none',
                border: '1px solid rgba(232, 165, 152, 0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--color-blush)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              title="Revert to default color"
            >
              Default
            </button>
          )}
        </div>

        {/* Quick Swatches Bar */}
        {showSwatches && !isGradient && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255, 240, 243, 0.45)', marginRight: '4px' }}>Quick:</span>
            {LUXURY_QUICK_SWATCHES.slice(0, 7).map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => handleColorChange(propKey, swatch.hex)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: swatch.hex,
                  border: colors[propKey] === swatch.hex ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  padding: 0,
                  transform: colors[propKey] === swatch.hex ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}
                title={`${swatch.name} (${swatch.hex})`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-color-studio" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Studio Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(135, 32, 70, 0.2) 0%, rgba(32, 7, 20, 0.8) 100%)',
          border: '1px solid rgba(232, 165, 152, 0.25)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-wine), var(--color-blush))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Palette size={22} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-cream)', margin: 0 }}>
              Site Colors & Visual Theme Studio
            </h2>
          </div>
          <p style={{ color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.9rem', marginTop: '6px', maxWidth: '650px' }}>
            Fully customize the color palette for each section of your store. Pick from curated luxury presets or specify custom colors for the header, hero, cards, buttons, and footer.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCurrentView('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ gap: '8px' }}
          >
            <Eye size={15} />
            <span>View Full Site</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            style={{ gap: '8px' }}
            title="Reset to default Pink Burgundy palette"
          >
            <RotateCcw size={15} />
            <span>Reset Default</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            style={{
              gap: '8px',
              background: hasUnsavedChanges
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #872046 0%, #B33D62 50%, #E8A598 100%)',
              boxShadow: hasUnsavedChanges
                ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                : '0 4px 20px rgba(179, 61, 98, 0.4)'
            }}
          >
            <Save size={16} />
            <span>{hasUnsavedChanges ? 'Publish Changes Live ✨' : 'Colors Saved & Live'}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Notification Banner */}
      {hasUnsavedChanges && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6EE7B7', fontSize: '0.88rem' }}>
            <Sparkles size={18} />
            <span>
              <strong>Preview Mode Active:</strong> Colors are currently previewed live in this browser. Click <strong>"Publish Changes Live"</strong> to save them permanently for all visitors worldwide!
            </span>
          </div>
          <button
            onClick={handleSave}
            style={{
              background: '#10B981',
              color: '#03140C',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Publish Now
          </button>
        </div>
      )}

      {/* 1-Click Designer Themes Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--color-gold)" />
              <span>1-Click Designer Palettes</span>
            </h3>
            <p style={{ color: 'rgba(255, 240, 243, 0.65)', fontSize: '0.85rem' }}>
              Choose a signature high-fashion color palette to instantly re-theme your entire boutique.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {PRESET_THEMES.map((preset) => {
            const isCurrent = activePresetId === preset.id ||
              (!activePresetId && preset.id === 'pink-burgundy' && colors.primaryColor === DEFAULT_THEME_COLORS.primaryColor);

            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                style={{
                  background: isCurrent ? 'rgba(135, 32, 70, 0.25)' : 'rgba(32, 7, 20, 0.6)',
                  border: isCurrent ? '2px solid var(--color-gold)' : '1px solid rgba(232, 165, 152, 0.16)',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header with Title & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>
                      {preset.name}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-blush)', display: 'block', marginTop: '2px' }}>
                      {preset.subtitle}
                    </span>
                  </div>
                  {preset.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: isCurrent ? 'var(--color-gold)' : 'rgba(232, 165, 152, 0.15)',
                        color: isCurrent ? '#14030B' : 'var(--color-blush-light)'
                      }}
                    >
                      {preset.badge}
                    </span>
                  )}
                </div>

                {/* Color Swatch Strip */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {preset.previewColors.map((hex, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '24px',
                        borderRadius: '6px',
                        background: hex,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                      title={hex}
                    />
                  ))}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)', lineHeight: 1.4, margin: 0 }}>
                  {preset.description}
                </p>

                {/* Apply Button / Active Indicator */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <button
                    style={{
                      background: isCurrent ? 'var(--color-gold)' : 'rgba(255, 240, 243, 0.08)',
                      color: isCurrent ? '#14030B' : 'var(--color-cream)',
                      border: isCurrent ? 'none' : '1px solid rgba(232, 165, 152, 0.25)',
                      borderRadius: '999px',
                      padding: '5px 14px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isCurrent ? (
                      <>
                        <Check size={13} />
                        <span>Active Theme</span>
                      </>
                    ) : (
                      <span>Apply Palette</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Storefront Mockup Preview */}
      <div>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="var(--color-blush)" />
            <span>Live Interactive Preview</span>
          </h3>
          <p style={{ color: 'rgba(255, 240, 243, 0.65)', fontSize: '0.85rem' }}>
            See exactly how your chosen colors look across the boutique components in real time.
          </p>
        </div>

        <div
          style={{
            background: colors.bgMain,
            backgroundImage: `
              radial-gradient(circle at 15% 10%, ${hexToRgba(colors.primaryColor, 0.22)} 0%, transparent 40%),
              radial-gradient(circle at 85% 60%, ${hexToRgba(colors.primaryColor, 0.15)} 0%, transparent 50%),
              radial-gradient(circle at 50% 90%, ${hexToRgba(colors.secondaryColor, 0.12)} 0%, transparent 60%)
            `,
            border: `1px solid ${colors.cardBorder || 'rgba(232, 165, 152, 0.2)'}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* 1. Preview: Announcement Bar */}
          <div
            style={{
              background: colors.announcementBg,
              color: colors.announcementText,
              padding: '8px 16px',
              fontSize: '0.76rem',
              fontWeight: 500,
              textAlign: 'center',
              letterSpacing: '0.03em',
              borderBottom: `1px solid ${hexToRgba(colors.secondaryColor, 0.2)}`
            }}
          >
            ✨ RUNWAY DROP: Complimentary Delivery Nationwide on Orders Over GH₵ 800
          </div>

          {/* 2. Preview: Navbar */}
          <div
            style={{
              background: colors.navbarBg,
              borderBottom: `1px solid ${colors.navbarBorder || 'rgba(232, 165, 152, 0.18)'}`,
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: colors.primaryColor,
                  border: `1px solid ${colors.accentGold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGold,
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                👑
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${colors.textPrimary} 0%, ${colors.secondaryColor} 60%, ${colors.accentGold} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {storeInfo?.storeName || 'FashionYourWay'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: colors.navLinkActiveColor, fontWeight: 600 }}>Collection</span>
              <span style={{ fontSize: '0.8rem', color: colors.navLinkColor }}>Shop All</span>
              <span style={{ fontSize: '0.8rem', color: colors.navLinkColor }}>Concierge</span>
              <div
                style={{
                  background: colors.cartBadgeBg,
                  color: colors.cartBadgeText || '#FFFFFF',
                  borderRadius: '999px',
                  padding: '3px 9px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ShoppingBag size={12} />
                <span>2</span>
              </div>
            </div>
          </div>

          {/* 3. Preview: Hero & Card Area */}
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: colors.heroPillBg,
                  color: colors.heroPillText,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px'
                }}
              >
                <Sparkles size={11} />
                <span>Autumn / Winter Edit</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: colors.textPrimary,
                  lineHeight: 1.15,
                  marginBottom: '8px'
                }}
              >
                Make Them Look{' '}
                <span
                  style={{
                    color: colors.heroTitleHighlight,
                    fontStyle: 'italic'
                  }}
                >
                  Twice.
                </span>
              </h3>

              <p style={{ color: colors.textSecondary, fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '16px' }}>
                Fashion designed to match your mood, your confidence, and your individuality.
              </p>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  style={{
                    background: colors.btnPrimaryBg,
                    color: colors.btnPrimaryText,
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 20px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${hexToRgba(colors.primaryColor, 0.4)}`
                  }}
                >
                  Shop Collection
                </button>
                <button
                  style={{
                    background: colors.btnSecondaryBg,
                    color: colors.btnSecondaryText,
                    border: `1px solid ${colors.btnSecondaryBorder || 'rgba(232, 165, 152, 0.25)'}`,
                    borderRadius: '999px',
                    padding: '8px 18px',
                    fontWeight: 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Featured Piece
                </button>
              </div>
            </div>

            {/* Preview: Product Card */}
            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
              }}
            >
              <div
                style={{
                  height: '110px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.bgCard} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: colors.cardTagBg,
                    color: colors.cardTagText,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  Bespoke
                </span>
                <span style={{ fontSize: '2rem' }}>👗</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: colors.secondaryColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Evening Gala
                </span>
                <h5 style={{ fontSize: '0.9rem', color: colors.textPrimary, margin: '2px 0 4px', fontWeight: 600 }}>
                  Aurelia Velvet Gown
                </h5>
                <span style={{ fontSize: '0.92rem', color: colors.cardPriceColor, fontWeight: 700 }}>
                  {formatCurrency(1250)}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Preview: Footer */}
          <div
            style={{
              background: colors.footerBg,
              borderTop: `1px solid ${colors.footerBorder || 'rgba(232, 165, 152, 0.12)'}`,
              padding: '14px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: colors.footerText
            }}
          >
            <div>
              <span style={{ color: colors.footerHeadingColor, fontWeight: 600 }}>{storeInfo?.storeName || 'FashionYourWay'}</span>
              <span style={{ marginLeft: '8px', opacity: 0.8 }}>© 2026 Haute Couture Edition</span>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Concierge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section-by-Section "Where They Want" Color Customizer */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--color-gold)" />
            <span>Customize Colors By Site Section</span>
          </h3>
          <p style={{ color: 'rgba(255, 240, 243, 0.65)', fontSize: '0.85rem' }}>
            Choose which area of the website you want to adjust and select your exact desired colors.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(232, 165, 152, 0.15)',
            marginBottom: '20px'
          }}
        >
          {sections.map((sec) => {
            const isActive = activeSectionTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionTab(sec.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: isActive ? 'linear-gradient(135deg, var(--color-wine), var(--color-rose-deep))' : 'rgba(255, 240, 243, 0.05)',
                  border: isActive ? '1px solid var(--color-blush)' : '1px solid rgba(232, 165, 152, 0.15)',
                  color: isActive ? '#FFFFFF' : 'rgba(255, 240, 243, 0.75)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Section Customizer Fields */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {/* TAB 1: Global Core Palette */}
          {activeSectionTab === 'global' && (
            <>
              <ColorField
                label="Primary Brand Accent Color"
                propKey="primaryColor"
                description="Dominant luxury accent used for major buttons, highlights, badges, and glows"
              />
              <ColorField
                label="Secondary Accent / Blush"
                propKey="secondaryColor"
                description="Subtle accent used for borders, subtitle highlights, and soft badges"
              />
              <ColorField
                label="Luxury Gold Accent"
                propKey="accentGold"
                description="Gold highlight used for VIP emblems, stars, and exclusive tags"
              />
              <ColorField
                label="Main Page Background (Canvas)"
                propKey="bgMain"
                description="Base canvas color behind the entire storefront and pages"
              />
              <ColorField
                label="Card & Surface Background"
                propKey="bgCard"
                description="Background color for product cards, modals, and drawers"
              />
              <ColorField
                label="Primary Text Color"
                propKey="textPrimary"
                description="Color for main titles, headings, and prominent text"
              />
              <ColorField
                label="Secondary / Subtitle Text"
                propKey="textSecondary"
                description="Color for subtitles, taglines, and muted captions"
              />
            </>
          )}

          {/* TAB 2: Announcement Bar */}
          {activeSectionTab === 'announcement' && (
            <>
              <ColorField
                label="Announcement Bar Background"
                propKey="announcementBg"
                description="Background color or gradient for the top promo bar"
              />
              <ColorField
                label="Announcement Bar Text Color"
                propKey="announcementText"
                description="Text color for the announcement message"
              />
            </>
          )}

          {/* TAB 3: Header & Navigation */}
          {activeSectionTab === 'header' && (
            <>
              <ColorField
                label="Navbar Background (Glass / Solid)"
                propKey="navbarBg"
                description="Sticky header background color with blur transparency"
              />
              <ColorField
                label="Nav Links Color"
                propKey="navLinkColor"
                description="Default text color for desktop navigation links"
              />
              <ColorField
                label="Nav Links Active / Hover Color"
                propKey="navLinkActiveColor"
                description="Color when a navigation link is hovered or active"
              />
              <ColorField
                label="Shopping Bag Badge Background"
                propKey="cartBadgeBg"
                description="Notification bubble background on the shopping cart icon"
              />
              <ColorField
                label="Shopping Bag Badge Text"
                propKey="cartBadgeText"
                description="Text color inside the cart count bubble"
              />
            </>
          )}

          {/* TAB 4: Hero Section */}
          {activeSectionTab === 'hero' && (
            <>
              <ColorField
                label="Hero Ambient Glow Hue"
                propKey="heroGlowColor"
                description="Radial glowing backdrop color behind the hero section"
              />
              <ColorField
                label="Hero Tagline Pill Background"
                propKey="heroPillBg"
                description="Background for the 'Autumn / Winter Edit' badge"
              />
              <ColorField
                label="Hero Tagline Pill Text"
                propKey="heroPillText"
                description="Text color for the tagline pill"
              />
              <ColorField
                label="Hero Title Highlight Color"
                propKey="heroTitleHighlight"
                description="Color or gradient tone for highlighted title words (e.g. 'Twice.')"
              />
            </>
          )}

          {/* TAB 5: Catalog & Cards */}
          {activeSectionTab === 'catalog' && (
            <>
              <ColorField
                label="Product Card Background"
                propKey="cardBg"
                description="Card surface background for each piece in the catalog"
              />
              <ColorField
                label="Product Card Border Color"
                propKey="cardBorder"
                description="Subtle perimeter border around each product card"
              />
              <ColorField
                label="Price Tag Text Color"
                propKey="cardPriceColor"
                description="Highlight color for product prices in Ghana Cedi"
              />
              <ColorField
                label="Bespoke / Exclusive Tag Badge"
                propKey="cardTagBg"
                description="Background for the badge pill on product images"
              />
              <ColorField
                label="Tag Badge Text Color"
                propKey="cardTagText"
                description="Text color inside the product badge pill"
              />
            </>
          )}

          {/* TAB 6: Buttons & CTAs */}
          {activeSectionTab === 'buttons' && (
            <>
              <ColorField
                label="Primary Button Background (or Gradient)"
                propKey="btnPrimaryBg"
                description="Call-to-action button background (e.g. 'Shop Collection', 'Add to Bag')"
              />
              <ColorField
                label="Primary Button Text Color"
                propKey="btnPrimaryText"
                description="Text color inside primary action buttons"
              />
              <ColorField
                label="Secondary Button Background"
                propKey="btnSecondaryBg"
                description="Background for secondary outline buttons"
              />
              <ColorField
                label="Secondary Button Text Color"
                propKey="btnSecondaryText"
                description="Text color for secondary buttons"
              />
            </>
          )}

          {/* TAB 7: Luxury Footer */}
          {activeSectionTab === 'footer' && (
            <>
              <ColorField
                label="Footer Background"
                propKey="footerBg"
                description="Base background color for the bottom luxury footer"
              />
              <ColorField
                label="Footer Text & Links Color"
                propKey="footerText"
                description="Color for footer paragraphs, links, and contact details"
              />
              <ColorField
                label="Footer Column Headings"
                propKey="footerHeadingColor"
                description="Color for column titles (e.g. 'Collections', 'Boutique Atelier')"
              />
              <ColorField
                label="Footer Ambient Glow"
                propKey="footerGlowColor"
                description="Soft atmospheric glow color at the top of the footer"
              />
            </>
          )}
        </div>
      </div>

      {/* Bottom Floating/Sticky Action Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: '20px',
          background: 'rgba(20, 3, 11, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(232, 165, 152, 0.3)',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: hasUnsavedChanges ? '#EAB308' : '#10B981',
              boxShadow: hasUnsavedChanges ? '0 0 10px #EAB308' : '0 0 10px #10B981'
            }}
          />
          <span style={{ fontSize: '0.88rem', color: 'var(--color-cream)', fontWeight: 500 }}>
            {hasUnsavedChanges
              ? 'You have unsaved color adjustments (previewing live)'
              : 'All colors published & live for all site visitors'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            style={{ gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Reset Default</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            style={{
              gap: '8px',
              background: hasUnsavedChanges
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #872046 0%, #B33D62 50%, #E8A598 100%)',
              boxShadow: hasUnsavedChanges
                ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                : '0 4px 20px rgba(179, 61, 98, 0.4)'
            }}
          >
            <Save size={15} />
            <span>{hasUnsavedChanges ? 'Publish Changes Live ✨' : 'Colors Saved'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
