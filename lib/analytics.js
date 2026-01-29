/**
 * Analytics and Monitoring Configuration
 * Integrates with Google Analytics, Sentry, and custom analytics
 */

// Google Analytics helper
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific user actions
export const analytics = {
  // User interactions
  trackButtonClick: (buttonName, location) => {
    trackEvent({
      action: 'click',
      category: 'Button',
      label: `${buttonName} - ${location}`,
    });
  },

  // Giving events
  trackGiving: (amount, category) => {
    trackEvent({
      action: 'giving_completed',
      category: 'Giving',
      label: category,
      value: parseFloat(amount),
    });
  },

  // Event registration
  trackEventRegistration: (eventName) => {
    trackEvent({
      action: 'register',
      category: 'Events',
      label: eventName,
    });
  },

  // Sermon engagement
  trackSermonPlay: (sermonTitle) => {
    trackEvent({
      action: 'play',
      category: 'Sermon',
      label: sermonTitle,
    });
  },

  trackSermonComplete: (sermonTitle) => {
    trackEvent({
      action: 'complete',
      category: 'Sermon',
      label: sermonTitle,
    });
  },

  // User authentication
  trackLogin: (method) => {
    trackEvent({
      action: 'login',
      category: 'Authentication',
      label: method,
    });
  },

  trackSignup: (method) => {
    trackEvent({
      action: 'signup',
      category: 'Authentication',
      label: method,
    });
  },

  // Search
  trackSearch: (query, resultsCount) => {
    trackEvent({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount,
    });
  },

  // Downloads
  trackDownload: (fileName, fileType) => {
    trackEvent({
      action: 'download',
      category: 'Downloads',
      label: `${fileName} (${fileType})`,
    });
  },

  // Video streaming
  trackLiveStreamJoin: () => {
    trackEvent({
      action: 'join',
      category: 'Live Stream',
      label: 'User joined live stream',
    });
  },

  // Social sharing
  trackShare: (platform, contentType, contentTitle) => {
    trackEvent({
      action: 'share',
      category: 'Social',
      label: `${platform} - ${contentType} - ${contentTitle}`,
    });
  },

  // Form submissions
  trackFormSubmit: (formName) => {
    trackEvent({
      action: 'submit',
      category: 'Form',
      label: formName,
    });
  },

  // Errors (for non-Sentry tracking)
  trackError: (errorMessage, errorLocation) => {
    trackEvent({
      action: 'error',
      category: 'Error',
      label: `${errorLocation}: ${errorMessage}`,
    });
  },
};

// Custom event tracking for business metrics
export const trackBusinessMetric = (metricName, value, metadata = {}) => {
  // Send to custom analytics endpoint
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    const data = {
      metric: metricName,
      value,
      metadata,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    navigator.sendBeacon('/api/metrics', JSON.stringify(data));
  }
};

export default analytics;
