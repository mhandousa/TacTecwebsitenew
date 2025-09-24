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
  const { events } = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => pageview(url);
    events.on("routeChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <NextIntlClientProvider 
      messages={pageProps.messages}
      timeZone="UTC"
      now={new Date()}
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
