import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Script from "next/script";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import "../styles/globals.css";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, { page_path: url });
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const { events, locale } = useRouter();
  const [consentGiven, setConsentGiven] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check consent on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      setConsentGiven(consent === 'accepted');
    }
  }, []);

  // Listen for consent changes
  useEffect(() => {
    const handleStorage = () => {
      const consent = localStorage.getItem('cookie-consent');
      setConsentGiven(consent === 'accepted');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (consentGiven) {
        pageview(url);
      }
    };
    
    events.on("routeChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events, consentGiven]);

  const messages = pageProps.messages || {};
  const currentLocale = locale || pageProps.locale || 'en';
  const validMessages = (typeof messages === 'object' && messages !== null && !Array.isArray(messages)) ? messages : {};

  return (
    <ErrorBoundary>
      <NextIntlClientProvider 
        messages={validMessages}
        locale={currentLocale}
        timeZone="UTC"
        now={new Date()}
        defaultTranslationValues={{
          br: (chunks) => <br />,
        }}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Translation error:', error);
          }
        }}
        getMessageFallback={({ namespace, key }) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Missing translation: ${namespace ? namespace + '.' : ''}${key}`);
          }
          return `${namespace ? namespace + '.' : ''}${key}`;
        }}
      >
        {/* Only load GA if consent given */}
        {mounted && GA_TRACKING_ID && consentGiven && (
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
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
        
        <CookieConsent />
        <Component {...pageProps} />
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
