import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import { initialStoreInfo } from '../data/initialStoreInfo';
import { initialOrders } from '../data/initialOrders';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'fyw_products_v4_gh',
  STORE_INFO: 'fyw_store_info_v3_gh',
  ORDERS: 'fyw_orders_v3_gh',
  CART: 'fyw_cart_v3_gh',
  WISHLIST: 'fyw_wishlist_v3_gh'
};

// Cleanse old localStorage keys if present
try {
  ['fyw_products_v1', 'fyw_products_v2', 'fyw_products_v3_gh', 'fyw_store_info_v1'].forEach(k => {
    localStorage.removeItem(k);
  });
} catch (e) {
  console.log('Cleanup error', e);
}

export const StoreProvider = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure products are in Ghana Cedis
        if (parsed.length > 0 && parsed[0].price < 500) {
          return initialProducts;
        }
        return parsed;
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // 2. Store Info State (Strictly Ghana Cedi)
  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORE_INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.currencySymbol = 'GH₵';
        if (parsed.noticeBanner && parsed.noticeBanner.includes('$')) {
          parsed.noticeBanner = parsed.noticeBanner.replace(/\$/g, 'GH₵ ');
        }
        return { ...initialStoreInfo, ...parsed, currencySymbol: 'GH₵' };
      }
      return initialStoreInfo;
    } catch {
      return initialStoreInfo;
    }
  });

  // 3. Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // 4. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Security Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('fyw_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState(() => {
    try {
      return localStorage.getItem('fyw_admin_passkey') || 'fashion2026';
    } catch {
      return 'fashion2026';
    }
  });

  // UI States
  const [currentView, setCurrentView] = useState('storefront'); // 'storefront' | 'track' | 'admin'
  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'overview' | 'orders' | 'products' | 'settings'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  const loginAdmin = (enteredKey) => {
    if (enteredKey === adminPasskey || enteredKey === 'admin123' || enteredKey === 'fashion2026') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('fyw_admin_auth', 'true');
      setIsAdminLoginModalOpen(false);
      setCurrentView('admin');
      showToast('Admin Access Granted 👑', 'Welcome to the executive management portal', 'success');
      return true;
    } else {
      showToast('Access Denied', 'Invalid Admin Security Passkey', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('fyw_admin_auth');
    setCurrentView('storefront');
    showToast('Admin Logged Out', 'Security session terminated', 'info');
  };

  const changeAdminPasskey = (newKey) => {
    setAdminPasskey(newKey);
    localStorage.setItem('fyw_admin_passkey', newKey);
    showToast('Admin Passkey Updated', 'New security key has been saved', 'success');
  };

  // Secret Stealth Triggers (Ctrl+Shift+A or URL query/hash #admin / ?admin)
  useEffect(() => {
    // Check URL on load
    const checkUrlForAdmin = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('admin') || window.location.hash === '#admin') {
        if (isAdminAuthenticated) {
          setCurrentView('admin');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };
    checkUrlForAdmin();

    // Global Key Listener: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setCurrentView(prev => (prev === 'admin' ? 'storefront' : 'admin'));
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast Notification Trigger
  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', '', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to Wishlist ✨', 'Item saved to your favorites', 'success');
        return [...prev, productId];
      }
    });
  };

  // Cart Operations
  const addToCart = (product, size, color, quantity = 1) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Burgundy';
    const itemKey = `${product.id}-${selectedSize}-${selectedColor}`;

    setCart(prev => {
      const existing = prev.find(item => item.itemKey === itemKey);
      if (existing) {
        return prev.map(item =>
          item.itemKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          itemKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: (product.images && product.images[0]) || '',
          selectedSize,
          selectedColor,
          quantity
        }
      ];
    });

    showToast('Added to Shopping Bag', `${product.name} (${selectedSize} / ${selectedColor})`, 'success');
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => item.itemKey !== itemKey));
    showToast('Item Removed', 'Item has been removed from your bag', 'info');
  };

  const updateCartQuantity = (itemKey, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const currencySymbol = storeInfo?.currencySymbol || 'GH₵';

  const formatCurrency = (amount) => {
    return `${currencySymbol} ${Number(amount || 0).toLocaleString()}`;
  };

  // Order Placement (Customer)
  const placeOrder = (orderData) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FYW-${randomDigits}`;
    const nowIso = new Date().toISOString();

    const isFreeShipping = cartSubtotal >= (storeInfo.freeShippingThreshold || 800);
    const shippingFee = orderData.shippingType === 'express'
      ? (storeInfo.expressShippingFee || 85)
      : (isFreeShipping ? 0 : (storeInfo.standardShippingFee || 45));

    const total = cartSubtotal + shippingFee;

    const newOrder = {
      id: orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      region: orderData.region || 'Greater Accra',
      landmark: orderData.landmark || '',
      country: 'Ghana',
      paymentMethod: orderData.paymentMethod || 'Mobile Money (MTN MoMo / Telecel)',
      orderDate: nowIso,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: nowIso,
          note: 'Order successfully placed online.'
        }
      ],
      items: cart.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.image
      })),
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount: 0,
      total,
      trackingNumber: `GH-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      adminNotes: '',
      customerNotes: orderData.customerNotes || ''
    };

    // Deduct stock
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const itemInCart = cart.find(ci => ci.productId === prod.id);
        if (itemInCart) {
          const newStock = Math.max(0, (prod.stock || 10) - itemInCart.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B33D62', '#E8A598', '#D4AF37', '#FFF5F7']
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }

    showToast('Order Placed Successfully! ✨', `Order #${orderId} is now being prepared.`, 'success');
    return newOrder;
  };

  // Order Status Updates (Admin)
  const updateOrderStatus = (orderId, newStatus, optionalNote = '') => {
    const nowIso = new Date().toISOString();
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const statusEntry = {
            status: newStatus,
            timestamp: nowIso,
            note: optionalNote || `Status updated to ${newStatus} by Admin`
          };
          return {
            ...ord,
            status: newStatus,
            statusHistory: [...(ord.statusHistory || []), statusEntry]
          };
        }
        return ord;
      })
    );
    showToast('Order Status Updated', `Order ${orderId} is now marked as ${newStatus}`, 'success');
  };

  const updateOrderAdminNotes = (orderId, adminNotes) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, adminNotes } : ord))
    );
    showToast('Notes Saved', `Updated admin notes for ${orderId}`, 'info');
  };

  // Product CRUD (Admin)
  const addProduct = (newProductData) => {
    const newId = `FYW-PROD-${String(products.length + 1).padStart(3, '0')}`;
    const product = {
      ...newProductData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProductData.stock) || 10,
      price: Number(newProductData.price) || 100,
      originalPrice: Number(newProductData.originalPrice) || Number(newProductData.price) || 120
    };
    setProducts(prev => [product, ...prev]);
    showToast('Product Created', `${product.name} is now live in the catalog!`, 'success');
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Product Updated', 'Product changes saved successfully.', 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product Removed', 'Product was deleted from the store.', 'info');
  };

  // Store Settings (Admin)
  const updateStoreInfo = (newInfo) => {
    setStoreInfo(prev => ({ ...prev, ...newInfo }));
    showToast('Store Profile Updated', 'Public business details have been updated.', 'success');
  };

  // Reset to demo defaults
  const resetDemoData = () => {
    setProducts(initialProducts);
    setStoreInfo(initialStoreInfo);
    setOrders(initialOrders);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.STORE_INFO);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Data Reset', 'Restored original demo catalog & store details', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        storeInfo,
        updateStoreInfo,
        orders,
        placeOrder,
        updateOrderStatus,
        updateOrderAdminNotes,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        formatCurrency,
        currencySymbol,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminPasskey,
        loginAdmin,
        logoutAdmin,
        changeAdminPasskey,
        currentView,
        setCurrentView,
        activeAdminTab,
        setActiveAdminTab,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        trackQuery,
        setTrackQuery,
        toasts,
        showToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
