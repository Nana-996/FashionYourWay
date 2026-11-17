// Active baseline products for Fashion Your Way Boutique
// Dynamically synchronized worldwide across all buyers and admins via global cloud
export const initialProducts = [
  {
    id: "FYW-PROD-001",
    name: "Aurelia Velvet Gala Maxi Gown",
    subtitle: "Floor-sweeping structured velvet with daring side slit & corset bodice",
    category: "Evening & Gala",
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewsCount: 48,
    isFeatured: true,
    tag: "Bestseller",
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Deep Burgundy", hex: "#4A0E23" },
      { name: "Velvet Wine", hex: "#6B1736" },
      { name: "Midnight Rose", hex: "#2E0A17" }
    ],
    description: "Designed to demand attention the moment you enter. Handcrafted from heavy mulberry stretch velvet, the Aurelia Gown features an internal boned corset, draped sweetheart neckline, and a sculptural floor-length silhouette.",
    features: [
      "Internal steel-boned corset support",
      "High-grade stretch mulberry velvet (92% Silk, 8% Elastane)",
      "Concealed back zipper with velvet-covered buttons",
      "Dry clean only"
    ]
  },
  {
    id: "FYW-PROD-002",
    name: "Seraphina Tailored Burgundy Blazer Suit",
    subtitle: "Architectural double-breasted power blazer with matching cigarette trousers",
    category: "Outerwear & Suits",
    price: 1650,
    originalPrice: 1950,
    rating: 4.8,
    reviewsCount: 39,
    isFeatured: true,
    tag: "Trending",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Burgundy Wine", hex: "#5C132E" },
      { name: "Noir Plum", hex: "#240511" }
    ],
    description: "The definition of modern feminine power dressing. Impeccably tailored with padded shoulders, peak lapels, and custom gold-engraved buttons.",
    features: [
      "Satin-lined interior in signature blush jacquard",
      "Structured shoulder pads and tapered waistline",
      "Includes tailored high-waisted cigarette pants"
    ]
  },
  {
    id: "FYW-PROD-003",
    name: "Elysian Silk Slip Dress in Rose Wine",
    subtitle: "Pure 22-Momme silk with cowl neckline and delicate crisscross back",
    category: "Dresses",
    price: 1200,
    originalPrice: 1450,
    rating: 5.0,
    reviewsCount: 62,
    isFeatured: true,
    tag: "Runway Exclusive",
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Rose Wine", hex: "#872247" },
      { name: "Rich Berry", hex: "#4B0920" }
    ],
    description: "Effortless sensuality captured in liquid silk. Cut on the bias to drape fluidly along your curves, featuring adjustable micro-straps and an alluring low cowl back.",
    features: [
      "100% Grade 6A Mulberry Silk (22 Momme)",
      "Bias-cut silhouette for flattering natural stretch",
      "Adjustable gold-hardware crossover back ties"
    ]
  },
  {
    id: "FYW-PROD-004",
    name: "The Sovereign Cashmere-Wool Trench Coat",
    subtitle: "Oversized dramatic lapel trench in signature deep royal burgundy",
    category: "Outerwear & Suits",
    price: 2600,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 54,
    isFeatured: true,
    tag: "Bestseller",
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Imperial Burgundy", hex: "#43091E" },
      { name: "Winter White", hex: "#F5F5F7" }
    ],
    description: "The crowning glory of your wardrobe. Cut from double-faced Australian merino wool and cashmere, featuring an exaggerated storm flap and wide cinching belt.",
    features: [
      "70% Australian Wool, 30% Cashmere blend",
      "Hand-finished pick-stitched edges",
      "Removable sash belt with polished gold eyelets"
    ]
  },
  {
    id: "FYW-PROD-005",
    name: "Marquise Quilted Leather Crossbody Bag",
    subtitle: "Pink burgundy lambskin with rose gold chain hardware and monogram clasp",
    category: "Accessories & Bags",
    price: 950,
    originalPrice: 1200,
    rating: 4.8,
    reviewsCount: 27,
    isFeatured: false,
    tag: "Trending",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Burgundy Calfskin", hex: "#520D26" },
      { name: "Chalk White", hex: "#FFFFFF" }
    ],
    description: "Crafted from buttery diamond-quilted lambskin. Accented with custom rose-gold hardware and sliding chain strap that adjusts between shoulder and crossbody wear.",
    features: [
      "Genuine Italian Lambskin leather",
      "Rose-gold electroplated chain and twist lock",
      "Lined in luxury micro-suede"
    ]
  },
  {
    id: "FYW-PROD-006",
    name: "Celeste Feather-Trimmed Satin Cocktail Dress",
    subtitle: "Mini dress with plush ostrich feather hemline and crystal embellished straps",
    category: "Dresses",
    price: 1450,
    originalPrice: 1750,
    rating: 4.9,
    reviewsCount: 35,
    isFeatured: true,
    tag: "Runway Exclusive",
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Berry Wine", hex: "#631032" },
      { name: "Bridal White", hex: "#FFFFFF" }
    ],
    description: "An intoxicating mix of playful glamour and high-fashion luxury. Fitted satin mini silhouette adorned with hand-applied ostrich feathers that sway with every step.",
    features: [
      "Ethically sourced ostrich feather hem",
      "Crystal rhinestone sparkle micro-straps",
      "Hidden side zip closure"
    ]
  }
];
