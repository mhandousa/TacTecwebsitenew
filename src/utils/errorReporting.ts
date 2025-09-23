import { trackEvent } from './analytics';

/**
 * Error Severity Levels
 */
export enum ErrorSeverity {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

/**
 * Error Context - Additional information about the error
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  locale?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Error Report Structure
 */
export interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
}

/**
 * Check if Sentry is available
 */
const isSentryAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).Sentry !== 'undefined';
};

/**
 * Initialize error reporting
 * This should be called once when the app starts
 */
export const initErrorReporting = (): void => {
  if (typeof window === 'undefined') return;

  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  // Only initialize if DSN is provided
  if (!SENTRY_DSN) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Error Reporting] No Sentry DSN provided. Error reporting disabled.');
    }
    return;
  }

  // Sentry initialization would go here
  // For now, we'll use a custom implementation
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Error Reporting] Initialized with DSN:', SENTRY_DSN);
  }

  // Set up global error handlers
  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), {
      severity: ErrorSeverity.Error,
      context: {
        component: 'GlobalErrorHandler',
        url: window.location.href,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason)),
      {
        severity: ErrorSeverity.Error,
        context: {
          component: 'UnhandledPromiseRejection',
          url: window.location.href,
        },
      }
    );
  });
};

/**
 * Capture and report an error
 */
export const captureError = (
  error: Error,
  options: {
    severity?: ErrorSeverity;
    context?: ErrorContext;
  } = {}
): void => {
  const severity = options.severity || ErrorSeverity.Error;
  const context: ErrorContext = {
    ...options.context,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
  };

  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    severity,
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Report]', errorReport);
  }

  // Send to Sentry if available
  if (isSentryAvailable()) {
    const Sentry = (window as any).Sentry;
    Sentry.captureException(error, {
      level: severity,
      contexts: {
        custom: context,
      },
    });
  }

  // Track in Google Analytics
  trackEvent('error_occurred', {
    error_message: error.message,
    error_severity: severity,
    error_component: context.component,
    error_action: context.action,
  });

  // Send to custom error reporting endpoint (if configured)
  sendToErrorEndpoint(errorReport);
};

/**
 * Capture a message (non-error)
 */
export const captureMessage = (
  message: string,
  severity: ErrorSeverity = ErrorSeverity.Info,
  context?: ErrorContext
): void => {
  const messageContext: ErrorContext = {
    ...context,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[${severity.toUpperCase()}]`, message, messageContext);
  }

  if (isSentryAvailable()) {
    const Sentry = (window as any).Sentry;
    Sentry.captureMessage(message, {
      level: severity,
      contexts: {
        custom: messageContext,
      },
    });
  }

  // Track in Analytics for warnings and errors
  if (severity === ErrorSeverity.Error || severity === ErrorSeverity.Warning) {
    trackEvent('message_logged', {
      message,
      severity,
      component: context?.component,
    });
  }
};

/**
 * Set user context for error reporting
 */
export const setUserContext = (user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): void => {
  if (isSentryAvailable()) {
    const Sentry = (window as any).Sentry;
    Sentry.setUser(user);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Error Reporting] User context set:', user);
  }
};

/**
 * Set custom context tags
 */
export const setErrorContext = (context: Record<string, any>): void => {
  if (isSentryAvailable()) {
    const Sentry = (window as any).Sentry;
    Sentry.setContext('custom', context);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Error Reporting] Context set:', context);
  }
};

/**
 * Send error to custom endpoint
 */
const sendToErrorEndpoint = async (errorReport: ErrorReport): Promise<void> => {
  const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;
  
  if (!ERROR_ENDPOINT) return;

  // Only send errors and fatal issues to the endpoint
  if (errorReport.severity !== ErrorSeverity.Error && 
      errorReport.severity !== ErrorSeverity.Fatal) {
    return;
  }

  try {
    await fetch(ERROR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorReport),
      // Don't wait for response, fire and forget
      keepalive: true,
    }).catch(() => {
      // Silently fail - we don't want error reporting to cause more errors
    });
  } catch {
    // Silently fail
  }
};

/**
 * Create an error boundary handler
 */
export const createErrorBoundaryHandler = (componentName: string) => {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    captureError(error, {
      severity: ErrorSeverity.Error,
      context: {
        component: componentName,
        componentStack: errorInfo.componentStack,
      },
    });
  };
};

/**
 * Wrap async functions with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          severity: ErrorSeverity.Error,
          context: {
            ...context,
            action: fn.name || 'async_function',
          },
        }
      );
      throw error;
    }
  }) as T;
};

/**
 * Test error reporting (development only)
 */
export const testErrorReporting = (): void => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Error reporting tests are only available in development');
    return;
  }

  console.log('Testing error reporting...');

  // Test error capture
  captureError(new Error('Test error from error reporting'), {
    severity: ErrorSeverity.Error,
    context: {
      component: 'ErrorReportingTest',
      action: 'test',
    },
  });

  // Test message capture
  captureMessage('Test warning message', ErrorSeverity.Warning, {
    component: 'ErrorReportingTest',
  });

  console.log('Error reporting test complete. Check console and monitoring tools.');
};
