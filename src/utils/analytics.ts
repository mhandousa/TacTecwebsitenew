import { GA_TRACKING_ID } from '@/config/env';
import { logger } from './logger';

// Strict event types
export type AnalyticsEvent = 
  | 'page_view'
  | 'form_submit'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'demo_request'
  | 'language_switch'
  | 'cta_click'
  | 'scroll_depth';

// Strict event parameters
export interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  form_type?: string;
  request_type?: string;
  error?: string;
  from_language?: string;
  to_language?: string;
  type?: string;
  depth?: number;
  club?: string;
  [key: string]: string | number | boolean | undefined;
}

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
  event: AnalyticsEvent,
  params?: EventParams
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

// Helper functions
export const trackLanguageSwitch = (fromLang: string, toLang: string): void => {
  trackEvent('language_switch', {
    from_language: fromLang,
    to_language: toLang,
  });
};

export const trackFormSubmit = (formType: string, requestType?: string): void => {
  trackEvent('form_submit', {
    form_type: formType,
    request_type: requestType,
  });
};

export const trackScrollDepth = (depth: number): void => {
  trackEvent('scroll_depth', {
    depth,
  });
};
