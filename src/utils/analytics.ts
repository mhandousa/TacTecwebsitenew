import { GA_TRACKING_ID } from '@/config/env';
import { logger } from './logger';

// ... rest of the file stays the same, but replace console.log with logger.debug

export const pageview = (url: string): void => {
  if (typeof window === 'undefined') return;
  
  if (typeof window.gtag !== 'function') {
    logger.debug('[Analytics] gtag not loaded, pageview:', url);
    return;
  }

  if (!GA_TRACKING_ID) {
    logger.debug('[Analytics] No GA_TRACKING_ID, pageview:', url);
    return;
  }

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const trackEvent = (
  event: AnalyticsEvent | string, 
  params?: Record<string, any>
): void => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'function') {
    logger.debug('[Analytics] gtag not loaded, event:', event, params);
    return;
  }

  if (!GA_TRACKING_ID) {
    logger.debug('[Analytics] No GA_TRACKING_ID, event:', event, params);
    return;
  }

  window.gtag('event', event, params || {});
};

// ... rest of the file
