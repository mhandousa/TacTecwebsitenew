import { trackEvent } from './analytics';
import { API_TIMEOUT_MS } from './constants';
import { logger } from './logger';

// ... rest of the code

const sendToErrorEndpoint = async (errorReport: ErrorReport): Promise<void> => {
  const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;
  
  if (!ERROR_ENDPOINT) return;

  if (errorReport.severity !== ErrorSeverity.Error && 
      errorReport.severity !== ErrorSeverity.Fatal) {
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
