/**
 * Centralized API Configuration
 * Uses validated environment variables from lib/env.js
 */

import { env } from './env';

const CONTENT_BASE_URL = 'https://content.lifereachchurch.org';
const API_URL = env.apiUrl;
const SOCKET_URL = env.socketUrl;

export { API_URL, SOCKET_URL, CONTENT_BASE_URL };
