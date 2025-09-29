// API and Network Constants
export const API_TIMEOUT_MS = 5000; // 5 seconds
export const REQUEST_TIMEOUT_MS = 5 * 1000;

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 5;

// UI/UX Constants
export const MESSAGE_DISPLAY_DURATION_MS = 8000; // 8 seconds
export const SCROLL_DELAY_MS = 100;
export const COUNTDOWN_INITIAL_SECONDS = 10;

// Debounce/Throttle
export const SEARCH_DEBOUNCE_MS = 300;
export const SCROLL_THROTTLE_MS = 100;

// Cookie/Storage
export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_CONSENT_ACCEPTED = 'accepted';
export const COOKIE_CONSENT_DECLINED = 'declined';

// Form Validation
export const MIN_NAME_LENGTH = 2;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Analytics
export const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100] as const;

// URLs
export const EXTERNAL_LINKS = {
  VENTIO: 'https://ventio.com',
  SUPPORT_EMAIL: 'mailto:support@tactec.club',
  INFO_EMAIL: 'mailto:info@tactec.club',
  PRIVACY_EMAIL: 'mailto:privacy@tactec.club',
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Response Messages
export const MESSAGES = {
  FORM_SUCCESS: 'Your message has been sent successfully. We will contact you within 24 hours.',
  FORM_ERROR: 'Something went wrong. Please try again or email us directly.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  VALIDATION_ERROR: 'Please check your form data.',
} as const;
