import { GA_TRACKING_ID } from '@/config/env';

/**
 * Google Analytics tracking ID
 * Validated and imported from environment configuration
 */
export { GA_TRACKING_ID };

/**
 * Analytics event names - centralized for type safety
 */
export const ANALYTICS_EVENTS = {
  // CTA Events
  CTA_START: 'cta_start',
  CTA_DEMO: 'cta_demo',
  CTA_DEMO_BOTTOM: 'cta_demo_bottom',
  CTA_APP_BOTTOM: 'cta_app_bottom',
  
  // Navigation Events
  NAV_CHALLENGE: 'nav_challenge',
  NAV_SOLUTION: 'nav_solution',
  NAV_FEATURES: 'nav_features',
  NAV_TECH: 'nav_tech',
  
  // Language Events
  LANGUAGE_SWITCH: 'language_switch',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Send a pageview event to Google Analytics
 * @param url - The page URL or path
 */
export const pageview = (url: string): void => {
  if (typeof window === 'undefined') return;
  
  if (typeof window.gtag !== 'function') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] gtag not loaded, pageview:', url);
    }
    return;
  }

  if (!GA_TRACKING_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] No GA_TRACKING_ID, pageview:', url);
    }
    return;
  }

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

/**
 * Track a custom event in Google Analytics
 * @param event - The event name (use ANALYTICS_EVENTS constants)
 * @param params - Additional event parameters
 */
export const trackEvent = (
  event: AnalyticsEvent | string, 
  params?: Record<string, any>
): void => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'function') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] gtag not loaded, event:', event, params);
    }
    return;
  }

  if (!GA_TRACKING_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] No GA_TRACKING_ID, event:', event, params);
    }
    return;
  }

  window.gtag('event', event, params || {});
};

/**
 * Track language switch event
 * @param from - Previous language code
 * @param to - New language code
 */
export const trackLanguageSwitch = (from: string, to: string): void => {
  trackEvent(ANALYTICS_EVENTS.LANGUAGE_SWITCH, {
    from_language: from,
    to_language: to,
  });
};
