/**
 * Error Monitoring Configuration
 * Setup for Sentry or similar error tracking service
 */

// Initialize Sentry (or other error tracking)
export const initErrorMonitoring = () => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry initialization would go here
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    // });
    console.log('Error monitoring initialized');
  }
};

// Custom error logger
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry or custom endpoint
    if (typeof window !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/errors', JSON.stringify(errorInfo));
    }
  }
};

// Rate limiting helper
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isRateLimited(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return true;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return false;
  }

  reset(identifier) {
    this.requests.delete(identifier);
  }
}

export default {
  initErrorMonitoring,
  logError,
  RateLimiter,
};
