import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";
import "@/styles/globals.css";
import { pageview } from "@/utils/analytics";

export default function App({ Component, pageProps }: AppProps & { pageProps: { messages?: any } }) {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: string) => pageview(url);
    router.events.on("routeChangeComplete", onRouteChange);
    return () => router.events.off("routeChangeComplete", onRouteChange);
  }, [router.events]);

  return (
    <>
      {/* Consent Mode default (privacy-friendly) */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'granted'
          });`}
      </Script>

      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      <NextIntlProvider messages={pageProps.messages}>
        <Component {...pageProps} />
      </NextIntlProvider>
    </>
  );
}