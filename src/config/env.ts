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
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
  const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT || '';

  // Validation for production environment
  if (NODE_ENV === 'production') {
    if (!GA_TRACKING_ID) {
      console.warn('⚠️  NEXT_PUBLIC_GA_ID is not set. Analytics will not work.');
    }
    
    if (!SITE_URL) {
      console.error('❌ NEXT_PUBLIC_SITE_URL is required in production!');
      throw new Error('Missing required environment variable: NEXT_PUBLIC_SITE_URL');
    }

    if (!SENTRY_DSN && !ERROR_ENDPOINT) {
      console.warn('⚠️  No error reporting configured. Set NEXT_PUBLIC_SENTRY_DSN or NEXT_PUBLIC_ERROR_ENDPOINT.');
    }

    // Validate GA ID format
    if (GA_TRACKING_ID && !GA_TRACKING_ID.match(/^G-[A-Z0-9]+$/)) {
      console.warn(`⚠️  GA_TRACKING_ID has invalid format: ${GA_TRACKING_ID}`);
    }

    // Validate SITE_URL format
    if (SITE_URL && !SITE_URL.match(/^https?:\/\/.+/)) {
      console.error(`❌ SITE_URL has invalid format: ${SITE_URL}`);
      throw new Error('SITE_URL must be a valid URL starting with http:// or https://');
    }

    // Validate Sentry DSN format
    if (SENTRY_DSN && !SENTRY_DSN.match(/^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+$/)) {
      console.warn(`⚠️  SENTRY_DSN has invalid format: ${SENTRY_DSN}`);
    }
  }

  return {
    GA_TRACKING_ID,
    SITE_URL: SITE_URL || 'http://localhost:3000',
    NODE_ENV: NODE_ENV as 'development' | 'production' | 'test',
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

// Helper to check if we're in production
export const isProd = NODE_ENV === 'production';
export const isDev = NODE_ENV === 'development';

// Helper to check if error reporting is enabled
export const isErrorReportingEnabled = Boolean(SENTRY_DSN || ERROR_ENDPOINT);
