import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { SITE_URL } from "@/config/env";

interface NotFoundPageProps {
  locale?: string;
}

export default function Custom404({ locale = 'en' }: NotFoundPageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ensure component is mounted on client-side before running effects
  useEffect(() => {
    setIsMounted(true);
    
    // Track 404 page view
    if (typeof window !== 'undefined') {
      trackEvent('404_page_view', {
        page_path: router.asPath,
        referrer: document.referrer || 'direct',
      });
    }
  }, [router.asPath]);

  // Only run countdown timer after component is mounted (client-side only)
  useEffect(() => {
    if (!isMounted || isRedirecting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleAutoRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMounted, isRedirecting]);

  // Handle automatic redirect to home
  const handleAutoRedirect = () => {
    if (isRedirecting) return;
    
    setIsRedirecting(true);
    trackEvent('404_auto_redirect', { from_page: router.asPath });
    router.push('/');
  };

  // Handle manual navigation back
  const handleGoBack = () => {
    if (typeof window === 'undefined') return;

    trackEvent('404_go_back_click');
    
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home if no history
      router.push('/');
    }
  };

  // Handle manual home navigation
  const handleGoHome = () => {
    trackEvent('404_go_home_click');
    setIsRedirecting(true);
    router.push('/');
  };

  // Handle link clicks for analytics
  const handleLinkClick = (linkName: string, href: string) => {
    trackEvent('404_link_click', {
      link_name: linkName,
      destination: href,
    });
  };

  // Handle stop countdown
  const handleStopCountdown = () => {
    trackEvent('404_stop_countdown');
    setCountdown(-1); // Stop countdown
  };

  // Get page direction for RTL support
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <>
      <Head>
        <title>404 - Page Not Found | TACTEC</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore TACTEC's features or return to the homepage." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${SITE_URL}/404`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="404 - Page Not Found | TACTEC" />
        <meta property="og:description" content="The page you're looking for doesn't exist. Explore TACTEC's features or return to the homepage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/404`} />
        <meta property="og:image" content={`${SITE_URL}/images/404-error.webp`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="404 - Page Not Found | TACTEC" />
        <meta name="twitter:description" content="The page you're looking for doesn't exist. Return to TACTEC homepage." />
        
        {/* Prevent indexing */}
        <meta name="googlebot" content="noindex,nofollow" />
        <meta name="bingbot" content="noindex,nofollow" />
      </Head>

      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-6"
        dir={direction}
      >
        <div className="max-w-2xl w-full text-center">
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
              <h1 className="text-8xl md:text-9xl font-bold text-sky-500 mb-4 animate-pulse">
                404
              </h1>
              <div className="text-5xl md:text-6xl mb-4" role="img" aria-label="Football emoji">
                ⚽
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! This Page Has Been Sent Off
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, even the best players sometimes miss the target!
              </p>
            </div>

            {/* Countdown Section - Only render on client-side after mount */}
            {isMounted && countdown > 0 && !isRedirecting && (
              <div className="mb-8 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Redirecting to homepage in{" "}
                  <span className="font-bold text-sky-600 dark:text-sky-400 text-lg">
                    {countdown}
                  </span>{" "}
                  seconds...
                </p>
                <button
                  onClick={handleStopCountdown}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                  aria-label="Stop automatic redirect countdown"
                >
                  Stop countdown
                </button>
              </div>
            )}

            {/* Loading State */}
            {isRedirecting && (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    Redirecting you home...
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleGoHome}
                disabled={isRedirecting}
                className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Go to TACTEC homepage"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {isRedirecting ? 'Going Home...' : 'Go Home'}
              </button>

              <button
                onClick={handleGoBack}
                disabled={isRedirecting}
                className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Go back to previous page"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </button>
            </div>

            {/* Quick Navigation Links */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Explore TACTEC
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link
                  href="/#features"
                  onClick={() => handleLinkClick('Features', '/#features')}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Features</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Core functionality</div>
                </Link>

                <Link
                  href="/#tech"
                  onClick={() => handleLinkClick('Technology', '/#tech')}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Technology</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Our tech stack</div>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => handleLinkClick('Contact', '/contact')}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📞</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Contact</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get in touch</div>
                </Link>

                <a
                  href="https://ventio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick('Ventio', 'https://ventio.com')}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏢</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">About Ventio</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Our company</div>
                </a>
              </div>

              {/* Help Section */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  If you believe this is an error, please contact our support team.
                </p>
                <a
                  href="mailto:support@tactec.club?subject=404%20Error%20Report&body=I%20encountered%20a%20404%20error%20on:%20"
                  onClick={() => handleLinkClick('Support Email', 'mailto:support@tactec.club')}
                  className="inline-flex items-center text-sky-600 dark:text-sky-400 hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded"
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@tactec.club
                </a>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Ventio. All rights reserved. | 
              <Link 
                href="/privacy" 
                className="hover:underline ml-1"
                onClick={() => handleLinkClick('Privacy Policy', '/privacy')}
              >
                Privacy Policy
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

// This is important for SSR - ensures proper error handling
export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      locale: locale || 'en',
    },
  };
}
