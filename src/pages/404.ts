import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>404 - Page Not Found | TACTEC</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-6">
        <div className="max-w-lg w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-sky-500 mb-4">404</h1>
            <div className="text-6xl mb-4">⚽</div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Looks like this page has been sent off! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to homepage in <span className="font-bold text-sky-500">{countdown}</span> seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Go Home Now
            </Link>
            
            <button
              onClick={() => router.back()}
              className="inline-block border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
            >
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/#features" className="text-sky-600 hover:underline">
                Features
              </Link>
              <Link href="/#tech" className="text-sky-600 hover:underline">
                Technology
              </Link>
              <Link href="/contact" className="text-sky-600 hover:underline">
                Contact Us
              </Link>
              <a 
                href="https://ventio.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sky-600 hover:underline"
              >
                About Ventio
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}