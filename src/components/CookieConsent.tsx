import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // First mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Then check consent after mounted
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      enableAnalytics();
    }
  }, [mounted]);

  const enableAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleAccept = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'accepted');
    enableAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'declined');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
    setShowBanner(false);
  };

  // Don't render until mounted
  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept", you consent to our use of cookies.{' '}
              <a 
                href="/privacy" 
                className="text-sky-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/privacy');
                }}
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
