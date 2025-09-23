import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

type Props = { locale: string };

export default function MyDocument({ locale }: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  
  return (
    <Html lang={locale || "en"} dir={dir}>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="description" content="TACTEC is a professional operating system for football clubs. Unifying tactical, medical, and operational workflows into one platform." />
        <meta name="keywords" content="football, soccer, club management, sports, tactical analysis, medical tracking, performance analytics, team management" />
        <meta name="author" content="Ventio" />
        <meta name="robots" content="index, follow" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48x48.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
        
        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/android-chrome-512x512.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TACTEC" />
        <link rel="apple-touch-startup-image" href="/icons/apple-launch-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-launch-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-launch-1242x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Microsoft Specific */}
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-navbutton-color" content="#0ea5e9" />
        
        {/* Performance and Preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://sentry.io" />
        
        {/* Default Open Graph Tags */}
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta property="og:description" content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs." />
        <meta property="og:url" content="https://tactec.club/" />
        <meta property="og:image" content="https://tactec.club/images/1_TacTec-Revolutionising-Football-Club-Management.webp" />
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
        <meta name="twitter:image" content="https://tactec.club/images/1_TacTec-Revolutionising-Football-Club-Management.webp" />
        <meta name="twitter:image:alt" content="TACTEC - Professional football club management platform" />
        
        {/* Additional SEO Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ventio",
              "url": "https://ventio.com",
              "logo": "https://tactec.club/icons/icon-512x512.png",
              "description": "TACTEC by Ventio - Professional football club management platform",
              "sameAs": [
                "https://twitter.com/ventio",
                "https://linkedin.com/company/ventio"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@tactec.club",
                "contactType": "customer service"
              }
            })
          }}
        />
        
        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TACTEC",
              "url": "https://tactec.club",
              "description": "Professional football club management platform",
              "publisher": {
                "@type": "Organization",
                "name": "Ventio"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tactec.club/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      <body>
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
        
        {/* Prevent Flash of Unstyled Content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC by hiding body until styles load
              document.documentElement.classList.add('loading');
              window.addEventListener('load', function() {
                document.documentElement.classList.remove('loading');
              });
            `
          }}
        />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  // @ts-ignore next adds locale on ctx
  const locale = (ctx as any).locale || "en";
  return { ...initialProps, locale } as any;
};
