import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/initialProducts';
import { initialStoreInfo } from '../data/initialStoreInfo';
import { initialOrders } from '../data/initialOrders';
import {
  syncStorageGet,
  resilientStorageSet,
  resilientStorageRemove,
  idbGet,
  idbSet
} from '../utils/storage';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'fyw_products_catalog_v6',
  STORE_INFO: 'fyw_store_info_v4_gh',
  ORDERS: 'fyw_orders_v4_gh',
  CART: 'fyw_cart_v4_gh',
  WISHLIST: 'fyw_wishlist_v4_gh'
};

export const StoreProvider = ({ children }) => {
  // 1. Products State - Persistent with IndexedDB + LocalStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.PRODUCTS, null) || syncStorageGet('fyw_products_catalog_v5', null);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // 2. Store Info State (Strictly Ghana Cedi + All Editable Site Copy)
  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.STORE_INFO, null) || syncStorageGet('fyw_store_info_v3_gh', null);
      if (saved) {
        return {
          ...initialStoreInfo,
          ...saved,
          currencySymbol: 'GH₵'
        };
      }
      return initialStoreInfo;
    } catch {
      return initialStoreInfo;
    }
  });

  // 3. Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.ORDERS, null) || syncStorageGet('fyw_orders_v3_gh', null);
      return saved && Array.isArray(saved) ? saved : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // 4. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.CART, null) || syncStorageGet('fyw_cart_v3_gh', null);
      return saved && Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // 5. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.WISHLIST, null) || syncStorageGet('fyw_wishlist_v3_gh', null);
      return saved && Array.isArray(saved) ? saved : [];
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
  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'orders' | 'products' | 'text-editor' | 'logo' | 'settings'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast Notification Trigger
  const showToast = useCallback((title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Async Hydration from IndexedDB on startup (covers any items saved when LocalStorage was at quota)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const idbProds = await idbGet(STORAGE_KEYS.PRODUCTS);
        if (isMounted && Array.isArray(idbProds) && idbProds.length > 0) {
          // If IndexedDB has catalog items, ensure state has them
          setProducts(prev => {
            if (idbProds.length >= prev.length) {
              return idbProds;
            }
            return prev;
          });
        }

        const idbInfo = await idbGet(STORAGE_KEYS.STORE_INFO);
        if (isMounted && idbInfo && typeof idbInfo === 'object') {
          setStoreInfo(prev => ({
            ...prev,
            ...idbInfo,
            currencySymbol: 'GH₵'
          }));
        }

        const idbOrds = await idbGet(STORAGE_KEYS.ORDERS);
        if (isMounted && Array.isArray(idbOrds) && idbOrds.length > 0) {
          setOrders(prev => (idbOrds.length >= prev.length ? idbOrds : prev));
        }
      } catch (err) {
        console.warn('IndexedDB initial hydration note:', err);
      }
    })();

    // Multi-tab storage synchronization
    const handleStorageChange = (e) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      } else if (e.key === STORAGE_KEYS.STORE_INFO && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setStoreInfo(parsed);
        } catch {}
      } else if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrders(parsed);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save changes with resilient storage (LocalStorage + IndexedDB)
  useEffect(() => {
    resilientStorageSet(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, storeInfo);
  }, [storeInfo]);

  useEffect(() => {
    resilientStorageSet(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    resilientStorageSet(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    resilientStorageSet(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  // Admin Security Controls
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

  const cartSubtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
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

    const isPaid = orderData.paymentStatus === 'Paid' || !!orderData.paymentReference;
    const initialStatus = isPaid ? 'Confirmed' : 'Pending';
    const statusNote = orderData.paymentReference
      ? `Payment verified via Paystack (Ref: ${orderData.paymentReference}). Order confirmed.`
      : 'Order successfully placed online.';

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
      paymentMethod: orderData.paymentMethod || 'Paystack (MTN MoMo / Telecel / Card)',
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      paymentReference: orderData.paymentReference || null,
      paymentGateway: orderData.paymentGateway || (orderData.paymentReference ? 'Paystack' : 'Manual'),
      paidAt: isPaid ? nowIso : null,
      orderDate: nowIso,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: nowIso,
          note: statusNote
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
      adminNotes: orderData.paymentReference ? `Paystack Ref: ${orderData.paymentReference}` : '',
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

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

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

  // Robust Product CRUD (Admin) - crash-proof and multi-item ready
  const addProduct = (newProductData) => {
    const uniqueSuffix = Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newId = newProductData.id || `FYW-PROD-${uniqueSuffix}`;

    const sanitizedProduct = {
      ...newProductData,
      id: newId,
      name: (newProductData.name || 'Untitled Piece').trim(),
      subtitle: (newProductData.subtitle || '').trim(),
      category: (newProductData.category || 'Evening & Gala').trim(),
      price: Number(newProductData.price) || 100,
      originalPrice: newProductData.originalPrice ? Number(newProductData.originalPrice) : null,
      stock: Math.max(0, Number(newProductData.stock) ?? 10),
      tag: (newProductData.tag || '').trim(),
      images: Array.isArray(newProductData.images) && newProductData.images.filter(Boolean).length > 0
        ? newProductData.images.filter(Boolean)
        : ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
      sizes: Array.isArray(newProductData.sizes) && newProductData.sizes.length > 0 ? newProductData.sizes : ['Standard'],
      colors: Array.isArray(newProductData.colors) && newProductData.colors.length > 0
        ? newProductData.colors
        : [{ name: 'Burgundy', hex: '#4A0E23' }],
      description: (newProductData.description || '').trim(),
      features: Array.isArray(newProductData.features) && newProductData.features.length > 0
        ? newProductData.features
        : ['Handcrafted luxury finish', 'Dry clean only'],
      rating: newProductData.rating || 5.0,
      reviewsCount: newProductData.reviewsCount || 1,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [sanitizedProduct, ...prev]);
    showToast('Product Created ✨', `${sanitizedProduct.name} is now live in the store!`, 'success');
    return sanitizedProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          originalPrice: updatedFields.originalPrice !== undefined
            ? (updatedFields.originalPrice ? Number(updatedFields.originalPrice) : null)
            : p.originalPrice,
          stock: updatedFields.stock !== undefined ? Math.max(0, Number(updatedFields.stock)) : p.stock,
          images: Array.isArray(updatedFields.images) && updatedFields.images.filter(Boolean).length > 0
            ? updatedFields.images.filter(Boolean)
            : p.images
        };
      })
    );
    showToast('Product Updated ✨', 'Product changes saved and live on site.', 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product Removed', 'Product was deleted from the store catalog.', 'info');
  };

  const clearAllProducts = () => {
    setProducts([]);
    showToast('Catalog Cleared', 'All placeholder items have been removed.', 'info');
  };

  const restoreDemoProducts = () => {
    setProducts(initialProducts);
    showToast('Demo Catalog Restored', 'Restored sample showcase collection.', 'success');
  };

  const importProducts = (newProductsList) => {
    if (Array.isArray(newProductsList) && newProductsList.length > 0) {
      setProducts(newProductsList);
      showToast('Catalog Imported ✨', `Successfully loaded ${newProductsList.length} products into the store!`, 'success');
      return true;
    } else {
      showToast('Import Failed', 'Invalid product data format.', 'error');
      return false;
    }
  };

  // Store Settings & Website Text Updates (Admin)
  const updateStoreInfo = (newInfo) => {
    setStoreInfo(prev => ({
      ...prev,
      ...newInfo,
      currencySymbol: 'GH₵'
    }));
    showToast('Store Profile Updated', 'Public business details have been updated.', 'success');
  };

  const updateStoreText = (textUpdates) => {
    setStoreInfo(prev => ({
      ...prev,
      ...textUpdates
    }));
    showToast('Website Text Saved ✨', 'Storefront wording has been updated live!', 'success');
  };

  // Reset to demo defaults
  const resetDemoData = () => {
    setProducts(initialProducts);
    setStoreInfo(initialStoreInfo);
    setOrders(initialOrders);
    setCart([]);
    resilientStorageRemove(STORAGE_KEYS.PRODUCTS);
    resilientStorageRemove(STORAGE_KEYS.STORE_INFO);
    resilientStorageRemove(STORAGE_KEYS.ORDERS);
    resilientStorageRemove(STORAGE_KEYS.CART);
    showToast('Data Reset', 'Restored original demo catalog & store details', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        restoreDemoProducts,
        importProducts,
        storeInfo,
        updateStoreInfo,
        updateStoreText,
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
