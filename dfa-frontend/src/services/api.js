import { API_BASE_URL } from '../utils/constants';

// Dynamic server connection state
let isServerOnline = false;

/**
 * Checks if the backend C++ server is online.
 */
export const checkBackendStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    
    const response = await fetch(`${API_BASE_URL}/dfa/list`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    isServerOnline = response.ok;
  } catch (error) {
    isServerOnline = false;
  }
  return isServerOnline;
};

// Auto-run status check on load
checkBackendStatus();

// Base client — solo usa el backend C++, sin fallback mock
export const apiClient = {
  isOnline: () => isServerOnline,

  get: async (endpoint) => {
    console.log(`[API] GET ${endpoint}`);
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    console.log(`[API] GET ${endpoint} -> ${res.status} (${data?.length ?? 1} elementos)`);
    return data;
  },

  post: async (endpoint, data) => {
    console.log(`[API] POST ${endpoint}`);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[API] POST ${endpoint} -> HTTP ${res.status}`, errText);
      throw new Error(errText || `HTTP Error ${res.status}`);
    }
    const result = await res.json();
    console.log(`[API] POST ${endpoint} -> ${res.status}`, result);
    return result;
  },

  delete: async (endpoint) => {
    console.log(`[API] DELETE ${endpoint}`);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const result = await res.json();
    console.log(`[API] DELETE ${endpoint} -> ${res.status}`, result);
    return result;
  }
};
