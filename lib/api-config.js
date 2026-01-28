// Centralized API Configuration
const CONTENT_BASE_URL = 'https://content.lifereachchurch.org';
const API_URL = process.env.NEXT_PUBLIC_API_URL || CONTENT_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export { API_URL, SOCKET_URL, CONTENT_BASE_URL };
