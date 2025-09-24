import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { SITE_URL } from "@/config/env";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ✅ Removed fs/path imports from top

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy - TACTEC</title>
        <meta
          name="description"
          content="TACTEC Privacy Policy - How we collect, use, and protect your data"
        />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Privacy Policy - TACTEC" />
        <meta
          property="og:description"
          content="Learn how TACTEC collects, uses, and protects your personal data"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
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

      {/* Main Content (unchanged) */}
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* ... your full privacy policy content ... */}
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

// ✅ Fixed: import fs/path inside getStaticProps only
export async function getStaticProps({ locale }: { locale: string }) {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "src/locales", locale, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");
  let messages = {};

  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }

  return { props: { messages } };
}
