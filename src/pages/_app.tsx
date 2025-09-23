import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { GA_TRACKING_ID, pageview } from "@/utils/analytics";
import { initErrorReporting, setErrorContext } from "@/utils/errorReporting";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
        {/* Google Analytics */}
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
                gtag('config', '${GA_TRACKING_ID}', { 
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `}
            </Script>
          </>
        )}

        {/* Sentry Error Tracking (Optional) */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <Script
            src="https://browser.sentry-cdn.com/7.119.0/bundle.tracing.min.js"
            integrity="sha384-..."
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== 'undefined' && (window as any).Sentry) {
                (window as any).Sentry.init({
                  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                  environment: process.env.NODE_ENV,
                  tracesSampleRate: 0.1,
                  beforeSend(event: any) {
                    // Filter out errors in development
                    if (process.env.NODE_ENV === 'development') {
                      return null;
                    }
                    return event;
                  },
                });
              }
            }}
          />
        )}

        <Component {...pageProps} />
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
