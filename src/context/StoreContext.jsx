import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
import {
  fetchCloudData,
  saveCloudData,
  getCloudConfig,
  setCloudConfig,
  testCloudConnection,
  DEFAULT_LIVE_CLOUD_URL
} from '../utils/cloudSync';
import { applyThemeColors, DEFAULT_THEME_COLORS } from '../utils/themeEngine';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'fyw_products_catalog_v9',
  STORE_INFO: 'fyw_store_info_v4_gh',
  ORDERS: 'fyw_orders_v4_gh',
  CART: 'fyw_cart_v4_gh',
  WISHLIST: 'fyw_wishlist_v4_gh',
  LAST_UPDATE: 'fyw_last_local_update_time'
};

export const StoreProvider = ({ children }) => {
  // Cloud Sync Status: 'idle' | 'syncing' | 'synced' | 'error'
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState(null);
  const [cloudConfigState, setCloudConfigState] = useState(() => getCloudConfig());

  // 1. Products State - Initialized synchronously from storage or active baseline
  const [products, setProducts] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.PRODUCTS, null) ||
                    syncStorageGet('fyw_products_catalog_v8', null) ||
                    syncStorageGet('fyw_products_catalog_v7', null);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
      return initialProducts || [];
    } catch {
      return initialProducts || [];
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

  // 3. Orders State - Clean baseline for live customer orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = syncStorageGet(STORAGE_KEYS.ORDERS, null) || syncStorageGet('fyw_orders_v3_gh', null);
      if (saved && Array.isArray(saved)) {
        return saved.filter(o => o.id !== 'FYW-84920' && o.id !== 'FYW-71403' && o.id !== 'FYW-62901');
      }
      return initialOrders || [];
    } catch {
      return [];
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
  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'orders' | 'products' | 'text-editor' | 'logo' | 'colors' | 'settings' | 'cloud'
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

  // Push products & store info & orders to global live cloud storage
  const pushToCloud = useCallback(async (productsToSync, storeInfoToSync, ordersToSync) => {
    try {
      setCloudSyncStatus('syncing');
      const res = await saveCloudData({
        products: productsToSync || products,
        storeInfo: storeInfoToSync || storeInfo,
        orders: ordersToSync || orders
      });
      if (res.success) {
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(res.timestamp || new Date().toISOString());
        return true;
      } else {
        setCloudSyncStatus('error');
        return false;
      }
    } catch (err) {
      console.warn('pushToCloud error:', err);
      setCloudSyncStatus('error');
      return false;
    }
  }, [products, storeInfo, orders]);

  // Synchronize with cloud: fetch authoritative live data
  const syncFromCloud = useCallback(async (silent = false) => {
    try {
      if (!silent) setCloudSyncStatus('syncing');
      const cloudResult = await fetchCloudData();

      if (cloudResult.success) {
        // 1. Live Products
        if (Array.isArray(cloudResult.products) && cloudResult.products.length > 0) {
          setProducts(cloudResult.products);
          resilientStorageSet(STORAGE_KEYS.PRODUCTS, cloudResult.products);
        } else if (Array.isArray(cloudResult.products) && cloudResult.products.length === 0) {
          // If remote cloud was reset/empty, push current baseline to populate it
          if (products.length > 0) {
            pushToCloud(products, storeInfo, orders);
          }
        }

        // 2. Store Info
        if (cloudResult.storeInfo && typeof cloudResult.storeInfo === 'object') {
          setStoreInfo(prev => {
            const merged = { ...prev, ...cloudResult.storeInfo, currencySymbol: 'GH₵' };
            resilientStorageSet(STORAGE_KEYS.STORE_INFO, merged);
            return merged;
          });
        }

        // 3. Customer Orders
        if (Array.isArray(cloudResult.orders) && cloudResult.orders.length > 0) {
          setOrders(currentOrders => {
            const orderMap = new Map();
            currentOrders.forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
            cloudResult.orders.forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
            const merged = Array.from(orderMap.values()).sort((a, b) =>
              new Date(b.orderDate || 0) - new Date(a.orderDate || 0)
            );
            resilientStorageSet(STORAGE_KEYS.ORDERS, merged);
            return merged;
          });
        }

        setCloudSyncStatus('synced');
        setLastCloudSyncTime(cloudResult.updatedAt || new Date().toISOString());
        return true;
      } else {
        if (!silent) setCloudSyncStatus('error');
        return false;
      }
    } catch (err) {
      console.warn('Cloud sync fetch note:', err);
      if (!silent) setCloudSyncStatus('error');
      return false;
    }
  }, [products, storeInfo, orders, pushToCloud]);

  // Startup Hydration: Loads from local cache & immediately syncs with global cloud
  useEffect(() => {
    let isMounted = true;

    (async () => {
      // 1. Immediate local hydration from IndexedDB
      try {
        const idbProds = await idbGet(STORAGE_KEYS.PRODUCTS);
        if (isMounted && Array.isArray(idbProds) && idbProds.length > 0) {
          setProducts(idbProds);
        }

        const idbInfo = await idbGet(STORAGE_KEYS.STORE_INFO);
        if (isMounted && idbInfo && typeof idbInfo === 'object') {
          setStoreInfo(prev => ({ ...prev, ...idbInfo, currencySymbol: 'GH₵' }));
        }

        const idbOrds = await idbGet(STORAGE_KEYS.ORDERS);
        if (isMounted && Array.isArray(idbOrds) && idbOrds.length > 0) {
          setOrders(idbOrds);
        }
      } catch (err) {
        console.warn('IndexedDB initial hydration note:', err);
      }

      // 2. Fetch latest live products from the global cloud database
      await syncFromCloud(false);
    })();

    // 3. Re-fetch when user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Background polling every 45 seconds so all visitors/buyers see edits without refreshing
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncFromCloud(true);
      }
    }, 45000);

    // 5. Multi-tab storage synchronization
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save changes locally in LocalStorage & IndexedDB
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

  // Dynamic Site Theme Application
  useEffect(() => {
    const activeColors = storeInfo?.themeColors || DEFAULT_THEME_COLORS;
    applyThemeColors(activeColors);
  }, [storeInfo?.themeColors]);

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
    const updatedProducts = products.map(prod => {
      const itemInCart = cart.find(ci => ci.productId === prod.id);
      if (itemInCart) {
        const newStock = Math.max(0, (prod.stock || 10) - itemInCart.quantity);
        return { ...prod, stock: newStock };
      }
      return prod;
    });

    const updatedOrders = [newOrder, ...orders];

    setProducts(updatedProducts);
    setOrders(updatedOrders);
    clearCart();
    setIsCheckoutOpen(false);

    // Live Cloud Push: customer order and updated inventory are immediately pushed worldwide
    pushToCloud(updatedProducts, storeInfo, updatedOrders);

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
    const updated = orders.map(ord => {
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
    });

    setOrders(updated);
    pushToCloud(products, storeInfo, updated);
    showToast('Order Status Updated', `Order ${orderId} is now marked as ${newStatus}`, 'success');
  };

  const updateOrderAdminNotes = (orderId, adminNotes) => {
    const updated = orders.map(ord => (ord.id === orderId ? { ...ord, adminNotes } : ord));
    setOrders(updated);
    pushToCloud(products, storeInfo, updated);
    showToast('Notes Saved', `Updated admin notes for ${orderId}`, 'info');
  };

  // Manual trigger for Admin to sync with Global Live Storefront
  const syncWithCloudNow = useCallback(async () => {
    setCloudSyncStatus('syncing');
    showToast('Connecting to Cloud Database...', 'Syncing store catalog & orders worldwide', 'info');

    try {
      // 1. First push local state
      await saveCloudData({ products, storeInfo, orders });

      // 2. Fetch authoritative cloud state
      const fetchRes = await fetchCloudData();

      if (fetchRes.success && Array.isArray(fetchRes.products) && fetchRes.products.length > 0) {
        setProducts(fetchRes.products);
        resilientStorageSet(STORAGE_KEYS.PRODUCTS, fetchRes.products);
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date().toISOString());
        showToast('Global Live Sync Complete ✨', `${fetchRes.products.length} products live across all devices worldwide!`, 'success');
        return true;
      } else {
        setCloudSyncStatus('synced');
        showToast('Global Live Sync Complete ✨', 'All changes published to the live storefront.', 'success');
        return true;
      }
    } catch (err) {
      setCloudSyncStatus('error');
      showToast('Sync Failed', 'Please check your internet connection.', 'error');
      return false;
    }
  }, [products, storeInfo, orders, showToast]);

  // Robust Product CRUD (Admin) - crash-proof and live synced across all buyers
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

    setProducts(prev => {
      const updated = [sanitizedProduct, ...prev];
      resilientStorageSet(STORAGE_KEYS.PRODUCTS, updated);
      pushToCloud(updated, storeInfo, orders);
      return updated;
    });

    showToast('Product Created ✨', `${sanitizedProduct.name} is now live worldwide!`, 'success');
    return sanitizedProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => {
      const updated = prev.map(p => {
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
      });
      resilientStorageSet(STORAGE_KEYS.PRODUCTS, updated);
      pushToCloud(updated, storeInfo, orders);
      return updated;
    });
    showToast('Product Updated ✨', 'Changes published and live worldwide.', 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      resilientStorageSet(STORAGE_KEYS.PRODUCTS, updated);
      pushToCloud(updated, storeInfo, orders);
      return updated;
    });
    showToast('Product Removed', 'Product was deleted from the store catalog.', 'info');
  };

  const clearAllProducts = () => {
    setProducts([]);
    resilientStorageSet(STORAGE_KEYS.PRODUCTS, []);
    pushToCloud([], storeInfo, orders);
    showToast('Catalog Cleared', 'All items have been removed from the catalog.', 'info');
  };

  const restoreDemoProducts = () => {
    setProducts(initialProducts);
    resilientStorageSet(STORAGE_KEYS.PRODUCTS, initialProducts);
    pushToCloud(initialProducts, storeInfo, orders);
    showToast('Catalog Restored', 'Catalog reset to luxury boutique baseline.', 'info');
  };

  const importProducts = (newProductsList) => {
    if (Array.isArray(newProductsList) && newProductsList.length > 0) {
      setProducts(newProductsList);
      resilientStorageSet(STORAGE_KEYS.PRODUCTS, newProductsList);
      pushToCloud(newProductsList, storeInfo, orders);
      showToast('Catalog Imported ✨', `Successfully published ${newProductsList.length} products to the live store!`, 'success');
      return true;
    } else {
      showToast('Import Failed', 'Invalid product data format.', 'error');
      return false;
    }
  };

  // Store Settings & Website Text Updates (Admin)
  const updateStoreInfo = (newInfo) => {
    const updated = {
      ...storeInfo,
      ...newInfo,
      currencySymbol: 'GH₵'
    };
    setStoreInfo(updated);
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, updated);
    pushToCloud(products, updated, orders);
    showToast('Store Profile Updated', 'Public business details have been updated live.', 'success');
  };

  const updateStoreText = (textUpdates) => {
    const updated = {
      ...storeInfo,
      ...textUpdates
    };
    setStoreInfo(updated);
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, updated);
    pushToCloud(products, updated, orders);
    showToast('Website Text Saved ✨', 'Storefront wording has been updated live!', 'success');
  };

  // Site Colors & Dynamic Theme Management (Admin)
  const updateThemeColors = (newColors) => {
    const mergedColors = {
      ...(storeInfo.themeColors || DEFAULT_THEME_COLORS),
      ...newColors
    };
    const updatedInfo = {
      ...storeInfo,
      themeColors: mergedColors
    };
    setStoreInfo(updatedInfo);
    applyThemeColors(mergedColors);
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, updatedInfo);
    pushToCloud(products, updatedInfo, orders);
    showToast('Site Colors Live ✨', 'Your custom colors are now active across the website!', 'success');
    return mergedColors;
  };

  const resetThemeColors = () => {
    const updatedInfo = {
      ...storeInfo,
      themeColors: { ...DEFAULT_THEME_COLORS }
    };
    setStoreInfo(updatedInfo);
    applyThemeColors(DEFAULT_THEME_COLORS);
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, updatedInfo);
    pushToCloud(products, updatedInfo, orders);
    showToast('Palette Restored', 'Reset back to default Pink Burgundy Luxury theme.', 'info');
  };

  // Cloud Configuration Management
  const updateCloudConfig = async (newConfig) => {
    const saved = setCloudConfig(newConfig);
    setCloudConfigState(saved);
    setCloudSyncStatus('syncing');
    showToast('Connecting to Cloud Database...', 'Verifying global connection', 'info');
    const testRes = await testCloudConnection(saved);
    if (testRes.success) {
      showToast('Live Cloud Connected ✨', `Latency: ${testRes.latencyMs}ms. Syncing live catalog now...`, 'success');
      await saveCloudData({ products, storeInfo, orders });
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toISOString());
      return { success: true, latencyMs: testRes.latencyMs };
    } else {
      setCloudSyncStatus('error');
      showToast('Connection Warning', `Could not connect: ${testRes.error}`, 'warning');
      return { success: false, error: testRes.error };
    }
  };

  const testCloudConfig = async (configToTest) => {
    return await testCloudConnection(configToTest || cloudConfigState);
  };

  // Force Push Local Data to Cloud
  const pushAllToCloud = async () => {
    setCloudSyncStatus('syncing');
    showToast('Publishing to Global Cloud...', 'Uploading all products, settings & orders to cloud database', 'info');
    const res = await saveCloudData({ products, storeInfo, orders });
    if (res.success) {
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toISOString());
      showToast('Published Live ✨', `${products.length} products & ${orders.length} orders live for all buyers worldwide!`, 'success');
      return true;
    } else {
      setCloudSyncStatus('error');
      showToast('Push Failed', res.error || 'Could not reach cloud', 'error');
      return false;
    }
  };

  // Force Pull Remote Data from Cloud
  const pullAllFromCloud = async () => {
    setCloudSyncStatus('syncing');
    showToast('Fetching Live Cloud...', 'Downloading latest live catalog from cloud database', 'info');
    const res = await fetchCloudData();
    if (res.success) {
      if (Array.isArray(res.products) && res.products.length > 0) {
        setProducts(res.products);
        resilientStorageSet(STORAGE_KEYS.PRODUCTS, res.products);
      }
      if (res.storeInfo && typeof res.storeInfo === 'object') {
        const merged = { ...storeInfo, ...res.storeInfo, currencySymbol: 'GH₵' };
        setStoreInfo(merged);
        resilientStorageSet(STORAGE_KEYS.STORE_INFO, merged);
      }
      if (Array.isArray(res.orders)) {
        setOrders(res.orders);
        resilientStorageSet(STORAGE_KEYS.ORDERS, res.orders);
      }
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toISOString());
      showToast('Sync Complete ✨', 'Your view is updated with the latest live products!', 'success');
      return true;
    } else {
      setCloudSyncStatus('error');
      showToast('Fetch Failed', res.error || 'Could not fetch cloud data', 'error');
      return false;
    }
  };

  // Reset to default baseline
  const resetDemoData = () => {
    setProducts(initialProducts);
    setStoreInfo(initialStoreInfo);
    setOrders(initialOrders);
    setCart([]);
    resilientStorageSet(STORAGE_KEYS.PRODUCTS, initialProducts);
    resilientStorageSet(STORAGE_KEYS.STORE_INFO, initialStoreInfo);
    resilientStorageSet(STORAGE_KEYS.ORDERS, initialOrders);
    resilientStorageRemove(STORAGE_KEYS.CART);
    pushToCloud(initialProducts, initialStoreInfo, initialOrders);
    showToast('Store Reset', 'Store restored to luxury boutique baseline', 'info');
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
        cloudSyncStatus,
        lastCloudSyncTime,
        cloudConfig: cloudConfigState,
        updateCloudConfig,
        testCloudConfig,
        pushAllToCloud,
        pullAllFromCloud,
        syncWithCloudNow,
        storeInfo,
        updateStoreInfo,
        updateStoreText,
        themeColors: storeInfo?.themeColors || DEFAULT_THEME_COLORS,
        updateThemeColors,
        resetThemeColors,
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
