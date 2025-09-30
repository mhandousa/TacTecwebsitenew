/**
 * Environment Variables Configuration and Validation
 * 
 * This file validates and exports all environment variables used in the application.
 * It ensures type safety and proper error handling for missing required variables.
 */

interface EnvConfig {
  GA_TRACKING_ID: string;
  SITE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  SENTRY_DSN: string;
  ERROR_ENDPOINT: string;
}

/**
 * Validates that required environment variables are present
 */
function validateEnv(): EnvConfig {
  const NODE_ENV = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? '';
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';
  const SITE_URL = rawSiteUrl.replace(/\/$/, '');
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ?? '';
  const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT?.trim() ?? '';

  // Validation for production environment
  if (NODE_ENV === 'production') {
    const errors: string[] = [];

    if (!GA_TRACKING_ID) {
      console.warn('⚠️  NEXT_PUBLIC_GA_ID is not set. Analytics will not work.');
    } else if (!GA_TRACKING_ID.match(/^G-[A-Z0-9]+$/)) {
      console.warn(`⚠️  GA_TRACKING_ID has invalid format: ${GA_TRACKING_ID}`);
    }

    if (!SITE_URL) {
      errors.push('NEXT_PUBLIC_SITE_URL is required in production!');
    } else if (!SITE_URL.match(/^https?:\/\/.+/)) {
      errors.push(`SITE_URL has invalid format: ${SITE_URL}`);
    }

    if (!SENTRY_DSN && !ERROR_ENDPOINT) {
      console.warn('⚠️  No error reporting configured. Set NEXT_PUBLIC_SENTRY_DSN or NEXT_PUBLIC_ERROR_ENDPOINT.');
    } else if (SENTRY_DSN && !SENTRY_DSN.match(/^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.(sentry\.io|de\.sentry\.io)\/[0-9]+$/)) {
      console.warn(`⚠️  SENTRY_DSN has invalid format: ${SENTRY_DSN}`);
    }

    if (errors.length > 0) {
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
  }

  if (!SITE_URL && NODE_ENV !== 'development') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be configured outside of development.');
  }

  return {
    GA_TRACKING_ID,
    SITE_URL: SITE_URL || 'http://localhost:3000',
    NODE_ENV,
    SENTRY_DSN,
    ERROR_ENDPOINT,
  };
}

// Export validated environment variables
export const env = validateEnv();

// Export individual variables for convenience
export const { 
  GA_TRACKING_ID, 
  SITE_URL, 
  NODE_ENV,
  SENTRY_DSN,
  ERROR_ENDPOINT,
} = env;

// Helper functions
export const isProd = NODE_ENV === 'production';
export const isDev = NODE_ENV === 'development';
export const isTest = NODE_ENV === 'test';
export const isErrorReportingEnabled = Boolean(SENTRY_DSN || ERROR_ENDPOINT);

// Ensure this module is imported at app startup
if (isDev) {
  console.log('✅ Environment variables validated successfully');
  console.log('📊 Configuration:', {
    NODE_ENV,
    SITE_URL,
    GA_ENABLED: !!GA_TRACKING_ID,
    ERROR_REPORTING: isErrorReportingEnabled,
  });
}
