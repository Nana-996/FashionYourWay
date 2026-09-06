/**
 * FashionYourWay Global Cloud Synchronization Adapter
 * Enables multi-device real-time persistence so products uploaded
 * by the admin are instantly visible to visitors worldwide.
 */

const DEFAULT_CLOUD_OBJECT_ID = 'ff808181a067127101a074c25e2823bf';
const API_BASE_URL = 'https://api.restful-api.dev/objects';

/**
 * Get the active cloud catalog object ID (defaults to dedicated FashionYourWay instance)
 */
export const getCloudObjectId = () => {
  try {
    return localStorage.getItem('fyw_cloud_object_id') || DEFAULT_CLOUD_OBJECT_ID;
  } catch {
    return DEFAULT_CLOUD_OBJECT_ID;
  }
};

/**
 * Update or reset the cloud catalog object ID
 */
export const setCloudObjectId = (newId) => {
  try {
    if (newId) {
      localStorage.setItem('fyw_cloud_object_id', newId.trim());
    } else {
      localStorage.removeItem('fyw_cloud_object_id');
    }
  } catch (err) {
    console.warn('Could not persist cloud object ID:', err);
  }
};

/**
 * Fetch the latest live catalog and store info from the global cloud
 */
export const fetchCloudData = async () => {
  const objectId = getCloudObjectId();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(`${API_BASE_URL}/${objectId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        // Cloud object does not exist yet; will be created on first save
        return { success: false, notFound: true, error: 'Catalog object not initialized yet.' };
      }
      return { success: false, error: `HTTP ${res.status}` };
    }

    const json = await res.json();
    const cloudPayload = json.data || {};

    return {
      success: true,
      products: Array.isArray(cloudPayload.products) ? cloudPayload.products : null,
      storeInfo: cloudPayload.storeInfo || null,
      updatedAt: cloudPayload.updatedAt || json.updatedAt || null,
      version: cloudPayload.version || 1
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
 * Save products and/or store info to the global cloud
 */
export const saveCloudData = async ({ products, storeInfo }) => {
  const objectId = getCloudObjectId();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  const payload = {
    name: 'Fashion Your Way Boutique - Live Store Catalog',
    data: {
      version: 2,
      updatedAt: new Date().toISOString(),
      products: Array.isArray(products) ? products : [],
      ...(storeInfo ? { storeInfo } : {})
    }
  };

  try {
    const res = await fetch(`${API_BASE_URL}/${objectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return { success: true, timestamp: new Date().toISOString() };
    }

    // If PUT returns 404, create a new object
    if (res.status === 404) {
      const createRes = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (createRes.ok) {
        const created = await createRes.json();
        if (created && created.id) {
          setCloudObjectId(created.id);
        }
        return { success: true, timestamp: new Date().toISOString() };
      }
    }

    return { success: false, error: `HTTP ${res.status}` };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Cloud sync timed out' : err.message
    };
  }
};
