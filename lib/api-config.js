/**
 * Centralized API Configuration
 * Direct environment variable access to avoid build issues
 */

// Default to production URL if not set
const CONTENT_BASE_URL = 'https://content.lifereachchurch.org';
const API_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : CONTENT_BASE_URL;
const SOCKET_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SOCKET_URL
  ? process.env.NEXT_PUBLIC_SOCKET_URL
  : 'http://localhost:4000';

// Log configuration in development
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', { API_URL, SOCKET_URL });
}

export { API_URL, SOCKET_URL, CONTENT_BASE_URL };