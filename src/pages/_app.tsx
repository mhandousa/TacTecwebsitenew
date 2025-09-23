import type { AppProps } from "next/app";
import { IntlProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { GA_TRACKING_ID, pageview } from "@/utils/analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { locale = "en", events } = useRouter();

  const messages = useMemo(() => {
    try {
      return require(`../locales/${locale}/common.json`);
    } catch (error) {
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`Failed to load locale "${locale}", falling back to "en"`, error);
      }
      return require("../locales/en/common.json");
    }
  }, [locale]);

  useEffect(() => {
    const handleRouteChange = (url: string) => pageview(url);
    events.on("routeChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <ErrorBoundary>
      <IntlProvider messages={messages} locale={locale}>
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
        <Component {...pageProps} />
      </IntlProvider>
    </ErrorBoundary>
  );
}
