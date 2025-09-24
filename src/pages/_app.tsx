import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";
import "../styles/globals.css";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, { page_path: url });
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const { events, locale } = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => pageview(url);
    events.on("routeChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  // Ensure messages is always defined and is an object
  // This prevents the NextIntlClientProvider from failing during prerendering
  const messages = pageProps.messages || {};
  const currentLocale = locale || pageProps.locale || 'en';

  // ✅ ADDED: Validate messages is proper object structure
  const validMessages = (typeof messages === 'object' && messages !== null && !Array.isArray(messages)) ? messages : {};

  return (
    <NextIntlClientProvider 
      messages={validMessages}
      locale={currentLocale}
      timeZone="UTC"
      now={new Date()}
      // Add default values to handle missing translations gracefully
      defaultTranslationValues={{
        br: (chunks) => <br />,
      }}
      // Handle missing translations without throwing errors
      onError={(error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Translation error:', error);
        }
      }}
      // ✅ ADDED: Critical fallback for missing translations
      getMessageFallback={({ namespace, key }) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation: ${namespace ? namespace + '.' : ''}${key}`);
        }
        return `${namespace ? namespace + '.' : ''}${key}`;
      }}
    >
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
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}
