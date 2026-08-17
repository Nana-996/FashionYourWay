export const initialOrders = [
  {
    id: "FYW-84920",
    customerName: "Nana Akua Mensah",
    customerEmail: "akua.mensah@gmail.com",
    customerPhone: "+233 54 349 1102",
    shippingAddress: "House 18, 5th Circular Road, Cantonments",
    city: "Accra",
    region: "Greater Accra Region",
    country: "Ghana",
    paymentMethod: "Mobile Money (MTN MoMo / Telecel)",
    orderDate: "2026-08-16T14:32:00Z",
    status: "Processing", // Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
    statusHistory: [
      { status: "Pending", timestamp: "2026-08-16T14:32:00Z", note: "Order placed online via Mobile Money" },
      { status: "Confirmed", timestamp: "2026-08-16T15:10:00Z", note: "MoMo Payment received and verified by Atelier" },
      { status: "Processing", timestamp: "2026-08-16T17:45:00Z", note: "At Atelier: Tailoring & custom gift box packaging underway" }
    ],
    items: [
      {
        id: "FYW-PROD-001",
        name: "Aurelia Velvet Gala Maxi Gown",
        price: 1850,
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Deep Burgundy",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "FYW-PROD-006",
        name: "Marquise Quilted Leather Crossbody Bag",
        price: 950,
        quantity: 1,
        selectedSize: "One Size",
        selectedColor: "Burgundy Calfskin",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 2800,
    shippingFee: 0,
    discountAmount: 0,
    total: 2800,
    trackingNumber: "GH-EXP-9920194",
    adminNotes: "Client requested express delivery to Cantonments residence.",
    customerNotes: "Please call on arrival at the gate."
  },
  {
    id: "FYW-71403",
    customerName: "Kofi Owusu-Ansah",
    customerEmail: "kofi.owusu@ventures.gh",
    customerPhone: "+233 24 902 4411",
    shippingAddress: "Plot 12, Boundary Road, East Legon",
    city: "Accra",
    region: "Greater Accra Region",
    country: "Ghana",
    paymentMethod: "Direct Bank Transfer",
    orderDate: "2026-08-15T09:15:00Z",
    status: "Shipped",
    statusHistory: [
      { status: "Pending", timestamp: "2026-08-15T09:15:00Z", note: "Order placed online" },
      { status: "Confirmed", timestamp: "2026-08-15T10:00:00Z", note: "Bank wire receipt confirmed" },
      { status: "Processing", timestamp: "2026-08-15T13:20:00Z", note: "Prepared for luxury dispatch" },
      { status: "Shipped", timestamp: "2026-08-16T08:00:00Z", note: "Dispatched with Dispatch Rider. ETA: 2 PM today." }
    ],
    items: [
      {
        id: "FYW-PROD-002",
        name: "Seraphina Tailored Burgundy Blazer Suit",
        price: 1650,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Burgundy Wine",
        image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 1650,
    shippingFee: 0,
    discountAmount: 0,
    total: 1650,
    trackingNumber: "ACC-RIDER-774",
    adminNotes: "VIP repeat client. Included signature fragrance sample.",
    customerNotes: "Deliver before 4 PM please."
  },
  {
    id: "FYW-93215",
    customerName: "Esi Boateng",
    customerEmail: "esi.boateng@outlook.com",
    customerPhone: "+233 50 612 8833",
    shippingAddress: "Block D, Ahodwo Hill Top",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    paymentMethod: "Cash on Delivery",
    orderDate: "2026-08-16T22:10:00Z",
    status: "Pending",
    statusHistory: [
      { status: "Pending", timestamp: "2026-08-16T22:10:00Z", note: "Order placed via website checkout (Cash on Delivery)" }
    ],
    items: [
      {
        id: "FYW-PROD-003",
        name: "Elysian Silk Slip Dress in Rose Wine",
        price: 1200,
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Rose Wine",
        image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "FYW-PROD-008",
        name: "Royale Velvet Stiletto Pumps",
        price: 1100,
        quantity: 1,
        selectedSize: "EU 38",
        selectedColor: "Burgundy Velvet",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 2300,
    shippingFee: 0,
    discountAmount: 0,
    total: 2300,
    trackingNumber: "Awaiting Dispatch to Kumasi",
    adminNotes: "Awaiting phone confirmation for Kumasi VIP intercity parcel.",
    customerNotes: "Please call on arrival."
  },
  {
    id: "FYW-55104",
    customerName: "Ama Serwaa Darko",
    customerEmail: "ama.serwaa@style.gh",
    customerPhone: "+233 27 773 4019",
    shippingAddress: "14 Senchi Street, Airport Residential Area",
    city: "Accra",
    region: "Greater Accra Region",
    country: "Ghana",
    paymentMethod: "Mobile Money (MTN MoMo)",
    orderDate: "2026-08-12T11:00:00Z",
    status: "Delivered",
    statusHistory: [
      { status: "Pending", timestamp: "2026-08-12T11:00:00Z", note: "Order placed online" },
      { status: "Confirmed", timestamp: "2026-08-12T11:20:00Z", note: "MoMo payment verified" },
      { status: "Processing", timestamp: "2026-08-12T14:00:00Z", note: "Quality checked and wrapped in boutique box" },
      { status: "Shipped", timestamp: "2026-08-13T09:00:00Z", note: "Dispatched with Airport Residential courier" },
      { status: "Delivered", timestamp: "2026-08-13T14:30:00Z", note: "Delivered to client at residence" }
    ],
    items: [
      {
        id: "FYW-PROD-005",
        name: "The Sovereign Cashmere-Wool Trench Coat",
        price: 2600,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Imperial Burgundy",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 2600,
    shippingFee: 0,
    discountAmount: 0,
    total: 2600,
    trackingNumber: "DEL-ACC-1092",
    adminNotes: "Delivered successfully. 5-star rating received.",
    customerNotes: ""
  }
];
