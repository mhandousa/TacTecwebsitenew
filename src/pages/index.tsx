import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { SITE_URL } from "@/config/env";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fs from "fs";
import path from "path";
import { GetStaticProps } from "next";

export default function ContactPage() {
  const router = useRouter();
  const { locale } = router;

  return (
    <>
      <Head>
        <title>Contact - TACTEC</title>
        <meta name="description" content="Get in touch with TACTEC team for demos and inquiries" />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sky-600">
            TACTEC
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-sky-600 transition">
              Back to Home
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              Interested in TACTEC? We'd love to show you how it can transform your club operations.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        📧
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <a href="mailto:info@tactec.club" className="text-sky-600 hover:underline">
                          info@tactec.club
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        🌐
                      </div>
                      <div>
                        <p className="font-semibold">Website</p>
                        <a href="https://ventio.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                          ventio.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        ⏰
                      </div>
                      <div>
                        <p className="font-semibold">Business Hours</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Monday - Friday<br />
                          9:00 AM - 6:00 PM (UTC)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50 dark:bg-gray-800 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Quick Response</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>

              {/* CTA Cards */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Schedule a Demo</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    See TACTEC in action with a personalized demonstration for your club.
                  </p>
                  <a 
                    href="mailto:info@tactec.club?subject=Demo Request" 
                    className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Request Demo
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Sales Inquiry</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get pricing information and discuss how TACTEC fits your needs.
                  </p>
                  <a 
                    href="mailto:info@tactec.club?subject=Sales Inquiry" 
                    className="inline-block border border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Contact Sales
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Already a TACTEC user? Get technical support and assistance.
                  </p>
                  <a 
                    href="mailto:support@tactec.club?subject=Support Request" 
                    className="inline-block border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Get Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© Ventio. All rights reserved.</p>
          <p className="mt-2 text-sky-400 text-sm">Made with care for football.</p>
        </div>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeToUse = locale || "en";
  
  // Path to locale files
  const filePath = path.join(process.cwd(), "src/locales", localeToUse, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");
  
  let messages = {};
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    messages = JSON.parse(fileContent);
  } catch (error) {
    // If locale file doesn't exist, fall back to English
    try {
      const fallbackContent = fs.readFileSync(fallbackPath, "utf-8");
      messages = JSON.parse(fallbackContent);
      console.warn(`Locale ${localeToUse} not found for contact page, using English fallback`);
    } catch (fallbackError) {
      console.error("Failed to load any locale files:", fallbackError);
      messages = {};
    }
  }
  
  return {
    props: {
      messages,
    },
  };
};
