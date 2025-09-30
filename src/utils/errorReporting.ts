import { trackEvent } from './analytics';
import { API_TIMEOUT_MS } from './constants';
import { logger } from './logger';

export enum ErrorSeverity {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Fatal = 'fatal',
}

export interface ErrorContext {
  component?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  [key: string]: unknown;
}

export interface ErrorReport {
  name?: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: string;
  context?: ErrorContext;
}

export interface CaptureErrorOptions {
  severity?: ErrorSeverity;
  context?: ErrorContext;
}

const severityToValue: Record<ErrorSeverity, number> = {
  [ErrorSeverity.Info]: 1,
  [ErrorSeverity.Warning]: 2,
  [ErrorSeverity.Error]: 3,
  [ErrorSeverity.Fatal]: 4,
};

export const captureError = (
  error: unknown,
  { severity = ErrorSeverity.Error, context }: CaptureErrorOptions = {}
): void => {
  const normalizedError =
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' ? error : 'Unknown error');

  const errorReport: ErrorReport = {
    name: normalizedError.name,
    message: normalizedError.message,
    stack: normalizedError.stack,
    severity,
    timestamp: new Date().toISOString(),
    context,
  };

  const componentLabel = context?.component || normalizedError.name || 'Unknown';

  logger.error('[Error Reporting] Captured error:', errorReport);

  trackEvent('error', {
    category: 'error_reporting',
    label: componentLabel,
    value: severityToValue[severity],
    error: normalizedError.message,
    severity,
  });

  void sendToErrorEndpoint(errorReport);
};

const sendToErrorEndpoint = async (errorReport: ErrorReport): Promise<void> => {
  const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;

  if (!ERROR_ENDPOINT) return;

  if (
    errorReport.severity !== ErrorSeverity.Error &&
    errorReport.severity !== ErrorSeverity.Fatal
  ) {
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    await fetch(ERROR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorReport),
      signal: controller.signal,
      keepalive: true,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    logger.warn('[Error Reporting] Failed to send to custom endpoint:', error);
  }
};

export type { ErrorContext as ErrorReportingContext, ErrorReport };
