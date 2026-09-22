// Theme Engine: Dynamic CSS Variable & Luxury Palette System for FashionYourWay

export const DEFAULT_THEME_COLORS = {
  // 1. Global Core Palette
  primaryColor: '#872046',        // Wine / Primary Accent
  primaryHover: '#B33D62',        // Rose Deep / Hover Accent
  secondaryColor: '#E8A598',      // Blush / Secondary Accent
  secondaryLight: '#F7D6DC',      // Light Blush / Subtle Tint
  accentGold: '#D4AF37',          // Champagne Gold / VIP Highlight
  accentGoldLight: '#F3E5AB',     // Soft Gold Tint
  bgMain: '#14030B',              // Main Canvas Background
  bgCard: '#200714',              // Card & Container Background
  bgSurface: '#2E0B1D',           // Elevated Surface / Dropdown Background
  textPrimary: '#FFF5F7',         // Main Headings & Body Text
  textSecondary: '#E8A598',       // Subtitles & Label Text
  textMuted: 'rgba(255, 245, 247, 0.65)',

  // 2. Top Announcement Bar
  announcementBg: '#38081A',
  announcementText: '#F7D6DC',

  // 3. Header & Navigation
  navbarBg: 'rgba(32, 7, 20, 0.85)',
  navbarBorder: 'rgba(232, 165, 152, 0.18)',
  navLinkColor: 'rgba(255, 245, 247, 0.82)',
  navLinkActiveColor: '#E8A598',
  cartBadgeBg: '#B33D62',
  cartBadgeText: '#FFFFFF',

  // 4. Hero Section
  heroGlowColor: '#B33D62',
  heroPillBg: 'rgba(232, 165, 152, 0.14)',
  heroPillText: '#F7D6DC',
  heroTitleHighlight: '#E8A598',

  // 5. Buttons & CTAs
  btnPrimaryBg: 'linear-gradient(135deg, #872046 0%, #B33D62 50%, #E8A598 100%)',
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBg: 'rgba(255, 240, 243, 0.08)',
  btnSecondaryText: '#FFF5F7',
  btnSecondaryBorder: 'rgba(232, 165, 152, 0.25)',

  // 6. Product Catalog & Cards
  cardBg: '#200714',
  cardBorder: 'rgba(232, 165, 152, 0.16)',
  cardPriceColor: '#E8A598',
  cardTagBg: 'linear-gradient(135deg, #4A0E23, #872046)',
  cardTagText: '#FFFFFF',

  // 7. Luxury Footer
  footerBg: '#0D0106',
  footerText: 'rgba(255, 245, 247, 0.75)',
  footerHeadingColor: '#FFF5F7',
  footerGlowColor: 'rgba(183, 33, 76, 0.22)',
  footerBorder: 'rgba(232, 165, 152, 0.12)'
};

// 6 Curated Designer Theme Presets
export const PRESET_THEMES = [
  {
    id: 'pink-burgundy',
    name: 'Pink Burgundy Luxury',
    subtitle: 'Signature Velvet & Rose Gold',
    badge: 'Original Default',
    description: 'Deep royal burgundy, plush velvet tones, blush pink accents and champagne gold highlights.',
    previewColors: ['#14030B', '#872046', '#B33D62', '#E8A598', '#D4AF37'],
    colors: { ...DEFAULT_THEME_COLORS }
  },
  {
    id: 'royal-emerald',
    name: 'Royal Emerald & Gold',
    subtitle: 'Imperial Atelier Elegance',
    badge: 'Trending',
    description: 'Rich dark obsidian canvas, deep emerald green highlights, luminous jade and regal gold.',
    previewColors: ['#03140C', '#0A3822', '#10B981', '#6EE7B7', '#D4AF37'],
    colors: {
      primaryColor: '#0A3822',
      primaryHover: '#10B981',
      secondaryColor: '#6EE7B7',
      secondaryLight: '#D1FAE5',
      accentGold: '#D4AF37',
      accentGoldLight: '#FDE68A',
      bgMain: '#03140C',
      bgCard: '#072416',
      bgSurface: '#0E3A24',
      textPrimary: '#F0FDF4',
      textSecondary: '#6EE7B7',
      textMuted: 'rgba(240, 253, 244, 0.65)',
      announcementBg: '#052315',
      announcementText: '#D1FAE5',
      navbarBg: 'rgba(7, 36, 22, 0.88)',
      navbarBorder: 'rgba(110, 231, 183, 0.2)',
      navLinkColor: 'rgba(240, 253, 244, 0.82)',
      navLinkActiveColor: '#6EE7B7',
      cartBadgeBg: '#10B981',
      cartBadgeText: '#FFFFFF',
      heroGlowColor: '#0A3822',
      heroPillBg: 'rgba(110, 231, 183, 0.15)',
      heroPillText: '#D1FAE5',
      heroTitleHighlight: '#D4AF37',
      btnPrimaryBg: 'linear-gradient(135deg, #0A3822 0%, #10B981 50%, #6EE7B7 100%)',
      btnPrimaryText: '#03140C',
      btnSecondaryBg: 'rgba(240, 253, 244, 0.08)',
      btnSecondaryText: '#F0FDF4',
      btnSecondaryBorder: 'rgba(110, 231, 183, 0.25)',
      cardBg: '#072416',
      cardBorder: 'rgba(110, 231, 183, 0.16)',
      cardPriceColor: '#6EE7B7',
      cardTagBg: 'linear-gradient(135deg, #052315, #0A3822)',
      cardTagText: '#D1FAE5',
      footerBg: '#020C07',
      footerText: 'rgba(240, 253, 244, 0.75)',
      footerHeadingColor: '#F0FDF4',
      footerGlowColor: 'rgba(16, 185, 129, 0.22)',
      footerBorder: 'rgba(110, 231, 183, 0.12)'
    }
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire & Ice',
    subtitle: 'Cosmic Blue & Diamond Sparkle',
    badge: 'Modern',
    description: 'Abyssal navy canvas, shimmering royal sapphire, crisp ice blue and radiant silver-white.',
    previewColors: ['#030914', '#0F2B59', '#2563EB', '#93C5FD', '#E0F2FE'],
    colors: {
      primaryColor: '#0F2B59',
      primaryHover: '#2563EB',
      secondaryColor: '#93C5FD',
      secondaryLight: '#E0F2FE',
      accentGold: '#38BDF8',
      accentGoldLight: '#BAE6FD',
      bgMain: '#030914',
      bgCard: '#081730',
      bgSurface: '#0E234A',
      textPrimary: '#F0F9FF',
      textSecondary: '#93C5FD',
      textMuted: 'rgba(240, 249, 255, 0.65)',
      announcementBg: '#061328',
      announcementText: '#E0F2FE',
      navbarBg: 'rgba(8, 23, 48, 0.88)',
      navbarBorder: 'rgba(147, 197, 253, 0.2)',
      navLinkColor: 'rgba(240, 249, 255, 0.82)',
      navLinkActiveColor: '#93C5FD',
      cartBadgeBg: '#2563EB',
      cartBadgeText: '#FFFFFF',
      heroGlowColor: '#1E40AF',
      heroPillBg: 'rgba(147, 197, 253, 0.15)',
      heroPillText: '#E0F2FE',
      heroTitleHighlight: '#93C5FD',
      btnPrimaryBg: 'linear-gradient(135deg, #0F2B59 0%, #2563EB 50%, #93C5FD 100%)',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: 'rgba(240, 249, 255, 0.08)',
      btnSecondaryText: '#F0F9FF',
      btnSecondaryBorder: 'rgba(147, 197, 253, 0.25)',
      cardBg: '#081730',
      cardBorder: 'rgba(147, 197, 253, 0.16)',
      cardPriceColor: '#93C5FD',
      cardTagBg: 'linear-gradient(135deg, #061328, #0F2B59)',
      cardTagText: '#FFFFFF',
      footerBg: '#02050B',
      footerText: 'rgba(240, 249, 255, 0.75)',
      footerHeadingColor: '#F0F9FF',
      footerGlowColor: 'rgba(37, 99, 235, 0.25)',
      footerBorder: 'rgba(147, 197, 253, 0.12)'
    }
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Noir & 24K Gold',
    subtitle: 'High-Contrast Haute Couture',
    badge: 'Timeless',
    description: 'Jet black noir, brushed carbon surfaces, 24-karat gold brilliance and champagne lights.',
    previewColors: ['#0A0A0A', '#1C1917', '#EAB308', '#FDE047', '#FEF08A'],
    colors: {
      primaryColor: '#D4AF37',
      primaryHover: '#EAB308',
      secondaryColor: '#FDE047',
      secondaryLight: '#FEF08A',
      accentGold: '#F59E0B',
      accentGoldLight: '#FEF9C3',
      bgMain: '#0A0A0A',
      bgCard: '#171717',
      bgSurface: '#262626',
      textPrimary: '#FAFAFA',
      textSecondary: '#E5E5E5',
      textMuted: 'rgba(250, 250, 250, 0.65)',
      announcementBg: '#1C1917',
      announcementText: '#FEF08A',
      navbarBg: 'rgba(23, 23, 23, 0.9)',
      navbarBorder: 'rgba(212, 175, 55, 0.25)',
      navLinkColor: 'rgba(250, 250, 250, 0.82)',
      navLinkActiveColor: '#FDE047',
      cartBadgeBg: '#D4AF37',
      cartBadgeText: '#0A0A0A',
      heroGlowColor: 'rgba(212, 175, 55, 0.35)',
      heroPillBg: 'rgba(212, 175, 55, 0.15)',
      heroPillText: '#FEF08A',
      heroTitleHighlight: '#D4AF37',
      btnPrimaryBg: 'linear-gradient(135deg, #D4AF37 0%, #EAB308 50%, #FDE047 100%)',
      btnPrimaryText: '#0A0A0A',
      btnSecondaryBg: 'rgba(250, 250, 250, 0.08)',
      btnSecondaryText: '#FAFAFA',
      btnSecondaryBorder: 'rgba(212, 175, 55, 0.3)',
      cardBg: '#171717',
      cardBorder: 'rgba(212, 175, 55, 0.2)',
      cardPriceColor: '#FDE047',
      cardTagBg: 'linear-gradient(135deg, #292524, #44403C)',
      cardTagText: '#FEF08A',
      footerBg: '#050505',
      footerText: 'rgba(250, 250, 250, 0.75)',
      footerHeadingColor: '#FAFAFA',
      footerGlowColor: 'rgba(212, 175, 55, 0.2)',
      footerBorder: 'rgba(212, 175, 55, 0.15)'
    }
  },
  {
    id: 'plum-amethyst',
    name: 'Plum Velvet & Amethyst',
    subtitle: 'Mystic Royal Violet',
    badge: 'Boutique',
    description: 'Deep midnight violet, imperial royal purple, glowing lavender blush and soft violet mist.',
    previewColors: ['#12041A', '#3B0764', '#7E22CE', '#C084FC', '#F3E8FF'],
    colors: {
      primaryColor: '#581C87',
      primaryHover: '#7E22CE',
      secondaryColor: '#C084FC',
      secondaryLight: '#F3E8FF',
      accentGold: '#E879F9',
      accentGoldLight: '#FAE8FF',
      bgMain: '#12041A',
      bgCard: '#1E092B',
      bgSurface: '#2E0E42',
      textPrimary: '#FAF5FF',
      textSecondary: '#C084FC',
      textMuted: 'rgba(250, 245, 255, 0.65)',
      announcementBg: '#250638',
      announcementText: '#F3E8FF',
      navbarBg: 'rgba(30, 9, 43, 0.88)',
      navbarBorder: 'rgba(192, 132, 252, 0.2)',
      navLinkColor: 'rgba(250, 245, 255, 0.82)',
      navLinkActiveColor: '#C084FC',
      cartBadgeBg: '#7E22CE',
      cartBadgeText: '#FFFFFF',
      heroGlowColor: '#6B21A8',
      heroPillBg: 'rgba(192, 132, 252, 0.15)',
      heroPillText: '#F3E8FF',
      heroTitleHighlight: '#C084FC',
      btnPrimaryBg: 'linear-gradient(135deg, #581C87 0%, #7E22CE 50%, #C084FC 100%)',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: 'rgba(250, 245, 255, 0.08)',
      btnSecondaryText: '#FAF5FF',
      btnSecondaryBorder: 'rgba(192, 132, 252, 0.25)',
      cardBg: '#1E092B',
      cardBorder: 'rgba(192, 132, 252, 0.16)',
      cardPriceColor: '#C084FC',
      cardTagBg: 'linear-gradient(135deg, #250638, #581C87)',
      cardTagText: '#FFFFFF',
      footerBg: '#0B0210',
      footerText: 'rgba(250, 245, 255, 0.75)',
      footerHeadingColor: '#FAF5FF',
      footerGlowColor: 'rgba(126, 34, 206, 0.22)',
      footerBorder: 'rgba(192, 132, 252, 0.12)'
    }
  },
  {
    id: 'espresso-truffle',
    name: 'Espresso Truffle & Rose Gold',
    subtitle: 'Warm Earth & Cashmere Velvet',
    badge: 'Warm Luxury',
    description: 'Dark roasted espresso bean, warm terracotta mocha, blush rose gold and silky vanilla cream.',
    previewColors: ['#160C07', '#451A03', '#9A3412', '#FDBA74', '#FFEDD5'],
    colors: {
      primaryColor: '#7C2D12',
      primaryHover: '#9A3412',
      secondaryColor: '#FDBA74',
      secondaryLight: '#FFEDD5',
      accentGold: '#D97706',
      accentGoldLight: '#FEF3C7',
      bgMain: '#160C07',
      bgCard: '#27140B',
      bgSurface: '#381C0F',
      textPrimary: '#FFF7ED',
      textSecondary: '#FDBA74',
      textMuted: 'rgba(255, 247, 237, 0.65)',
      announcementBg: '#2E1509',
      announcementText: '#FFEDD5',
      navbarBg: 'rgba(39, 20, 11, 0.88)',
      navbarBorder: 'rgba(253, 186, 116, 0.2)',
      navLinkColor: 'rgba(255, 247, 237, 0.82)',
      navLinkActiveColor: '#FDBA74',
      cartBadgeBg: '#9A3412',
      cartBadgeText: '#FFFFFF',
      heroGlowColor: '#7C2D12',
      heroPillBg: 'rgba(253, 186, 116, 0.15)',
      heroPillText: '#FFEDD5',
      heroTitleHighlight: '#FDBA74',
      btnPrimaryBg: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 50%, #FDBA74 100%)',
      btnPrimaryText: '#160C07',
      btnSecondaryBg: 'rgba(255, 247, 237, 0.08)',
      btnSecondaryText: '#FFF7ED',
      btnSecondaryBorder: 'rgba(253, 186, 116, 0.25)',
      cardBg: '#27140B',
      cardBorder: 'rgba(253, 186, 116, 0.16)',
      cardPriceColor: '#FDBA74',
      cardTagBg: 'linear-gradient(135deg, #2E1509, #7C2D12)',
      cardTagText: '#FFFFFF',
      footerBg: '#0E0704',
      footerText: 'rgba(255, 247, 237, 0.75)',
      footerHeadingColor: '#FFF7ED',
      footerGlowColor: 'rgba(154, 52, 18, 0.22)',
      footerBorder: 'rgba(253, 186, 116, 0.12)'
    }
  }
];

// Helper: Convert Hex to RGBA
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string') return `rgba(255, 255, 255, ${alpha})`;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper: Lighten or Darken a hex color by percentage (-100 to 100)
export const adjustHexBrightness = (hex, percent) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Apply site theme colors dynamically to document root (:root)
 * Sets all CSS variables and injects the dynamic background gradient
 */
export const applyThemeColors = (customColors = {}) => {
  if (typeof document === 'undefined') return;

  const colors = { ...DEFAULT_THEME_COLORS, ...customColors };
  const root = document.documentElement;

  // 1. Core Background Variables
  root.style.setProperty('--bg-main', colors.bgMain);
  root.style.setProperty('--bg-card', colors.bgCard);
  root.style.setProperty('--bg-card-hover', adjustHexBrightness(colors.bgCard, 10));
  root.style.setProperty('--bg-surface', colors.bgSurface);
  root.style.setProperty('--bg-glass', colors.navbarBg || hexToRgba(colors.bgCard, 0.82));
  root.style.setProperty('--bg-glass-heavy', hexToRgba(colors.bgMain, 0.95));
  root.style.setProperty('--bg-glass-light', hexToRgba(colors.textPrimary, 0.05));

  // 2. Palette Accent Variables (Backwards compatible with existing theme.css)
  root.style.setProperty('--color-burgundy-dark', adjustHexBrightness(colors.primaryColor, -25));
  root.style.setProperty('--color-burgundy', colors.primaryColor);
  root.style.setProperty('--color-burgundy-light', adjustHexBrightness(colors.primaryColor, 15));
  root.style.setProperty('--color-wine', colors.primaryColor);
  root.style.setProperty('--color-rose-deep', colors.primaryHover || adjustHexBrightness(colors.primaryColor, 20));
  root.style.setProperty('--color-rose', colors.secondaryColor);
  root.style.setProperty('--color-blush', colors.secondaryColor);
  root.style.setProperty('--color-blush-light', colors.secondaryLight || adjustHexBrightness(colors.secondaryColor, 15));
  root.style.setProperty('--color-cream', colors.textPrimary);
  root.style.setProperty('--color-gold', colors.accentGold);
  root.style.setProperty('--color-gold-light', colors.accentGoldLight || adjustHexBrightness(colors.accentGold, 15));

  // 3. Section: Announcement Bar
  root.style.setProperty('--announcement-bg', colors.announcementBg);
  root.style.setProperty('--announcement-text', colors.announcementText);

  // 4. Section: Header & Navigation
  root.style.setProperty('--navbar-bg', colors.navbarBg);
  root.style.setProperty('--navbar-border', colors.navbarBorder || hexToRgba(colors.secondaryColor, 0.18));
  root.style.setProperty('--nav-link-color', colors.navLinkColor);
  root.style.setProperty('--nav-link-active-color', colors.navLinkActiveColor);
  root.style.setProperty('--cart-badge-bg', colors.cartBadgeBg);
  root.style.setProperty('--cart-badge-text', colors.cartBadgeText || '#FFFFFF');

  // 5. Section: Hero
  root.style.setProperty('--hero-glow-color', colors.heroGlowColor);
  root.style.setProperty('--hero-pill-bg', colors.heroPillBg);
  root.style.setProperty('--hero-pill-text', colors.heroPillText);
  root.style.setProperty('--hero-title-highlight', colors.heroTitleHighlight);

  // 6. Section: Buttons & Interactive
  root.style.setProperty('--btn-primary-bg', colors.btnPrimaryBg);
  root.style.setProperty('--btn-primary-text', colors.btnPrimaryText);
  root.style.setProperty('--btn-secondary-bg', colors.btnSecondaryBg);
  root.style.setProperty('--btn-secondary-text', colors.btnSecondaryText);
  root.style.setProperty('--btn-secondary-border', colors.btnSecondaryBorder);

  // 7. Section: Product Catalog & Cards
  root.style.setProperty('--card-bg', colors.cardBg);
  root.style.setProperty('--card-border', colors.cardBorder);
  root.style.setProperty('--card-price-color', colors.cardPriceColor);
  root.style.setProperty('--card-tag-bg', colors.cardTagBg);
  root.style.setProperty('--card-tag-text', colors.cardTagText);

  // 8. Section: Luxury Footer
  root.style.setProperty('--footer-bg', colors.footerBg);
  root.style.setProperty('--footer-text', colors.footerText);
  root.style.setProperty('--footer-heading-color', colors.footerHeadingColor);
  root.style.setProperty('--footer-glow-color', colors.footerGlowColor);
  root.style.setProperty('--footer-border', colors.footerBorder);

  // 9. Dynamic Body Ambient Glow
  const glow1 = hexToRgba(colors.primaryColor, 0.22);
  const glow2 = hexToRgba(colors.primaryColor, 0.15);
  const glow3 = hexToRgba(colors.secondaryColor, 0.12);
  const dynamicBodyBg = `
    radial-gradient(circle at 15% 10%, ${glow1} 0%, transparent 40%),
    radial-gradient(circle at 85% 60%, ${glow2} 0%, transparent 50%),
    radial-gradient(circle at 50% 90%, ${glow3} 0%, transparent 60%)
  `.trim();
  root.style.setProperty('--body-bg-gradient', dynamicBodyBg);

  // 10. Dynamic Brand Gradient (for logo and title highlights)
  const brandGradient = `linear-gradient(135deg, ${colors.textPrimary} 0%, ${colors.secondaryLight || colors.secondaryColor} 40%, ${colors.secondaryColor} 80%, ${colors.accentGold} 100%)`;
  root.style.setProperty('--brand-name-gradient', brandGradient);

  // 11. Dynamic Box Shadows
  root.style.setProperty('--shadow-glow', `0 0 30px ${hexToRgba(colors.primaryColor, 0.28)}`);
  root.style.setProperty('--shadow-glow-gold', `0 0 25px ${hexToRgba(colors.accentGold, 0.22)}`);

  // Ensure body background takes effect
  document.body.style.backgroundColor = colors.bgMain;
  document.body.style.backgroundImage = dynamicBodyBg;
};
