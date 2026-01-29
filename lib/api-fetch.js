/**
 * Simple Fetch Wrapper for API Calls
 * Alternative to axios for better Vercel compatibility
 */

const CONTENT_BASE_URL = 'https://content.lifereachchurch.org';
const API_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : CONTENT_BASE_URL;

class ApiFetchError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiFetchError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch wrapper with retry logic
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  const { timeout = 30000, ...fetchOptions } = options;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiFetchError(
          errorData.message || `HTTP Error ${response.status}`,
          response.status,
          errorData
        );
      }

      return response;
    } catch (error) {
      if (i === retries - 1 || error.name === 'AbortError') {
        throw error;
      }
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 5000)));
    }
  }
}

/**
 * Simple API helper functions
 */
export const apiFetch = {
  /**
   * GET request
   */
  get: async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🔵 API GET:', url);
    }

    const response = await fetchWithRetry(url, {
      method: 'GET',
      ...options,
    });

    return response.json();
  },

  /**
   * POST request
   */
  post: async (endpoint, data, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🔵 API POST:', url);
    }

    const response = await fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });

    return response.json();
  },

  /**
   * PUT request
   */
  put: async (endpoint, data, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetchWithRetry(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });

    return response.json();
  },

  /**
   * DELETE request
   */
  delete: async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetchWithRetry(url, {
      method: 'DELETE',
      ...options,
    });

    return response.json();
  },
};

export { API_URL, ApiFetchError };
export default apiFetch;
