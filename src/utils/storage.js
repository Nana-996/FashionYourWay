/**
 * Robust Hybrid Storage Layer for FashionYourWay.
 * Combines localStorage (for instant synchronous component state initialization)
 * with IndexedDB (virtually unlimited quota for high-resolution products & catalog assets).
 * Automatically catches and recovers from QuotaExceededError.
 */

const DB_NAME = 'fashionyourway_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_store';

let dbPromise = null;

const getDB = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB unavailable, using LocalStorage only.');
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB initialization failed:', err);
      resolve(null);
    }
  });
  return dbPromise;
};

export const idbGet = async (key) => {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

export const idbSet = async (key, value) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
};

export const idbRemove = async (key) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
};

/**
 * Synchronous read from LocalStorage with safe parsing.
 */
export const syncStorageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`LocalStorage read error for key "${key}":`, e);
    return defaultValue;
  }
};

/**
 * Resilient write: saves to LocalStorage, and automatically mirrors to IndexedDB.
 * If LocalStorage exceeds quota, it gracefully persists to IndexedDB without crashing.
 */
export const resilientStorageSet = (key, value) => {
  // Always mirror asynchronously to IndexedDB
  idbSet(key, value).catch(() => {});

  // Try LocalStorage
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      console.warn(`LocalStorage quota exceeded for "${key}". Data safely saved in IndexedDB!`);
      // Try to clean up any obsolete legacy keys
      try {
        ['fyw_products_v1', 'fyw_products_v2', 'fyw_products_v3_gh'].forEach(k => localStorage.removeItem(k));
      } catch {}
    } else {
      console.error(`Storage write failed for "${key}":`, e);
    }
    return false;
  }
};

export const resilientStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
  idbRemove(key).catch(() => {});
};
