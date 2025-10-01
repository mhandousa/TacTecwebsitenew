import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { SITE_URL } from "@/config/env";

type Props = { locale: string };

export default function MyDocument({ locale }: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const normalizedSiteUrl = (SITE_URL || "").trim().replace(/\/+$/, "");
  const buildAssetUrl = (path: string) => {
    if (!path) {
      return normalizedSiteUrl;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return normalizedSiteUrl ? `${normalizedSiteUrl}${normalizedPath}` : normalizedPath;
  };
  const baseUrl = buildAssetUrl("");

  const ogUrl = buildAssetUrl("/");
  const ogImageUrl = buildAssetUrl("/images/1_TacTec-Revolutionising-Football-Club-Management.webp");
  const twitterImageUrl = ogImageUrl;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ventio",
    url: "https://ventio.com",
    logo: buildAssetUrl("/icons/icon-512x512.png"),
    description: "TACTEC by Ventio - Professional football club management platform",
    sameAs: ["https://twitter.com/ventio", "https://linkedin.com/company/ventio"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@tactec.club",
      contactType: "customer service",
    },
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TACTEC",
    url: baseUrl || undefined,
    description: "Professional football club management platform",
    publisher: {
      "@type": "Organization",
      name: "Ventio",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: buildAssetUrl("/search?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Html lang={locale || "en"} dir={dir}>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="description" content="TACTEC is a professional operating system for football clubs. Unifying tactical, medical, and operational workflows into one platform." />
        <meta name="keywords" content="football, soccer, club management, sports, tactical analysis, medical tracking, performance analytics, team management" />
        <meta name="author" content="Ventio" />
        <meta name="robots" content="index, follow" />
        
        {/* Font Optimization - Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Optimized Font Loading - Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon0.svg" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-TileImage" content="/icons/apple-icon.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TACTEC" />
        
        {/* Performance and Preloading */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Default Open Graph Tags */}
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta property="og:description" content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs." />
        <meta property="og:url" content={ogUrl} />
        <meta
          property="og:image"
          content={ogImageUrl}
        />
        <meta property="og:image:alt" content="TACTEC - Professional football club management platform" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tactec" />
        <meta name="twitter:creator" content="@ventio" />
        <meta name="twitter:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta name="twitter:description" content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs." />
        <meta name="twitter:image" content={twitterImageUrl} />
        <meta name="twitter:image:alt" content="TACTEC - Professional football club management platform" />
        
        {/* Additional SEO Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd)
          }}
        />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd)
          }}
        />
      </Head>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* Skip to Content Link for Accessibility */}
        <a className="skip-to-content" href="#content">Skip to content</a>
        
        {/* NoScript Fallback */}
        <noscript>
          <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            textAlign: 'center',
            fontSize: '14px',
            color: '#374151'
          }}>
            <p><strong>JavaScript is required</strong></p>
            <p>This website requires JavaScript to function properly. Please enable JavaScript in your browser settings.</p>
          </div>
        </noscript>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  const locale = (ctx as any).locale || "en";
  return { ...initialProps, locale } as any;
};
