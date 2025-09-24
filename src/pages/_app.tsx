import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { GA_TRACKING_ID, pageview } from "@/utils/analytics";
import { initErrorReporting, setErrorContext } from "@/utils/errorReporting";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { events, locale, pathname } = router;

  // Initialize error reporting on mount
  useEffect(() => {
    initErrorReporting();

    // Set initial context
    setErrorContext({
      locale: locale || 'en',
      pathname,
      userAgent: navigator.userAgent,
    });
  }, []);

  // Update error context when route or locale changes
  useEffect(() => {
    setErrorContext({
      locale: locale || 'en',
      pathname,
    });
  }, [locale, pathname]);

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url: string) => pageview(url);
    events.on("routeChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <ErrorBoundary>
      <NextIntlClientProvider 
        messages={pageProps.messages}
        timeZone="UTC"
        now={new Date()}
      >
        {/* Sentry Error Tracking */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <Script
            src="https://js-de.sentry-cdn.com/2cf687ecfc4a384b29427b68fb1b1248.min.js"
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== 'undefined' && (window as any).Sentry) {
                const Sentry = (window as any).Sentry;
                
                // Initialize Sentry
                Sentry.init({
                  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                  environment: process.env.NODE_ENV,
                  
                  // Performance Monitoring
                  integrations: [
                    Sentry.browserTracingIntegration(),
                    Sentry.replayIntegration({
                      maskAllText: true,
                      blockAllMedia: true,
                    }),
                  ],
                  
                  // Performance Monitoring
                  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
                  
                  // Session Replay
                  replaysSessionSampleRate: 0.1,
                  replaysOnErrorSampleRate: 1.0,
                  
                  // Release tracking
                  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || '1.0.0',
                  
                  // Custom error filtering
                  beforeSend(event: any, hint: any) {
                    // Filter out errors in development
                    if (process.env.NODE_ENV === 'development') {
                      console.log('[Sentry] Event captured in development:', event);
                      return null; // Don't send in development
                    }
                    
                    // Filter out common non-actionable errors
                    const error = hint.originalException;
                    if (error && typeof error === 'object' && 'message' in error) {
                      const message = (error as Error).message;
                      
                      // Skip common browser extension errors
                      if (message.includes('Extension context invalidated') ||
                          message.includes('chrome-extension://') ||
                          message.includes('moz-extension://')) {
                        return null;
                      }
                      
                      // Skip network errors that aren't actionable
                      if (message.includes('NetworkError') && 
                          message.includes('fetch')) {
                        return null;
                      }
                    }
                    
                    return event;
                  },
                  
                  // Additional configuration
                  beforeBreadcrumb(breadcrumb) {
                    // Filter out noisy breadcrumbs
                    if (breadcrumb.category === 'console' && 
                        breadcrumb.level === 'log') {
                      return null;
                    }
                    return breadcrumb;
                  },
                  
                  // Set user context
                  initialScope: {
                    tags: {
                      component: 'app',
                    },
                    contexts: {
                      app: {
                        name: 'TACTEC Website',
                        version: '1.0.0',
                      },
                    },
                  },
                });

                // Set additional context
                Sentry.setContext('locale', {
                  current: locale || 'en',
                  available: router.locales || ['en'],
                });

                // Set user context (if you have user data)
                Sentry.setUser({
                  id: 'anonymous',
                  ip_address: '{{auto}}', // Let Sentry determine IP
                });

                console.log('[Sentry] Initialized successfully');
              }
            }}
            onError={(error) => {
              console.error('[Sentry] Failed to load:', error);
            }}
          />
        )}

        {/* Google Analytics with Consent Mode */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                // Default consent mode - denied until user accepts
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'wait_for_update': 500
                });
                
                gtag('config', '${GA_TRACKING_ID}', { 
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `}
            </Script>
          </>
        )}

        <Component {...pageProps} />
        <CookieConsent />
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
