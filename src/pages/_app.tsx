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

  useEffect(() => {
    initErrorReporting();
    setErrorContext({
      locale: locale || 'en',
      pathname,
      userAgent: navigator.userAgent,
    });
  }, []);

  useEffect(() => {
    setErrorContext({
      locale: locale || 'en',
      pathname,
    });
  }, [locale, pathname]);

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
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <Script
            src="https://js-de.sentry-cdn.com/2cf687ecfc4a384b29427b68fb1b1248.min.js"
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== 'undefined' && (window as any).Sentry) {
                const Sentry = (window as any).Sentry;
                
                Sentry.init({
                  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                  environment: process.env.NODE_ENV,
                  integrations: [
                    Sentry.browserTracingIntegration(),
                    Sentry.replayIntegration({
                      maskAllText: true,
                      blockAllMedia: true,
                    }),
                  ],
                  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
                  replaysSessionSampleRate: 0.1,
                  replaysOnErrorSampleRate: 1.0,
                  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || '1.0.0',
                  beforeSend(event: Event, hint: EventHint) {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('[Sentry] Event captured in development:', event);
                      return null;
                    }
                    
                    const error = hint.originalException;
                    if (error && typeof error === 'object' && 'message' in error) {
                      const message = (error as Error).message;
                      
                      if (message.includes('Extension context invalidated') ||
                          message.includes('chrome-extension://') ||
                          message.includes('moz-extension://')) {
                        return null;
                      }
                      
                      if (message.includes('NetworkError') && 
                          message.includes('fetch')) {
                        return null;
                      }
                    }
                    
                    return event;
                  },
                  beforeBreadcrumb(breadcrumb: any) {
                    if (breadcrumb.category === 'console' && 
                        breadcrumb.level === 'log') {
                      return null;
                    }
                    return breadcrumb;
                  },
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

                Sentry.setContext('locale', {
                  current: locale || 'en',
                  available: router.locales || ['en'],
                });

                Sentry.setUser({
                  id: 'anonymous',
                  ip_address: '{{auto}}',
                });

                console.log('[Sentry] Initialized successfully');
              }
            }}
            onError={(error) => {
              console.error('[Sentry] Failed to load:', error);
            }}
          />
        )}

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
