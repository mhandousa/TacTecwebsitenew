import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ensure component is mounted on client-side before running effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle redirect to home
  const redirectToHome = useCallback(() => {
    if (isRedirecting) return;
    
    setIsRedirecting(true);
    router.push("/").catch(() => {
      // Fallback if router fails
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });
  }, [router, isRedirecting]);

  // Countdown timer - only runs on client-side after mount
  useEffect(() => {
    if (!isMounted || isRedirecting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          redirectToHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMounted, isRedirecting, redirectToHome]);

  // Safe navigation handlers
  const handleGoHome = useCallback(() => {
    if (isRedirecting) return;
    redirectToHome();
  }, [redirectToHome, isRedirecting]);

  const handleGoBack = useCallback(() => {
    if (isRedirecting) return;
    
    if (typeof window !== 'undefined') {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        setIsRedirecting(true);
        router.back();
      } else {
        // Fallback to home if no history
        redirectToHome();
      }
    }
  }, [router, redirectToHome, isRedirecting]);

  // Keyboard navigation
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          redirectToHome();
          break;
        case 'Backspace':
          if (event.ctrlKey || event.metaKey) {
            handleGoBack();
          }
          break;
        case 'Enter':
          if (event.target === document.body) {
            redirectToHome();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, redirectToHome, handleGoBack]);

  return (
    <>
      <Head>
        <title>404 - Page Not Found | TACTEC</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to TACTEC homepage." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://tactec.club/404" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="404 - Page Not Found | TACTEC" />
        <meta property="og:description" content="The page you're looking for doesn't exist." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tactec.club/404" />
        
        {/* Prevent indexing */}
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-6">
        <div className="max-w-lg w-full text-center">
          {/* Skip to content for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sky-500 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>

          <main id="main-content">
            {/* 404 Illustration */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-sky-500 mb-4" aria-label="Error 404">
                404
              </h1>
              <div className="text-6xl mb-4" role="img" aria-label="Football emoji">
                ⚽
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Looks like this page has been sent off! The page you're looking for
              doesn't exist or has been moved.
            </p>

            {/* Countdown - Only render on client-side after mount */}
            {isMounted && !isRedirecting && (
              <div className="mb-8" role="status" aria-live="polite">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting to homepage in{" "}
                  <span className="font-bold text-sky-500" aria-label={`${countdown} seconds`}>
                    {countdown}
                  </span>{" "}
                  seconds...
                </p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-sky-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            {/* Loading state */}
            {isRedirecting && (
              <div className="mb-8" role="status" aria-live="assertive">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redirecting...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoHome}
                disabled={isRedirecting}
                className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Go to TACTEC homepage"
              >
                {isRedirecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Going Home...
                  </>
                ) : (
                  'Go Home Now'
                )}
              </button>

              <button
                onClick={handleGoBack}
                disabled={isRedirecting}
                className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Go back to previous page"
              >
                ← Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You might be looking for:
              </p>
              <nav aria-label="Helpful links">
                <div className="flex flex-wrap gap-4 justify-center text-sm">
                  <Link 
                    href="/#features" 
                    className="text-sky-600 hover:text-sky-800 dark:hover:text-sky-400 hover:underline transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded px-2 py-1"
                    onClick={(e) => {
                      if (isRedirecting) e.preventDefault();
                    }}
                  >
                    Features
                  </Link>
                  <Link 
                    href="/#tech" 
                    className="text-sky-600 hover:text-sky-800 dark:hover:text-sky-400 hover:underline transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded px-2 py-1"
                    onClick={(e) => {
                      if (isRedirecting) e.preventDefault();
                    }}
                  >
                    Technology
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-sky-600 hover:text-sky-800 dark:hover:text-sky-400 hover:underline transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded px-2 py-1"
                    onClick={(e) => {
                      if (isRedirecting) e.preventDefault();
                    }}
                  >
                    Contact Us
                  </Link>
                  <a
                    href="https://ventio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 dark:hover:text-sky-400 hover:underline transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded px-2 py-1"
                    onClick={(e) => {
                      if (isRedirecting) e.preventDefault();
                    }}
                  >
                    About Ventio ↗
                  </a>
                </div>
              </nav>
            </div>

            {/* Error Code for Debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                <h3 className="text-sm font-semibold mb-2">Debug Info</h3>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  <p>Path: {isMounted ? router.asPath : 'Loading...'}</p>
                  <p>Locale: {isMounted ? router.locale || 'en' : 'Loading...'}</p>
                  <p>Is Ready: {isMounted ? router.isReady.toString() : 'false'}</p>
                  <p>User Agent: {isMounted && typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'Server'}</p>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts Help */}
            <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              <p>Keyboard shortcuts: <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Esc</kbd> → Home | <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl+Backspace</kbd> → Back</p>
            </div>
          </main>
        </div>
      </div>

      {/* Schema.org structured data for 404 page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "The requested page could not be found.",
            "url": "https://tactec.club/404",
            "mainEntity": {
              "@type": "Thing",
              "name": "404 Error",
              "description": "Page not found error"
            }
          })
        }}
      />
    </>
  );
}
