import React from 'react';
import { useStore } from '../context/StoreContext';
import { Crown, Sparkles, Gem, ShieldCheck, Scissors, Feather } from 'lucide-react';

export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | number
  showSub = true,
  customConfig = null,
  onClick = null,
  className = ''
}) => {
  const { storeInfo } = useStore();
  const config = customConfig || storeInfo || {};

  const storeName = config.storeName || 'FashionYourWay';
  const tagline = config.tagline || 'HAUTE COUTURE & READY-TO-WEAR';

  // Config parameters with fallbacks
  const logoType = config.logoType || (config.logoUrl ? 'image' : 'preset');
  const logoUrl = config.logoUrl || null;
  const logoPreset = config.logoPreset || 'crown';
  const logoHeight = typeof size === 'number' ? size : (config.logoHeight || 44);
  const logoScale = config.logoScale ?? 100;
  const logoPadding = config.logoPadding ?? 4;
  const logoShape = config.logoShape || 'circle';
  const logoFilter = config.logoFilter || 'none';
  const logoBgColor = config.logoBgColor || 'glass';
  const logoDisplayMode = config.logoDisplayMode || 'both'; // 'both' | 'logo-only' | 'text-only'
  const logoLayout = config.logoLayout || 'horizontal'; // 'horizontal' | 'stacked'

  // Filter styles for logo graphic
  const getFilterStyle = () => {
    switch (logoFilter) {
      case 'white':
        return 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.4))';
      case 'gold':
        return 'sepia(1) saturate(5) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 8px rgba(212,175,55,0.4))';
      case 'rose':
        return 'sepia(0.8) saturate(4) hue-rotate(300deg) brightness(1.05) drop-shadow(0 0 8px rgba(232,165,152,0.4))';
      case 'contrast':
        return 'contrast(1.3) brightness(1.05)';
      default:
        return 'none';
    }
  };

  // Background styling for the logo frame
  const getBgStyle = () => {
    switch (logoBgColor) {
      case 'transparent':
        return 'transparent';
      case 'glass':
        return 'linear-gradient(135deg, rgba(74, 14, 35, 0.6) 0%, rgba(20, 3, 11, 0.85) 100%)';
      case 'burgundy':
        return 'linear-gradient(135deg, #6A1735 0%, #2B0715 100%)';
      case 'white':
        return '#FFFFFF';
      case 'gold-tint':
        return 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(32, 7, 20, 0.8) 100%)';
      default:
        return 'rgba(255, 240, 243, 0.06)';
    }
  };

  // Border & shape
  const getBorderRadius = () => {
    switch (logoShape) {
      case 'circle': return '50%';
      case 'rounded': return '12px';
      case 'square': return '4px';
      case 'diamond': return '30% 70% 70% 30% / 30% 30% 70% 70%';
      case 'natural': return '0px';
      default: return '50%';
    }
  };

  const getBorder = () => {
    if (logoShape === 'natural') return 'none';
    if (logoBgColor === 'white') return '1px solid rgba(255, 255, 255, 0.8)';
    return '1px solid rgba(232, 165, 152, 0.35)';
  };

  // Preset Luxury Emblem renderer
  const renderPresetEmblem = (iconSize) => {
    const iconColor = logoBgColor === 'white' ? '#4A0E23' : '#D4AF37';
    switch (logoPreset) {
      case 'sparkle':
        return <Sparkles size={iconSize} color={iconColor} />;
      case 'gem':
        return <Gem size={iconSize} color={iconColor} />;
      case 'crest':
        return <ShieldCheck size={iconSize} color={iconColor} />;
      case 'scissors':
        return <Scissors size={iconSize} color={iconColor} />;
      case 'feather':
        return <Feather size={iconSize} color={iconColor} />;
      case 'crown':
      default:
        return <Crown size={iconSize} color={iconColor} />;
    }
  };

  // Size scale factors
  const computedHeight = typeof size === 'number'
    ? size
    : size === 'sm' ? 32 : size === 'lg' ? 56 : size === 'xl' ? 72 : logoHeight;

  const frameSize = computedHeight;
  const iconSize = Math.round(computedHeight * 0.55 * (logoScale / 100));

  const shouldRenderLogoGraphic = logoDisplayMode !== 'text-only' && (logoUrl || logoType === 'preset');
  const shouldRenderText = logoDisplayMode !== 'logo-only';

  return (
    <div
      className={`brand-logo-container ${logoLayout === 'stacked' ? 'stacked' : 'inline'} ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: logoLayout === 'stacked' ? 'center' : 'center',
        flexDirection: logoLayout === 'stacked' ? 'column' : 'row',
        gap: logoLayout === 'stacked' ? '8px' : '14px',
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {/* Logo Emblem / Uploaded Image */}
      {shouldRenderLogoGraphic && (
        <div
          className="brand-logo-frame"
          style={{
            width: `${frameSize}px`,
            height: `${frameSize}px`,
            minWidth: `${frameSize}px`,
            minHeight: `${frameSize}px`,
            borderRadius: getBorderRadius(),
            background: getBgStyle(),
            border: getBorder(),
            boxShadow: logoShape !== 'natural' ? '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 16px rgba(183, 33, 76, 0.2)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${logoPadding}px`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: logoShape === 'natural' ? 'contain' : 'contain',
                transform: `scale(${logoScale / 100})`,
                filter: getFilterStyle(),
                transition: 'transform 0.2s ease'
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: getFilterStyle()
              }}
            >
              {renderPresetEmblem(iconSize)}
            </div>
          )}
        </div>
      )}

      {/* Brand Typography */}
      {shouldRenderText && (
        <div
          className="brand-text-col"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: logoLayout === 'stacked' ? 'center' : 'left',
            lineHeight: 1.15
          }}
        >
          <span
            className="brand-name"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: size === 'sm' ? '1.3rem' : size === 'lg' ? '2.1rem' : size === 'xl' ? '2.5rem' : '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFF5F7 0%, #F5CCD4 40%, #E8A598 80%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            {storeName}
          </span>

          {showSub && (
            <span
              className="brand-sub"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: size === 'sm' ? '0.55rem' : '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-blush)',
                marginTop: '2px'
              }}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
