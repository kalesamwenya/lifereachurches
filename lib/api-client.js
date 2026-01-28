/**
 * Centralized API Client with Error Handling and Retry Logic
 * Provides a consistent interface for all API calls
 */

import axios from 'axios';
import { API_URL } from './api-config';

// Response cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🔴 API Error: ${error.response?.status} ${originalRequest?.url}`, error.response?.data);
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized - redirect to login
      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
        return Promise.reject(new ApiError('Unauthorized', status, data));
      }

      // Retry on server errors (500+) with exponential backoff
      if (status >= 500 && !originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (originalRequest._retryCount < 3) {
          originalRequest._retryCount++;
          const delay = Math.min(1000 * Math.pow(2, originalRequest._retryCount), 10000);
          
          await new Promise((resolve) => setTimeout(resolve, delay));
          return apiClient(originalRequest);
        }
      }

      // Format error message
      const message = data?.message || data?.error || `Request failed with status ${status}`;
      throw new ApiError(message, status, data);
    }

    // Network error
    if (error.request) {
      throw new ApiError('Network error. Please check your connection.', 0, null);
    }

    // Other errors
    throw new ApiError(error.message || 'An unexpected error occurred', 0, null);
  }
);

/**
 * API Request Methods with Caching
 */
export const api = {
  /**
   * GET request with optional caching
   */
  get: async (url, options = {}) => {
    const { cache: useCache = true, ...config } = options;
    const cacheKey = `GET:${url}:${JSON.stringify(config.params || {})}`;

    // Check cache for GET requests
    if (useCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`💾 Cache hit: ${url}`);
        }
        return cached.data;
      }
      cache.delete(cacheKey);
    }

    const response = await apiClient.get(url, config);

    // Cache successful GET requests
    if (useCache) {
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response.data;
  },

  /**
   * POST request
   */
  post: async (url, data, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async (url, data, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async (url, data, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  /**
   * Clear cache
   */
  clearCache: () => {
    cache.clear();
  },

  /**
   * Remove specific cache entry
   */
  invalidateCache: (pattern) => {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  },
};

// Export for direct axios usage if needed
export { apiClient };
export default api;
