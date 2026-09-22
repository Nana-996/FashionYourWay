import { DEFAULT_THEME_COLORS } from '../utils/themeEngine';

export const initialStoreInfo = {
  storeName: "FashionYourWay",
  tagline: "Own the Room. Fashion Designed Your Way.",
  brandDescription: "FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way.",
  
  // Hero Section Copy (Fully Editable by Admin)
  heroPill: "Autumn / Winter Edit",
  heroTitle: "Make Them Look",
  heroTitleHighlight: "Twice.",
  heroSubtitle: "Fashion designed to match your mood, your confidence, and your individuality. No rules. No limits.",
  heroPrimaryCta: "Shop Collection",
  heroSecondaryCta: "Featured Design",
  heroEmptyTitle: "Welcome to FashionYourWay",
  heroEmptyDesc: "Explore our bespoke handcrafted collections below or contact concierge.",

  // Brand Value Highlights Strip (4 Editable Highlights)
  brandHighlights: [
    {
      icon: "crown",
      title: "Haute Couture Standards",
      desc: "Mulberry silks & plush velvets"
    },
    {
      icon: "sparkles",
      title: "Bespoke Silhouette",
      desc: "Tailored to your exact fit"
    },
    {
      icon: "shield",
      title: "Guaranteed Authenticity",
      desc: "Handcrafted atelier quality"
    },
    {
      icon: "truck",
      title: "VIP Dispatch",
      desc: "Doorstep delivery nationwide"
    }
  ],

  // Catalog Section Copy
  catalogTitle: "The Collection",
  catalogSubtitle: "Handcrafted Luxury Silhouettes",
  catalogSearchPlaceholder: "Search pieces, colors, fabrics...",
  catalogEmptyTitle: "Catalog Currently Being Curated",
  catalogEmptyDesc: "Our runway pieces are being prepared. Visit the Admin Portal to add and manage your fashion pieces.",

  // Footer & Brand Philosophy Copy
  footerManifesto: "Bespoke luxury silhouettes crafted from rich velvets and pure silks. Designed to match your confidence.",
  footerEdition: "Pink Burgundy Luxury Edition",
  footerSubtext: "Haute Couture",
  footerCopyright: "All Rights Reserved. Handcrafted with passion.",

  // Location & Physical Atelier
  location: "Plot 24, Lagos Avenue, East Legon",
  city: "Accra, Ghana",
  landmark: "Near A&C Mall & Mensvic Grand Hotel",
  phone: "+233 54 892 4432",
  whatsapp: "+233 55 901 8822",
  email: "concierge@fashionyourway.com",
  orderInquiriesEmail: "orders@fashionyourway.com",
  workingHours: "Monday – Saturday: 9:00 AM – 8:00 PM (GMT) | Sunday: 12:00 PM – 6:00 PM",
  
  // Social Media Handles
  socialHandles: {
    instagram: "fashionyourway_gh",
    tiktok: "fashionyourway_gh",
    whatsapp: "+233559018822",
    facebook: "FashionYourWayGhana",
    snapchat: "fashionyourway",
    twitter: "fashionyourway"
  },
  
  // Currency & Shipping Rules
  currencySymbol: "GH₵",
  freeShippingThreshold: 800,
  standardShippingFee: 45,
  expressShippingFee: 85,
  
  // Top Notice Bar
  noticeBanner: "✨ RUNWAY DROP: Enjoy Complimentary Delivery Across Ghana on Orders Over GH₵ 800 with code 'ACCRAVELVET'",
  showNoticeBanner: true,

  // Order Tracking View Copy
  trackingHeroTitle: "Client Order Management & Tracking",
  trackingHeroSubtitle: "Track your bespoke tailoring, packaging status, and courier dispatch in real time.",
  trackingBadge: "VIP Client Concierge",

  // Paystack Live Payment Gateway Integration
  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  paystackSecretKey: '',
  paystackEnabled: true,
  paystackMode: 'live',

  // Logo & Visual Identity Configuration
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
  logoLayout: 'horizontal',

  // Site Colors & Dynamic Theme System
  themeColors: DEFAULT_THEME_COLORS
};
