/**
 * Performance Monitoring Utility
 * Tracks and reports web vitals
 */

export function reportWebVitals(metric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label,
      });
      
      navigator.sendBeacon('/api/vitals', body);
    }
  }
}

// Lazy load utilities
export const loadComponentLazy = (importFunc, options = {}) => {
  return dynamic(importFunc, {
    loading: () => options.loading || <div>Loading...</div>,
    ssr: options.ssr !== undefined ? options.ssr : true,
  });
};

// Image preloader
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Debounce function for performance
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  reportWebVitals,
  loadComponentLazy,
  preloadImage,
  debounce,
  throttle,
};
