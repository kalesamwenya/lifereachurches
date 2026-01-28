/**
 * Environment Variable Validation
 * Validates and exports environment variables with type safety
 */

class EnvValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

const getEnvVar = (key, defaultValue = undefined, required = false) => {
  const value = process.env[key] || defaultValue;

  if (required && !value) {
    throw new EnvValidationError(
      `Missing required environment variable: ${key}`
    );
  }

  return value;
};

const validateUrl = (url, varName) => {
  if (!url) return url;
  
  try {
    new URL(url);
    return url;
  } catch {
    throw new EnvValidationError(
      `Invalid URL for ${varName}: ${url}`
    );
  }
};

// Validate and export environment variables
export const env = {
  // API Configuration
  apiUrl: validateUrl(
    getEnvVar('NEXT_PUBLIC_API_URL', 'https://content.lifereachchurch.org'),
    'NEXT_PUBLIC_API_URL'
  ),
  socketUrl: validateUrl(
    getEnvVar('NEXT_PUBLIC_SOCKET_URL', 'http://localhost:4000'),
    'NEXT_PUBLIC_SOCKET_URL'
  ),

  // NextAuth
  nextAuthUrl: validateUrl(
    getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
    'NEXTAUTH_URL'
  ),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),

  // Node Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Feature Flags
  enableChat: getEnvVar('NEXT_PUBLIC_ENABLE_CHAT', 'true') === 'true',
  enableLiveStream: getEnvVar('NEXT_PUBLIC_ENABLE_LIVE_STREAM', 'true') === 'true',
};

// Log validation success in development
if (env.isDevelopment) {
  console.log('✅ Environment variables validated successfully');
}

export default env;
