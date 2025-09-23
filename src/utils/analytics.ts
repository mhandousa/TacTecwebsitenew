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
  
  // Engagement Events
  SCROLL_DEPTH_25: 'scroll_depth_25',
  SCROLL_DEPTH_50: 'scroll_depth_50',
  SCROLL_DEPTH_75: 'scroll_depth_75',
  SCROLL_DEPTH_100: 'scroll_depth_100',
  
  // External Link Events
  EXTERNAL_LINK_CLICK: 'external_link_click',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Send a pageview event to Google Analytics
 * USE ONLY FOR PAGE NAVIGATION, not for button clicks
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
 * USE THIS for button clicks, interactions, and custom events
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

/**
 * Track external link clicks
 * @param url - The external URL being clicked
 * @param linkText - The text of the link
 */
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK, {
    url,
    link_text: linkText,
  });
};

/**
 * Track scroll depth milestones
 * @param percentage - Scroll depth percentage (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage: number): void => {
  const eventMap: Record<number, AnalyticsEvent> = {
    25: ANALYTICS_EVENTS.SCROLL_DEPTH_25,
    50: ANALYTICS_EVENTS.SCROLL_DEPTH_50,
    75: ANALYTICS_EVENTS.SCROLL_DEPTH_75,
    100: ANALYTICS_EVENTS.SCROLL_DEPTH_100,
  };

  const event = eventMap[percentage];
  if (event) {
    trackEvent(event, { scroll_depth: percentage });
  }
};

/**
 * Initialize scroll depth tracking
 * Call this once when the page loads
 */
export const initScrollTracking = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const scrollDepths = [25, 50, 75, 100];
  const triggered = new Set<number>();

  const handleScroll = () => {
    const scrollPercentage = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );

    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !triggered.has(depth)) {
        triggered.add(depth);
        trackScrollDepth(depth);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};
