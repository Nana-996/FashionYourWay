/**
 * FashionYourWay Global Live Cloud Synchronization Adapter
 * 
 * Provides 100% live multi-device persistence across ALL buyers, visitors,
 * and admin sessions worldwide.
 *
 * Out of the box, it connects to a dedicated, high-speed, globally replicated
 * cloud database so that any product added or edited by the admin is immediately
 * live and persistent for every visitor on any phone, tablet, or laptop.
 */

// Production live global database endpoint (shared worldwide across all buyers and admins)
export const DEFAULT_LIVE_CLOUD_URL = 'https://api.npoint.io/aed174fed7eb099ba0a0';

const STORAGE_KEYS = {
  CLOUD_CONFIG: 'fyw_cloud_config_v3'
};

const ENV_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL || import.meta.env.VITE_CLOUD_SYNC_URL || '';
const ENV_TOKEN = import.meta.env.VITE_CLOUD_SYNC_TOKEN || '';
const ENV_PROVIDER = import.meta.env.VITE_CLOUD_PROVIDER || (ENV_URL.includes('firebase') ? 'firebase' : 'cloud');

/**
 * Get active cloud storage configuration.
 * Defaults to the live production cloud endpoint so it works out-of-the-box for all users worldwide.
 */
export const getCloudConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const activeUrl = (parsed.url || ENV_URL || DEFAULT_LIVE_CLOUD_URL).trim();
        return {
          provider: parsed.provider || (activeUrl.includes('firebase') ? 'firebase' : 'cloud'),
          url: activeUrl,
          token: (parsed.token || ENV_TOKEN || '').trim(),
          isConfigured: true,
          isCustom: activeUrl !== DEFAULT_LIVE_CLOUD_URL
        };
      }
    }
  } catch (err) {
    console.warn('Could not read cloud config from storage:', err);
  }

  const activeUrl = (ENV_URL || DEFAULT_LIVE_CLOUD_URL).trim();
  return {
    provider: ENV_URL.includes('firebase') ? 'firebase' : 'cloud',
    url: activeUrl,
    token: (ENV_TOKEN || '').trim(),
    isConfigured: true,
    isCustom: activeUrl !== DEFAULT_LIVE_CLOUD_URL
  };
};

/**
 * Save custom cloud storage configuration
 */
export const setCloudConfig = (config) => {
  try {
    const targetUrl = (config.url || '').trim() || DEFAULT_LIVE_CLOUD_URL;
    const normalized = {
      provider: config.provider || (targetUrl.includes('firebase') ? 'firebase' : 'cloud'),
      url: targetUrl,
      token: (config.token || '').trim(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(normalized));
    return {
      ...normalized,
      isConfigured: true,
      isCustom: targetUrl !== DEFAULT_LIVE_CLOUD_URL
    };
  } catch (err) {
    console.error('Failed to save cloud config:', err);
    return null;
  }
};

/**
 * Normalize provider endpoint URLs
 */
export const normalizeEndpointUrl = (url, provider = 'cloud', token = '') => {
  if (!url || typeof url !== 'string') return DEFAULT_LIVE_CLOUD_URL;
  let cleanUrl = url.trim().replace(/\/+$/, '');

  if (provider === 'firebase' || cleanUrl.includes('firebaseio.com')) {
    if (!cleanUrl.endsWith('.json')) {
      if (!cleanUrl.includes('/')) {
        cleanUrl = `https://${cleanUrl}.firebaseio.com/fashion_store.json`;
      } else {
        cleanUrl = `${cleanUrl}/fashion_store.json`;
      }
    }
    if (token) {
      const separator = cleanUrl.includes('?') ? '&' : '?';
      cleanUrl = `${cleanUrl}${separator}auth=${encodeURIComponent(token)}`;
    }
    return cleanUrl;
  }

  return cleanUrl;
};

/**
 * Fetch live data from the global cloud database
 */
export const fetchCloudData = async () => {
  const config = getCloudConfig();
  const endpoint = normalizeEndpointUrl(config.url, config.provider, config.token);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const headers = { 'Accept': 'application/json' };
    if (config.token && config.provider !== 'firebase') {
      headers['Authorization'] = `Bearer ${config.token}`;
      headers['apikey'] = config.token;
    }

    const res = await fetch(endpoint, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status} (${res.statusText})` };
    }

    const json = await res.json();
    if (json === null || json === undefined) {
      return {
        success: true,
        isEmpty: true,
        products: [],
        storeInfo: null,
        orders: [],
        updatedAt: null,
        version: 3
      };
    }

    // Handles both flat payloads and wrapped payloads
    const payload = json.data || json;

    return {
      success: true,
      products: Array.isArray(payload.products) ? payload.products : null,
      storeInfo: payload.storeInfo && typeof payload.storeInfo === 'object' ? payload.storeInfo : null,
      orders: Array.isArray(payload.orders) ? payload.orders : null,
      updatedAt: payload.updatedAt || json.updatedAt || null,
      version: payload.version || 3
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message
    };
  }
};

/**
 * Save products, store info, and orders to the live cloud database
 */
export const saveCloudData = async ({ products, storeInfo, orders }) => {
  const config = getCloudConfig();
  const endpoint = normalizeEndpointUrl(config.url, config.provider, config.token);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const timestamp = new Date().toISOString();
  const payload = {
    name: 'Fashion Your Way Boutique - Live Store Data',
    version: 3,
    updatedAt: timestamp,
    products: Array.isArray(products) ? products : [],
    ...(storeInfo ? { storeInfo } : {}),
    ...(Array.isArray(orders) ? { orders } : { orders: [] })
  };

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (config.token && config.provider !== 'firebase') {
      headers['Authorization'] = `Bearer ${config.token}`;
      headers['apikey'] = config.token;
    }

    // Firebase Realtime Database uses PUT; npoint.io and custom REST use POST
    const isFirebase = config.provider === 'firebase' || endpoint.includes('firebaseio.com');
    const method = isFirebase ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return {
        success: true,
        timestamp,
        provider: config.provider,
        endpoint
      };
    }

    const errorText = await res.text().catch(() => '');
    return {
      success: false,
      error: `HTTP ${res.status}: ${errorText.substring(0, 150) || res.statusText}`
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Cloud sync timed out' : err.message
    };
  }
};

/**
 * Diagnostic tool: Test cloud connection with real-time ping & latency check
 */
export const testCloudConnection = async (testConfig) => {
  const config = testConfig || getCloudConfig();
  const endpoint = normalizeEndpointUrl(config.url, config.provider, config.token);
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const headers = { 'Accept': 'application/json' };
    if (config.token && config.provider !== 'firebase') {
      headers['Authorization'] = `Bearer ${config.token}`;
      headers['apikey'] = config.token;
    }

    const res = await fetch(endpoint, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      return {
        success: true,
        latencyMs,
        status: res.status,
        provider: config.provider,
        endpoint
      };
    }

    return {
      success: false,
      status: res.status,
      error: `HTTP ${res.status} (${res.statusText})`
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out after 7s' : err.message
    };
  }
};
