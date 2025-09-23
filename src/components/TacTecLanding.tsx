import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trackEvent, trackExternalLink, initScrollTracking, ANALYTICS_EVENTS } from "@/utils/analytics";
import { SITE_URL } from "@/config/env";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TacTecLanding() {
  const t = useTranslations("common");
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  
  const siteUrl = SITE_URL;
  const ogImage = `${siteUrl}/images/1_TacTec-Revolutionising-Football-Club-Management.webp`;

  // Initialize scroll tracking on mount
  useEffect(() => {
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);

  return (
    <>
      <Head>
        <title>TACTEC – {t("hero.title")} {t("hero.title_highlight")}</title>
        <meta
          name="description"
          content="TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="canonical" href={`${siteUrl}/`} />

        {/* hreflang alternates */}
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l.toLowerCase()}
            href={`${siteUrl}${l === defaultLocale ? "/" : `/${l}/`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />

        {/* OG / Twitter */}
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta
          property="og:description"
          content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta
          name="twitter:description"
          content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-sky-600">TACTEC</div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <a 
                href="#challenge" 
                className="hover:text-sky-600 transition"
                onClick={() => trackEvent(ANALYTICS_EVENTS.NAV_CHALLENGE)}
              >
                {t("nav.challenge")}
              </a>
              <a 
                href="#solution" 
                className="hover:text-sky-600 transition"
                onClick={() => trackEvent(ANALYTICS_EVENTS.NAV_SOLUTION)}
              >
                {t("nav.solution")}
              </a>
              <a 
                href="#features" 
                className="hover:text-sky-600 transition"
                onClick={() => trackEvent(ANALYTICS_EVENTS.NAV_FEATURES)}
              >
                {t("nav.features")}
              </a>
              <a 
                href="#tech" 
                className="hover:text-sky-600 transition"
                onClick={() => trackEvent(ANALYTICS_EVENTS.NAV_TECH)}
              >
                {t("nav.tech")}
              </a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main id="content">
        {/* Hero Section */}
        <section className="relative bg-black text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <p className="text-sm text-gray-400 mb-4">{t("hero.trusted")}</p>
            <h1 className="text-4xl md:text-6xl font-bold">
              {t("hero.title")}{" "}
              <span className="text-sky-400">{t("hero.title_highlight")}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="#demo" legacyBehavior>
                <a
                  onClick={() => trackEvent(ANALYTICS_EVENTS.CTA_START)}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  {t("hero.cta.start")}
                </a>
              </Link>
              <Link href="#demo" legacyBehavior>
                <a
                  onClick={() => trackEvent(ANALYTICS_EVENTS.CTA_DEMO)}
                  className="border border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500 px-6 py-3 rounded-lg font-semibold transition"
                >
                  {t("hero.cta.demo")}
                </a>
              </Link>
            </div>
            <div className="mt-12">
              <Image
                src="/images/1_TacTec-Revolutionising-Football-Club-Management.webp"
                alt="TACTEC revolutionising football club management"
                width={1000}
                height={600}
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section id="challenge" className="container mx-auto px-6 py-20">
          <p className="text-sky-600 font-semibold text-sm mb-2">{t("challenge.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{t("challenge.title")}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("challenge.subtitle")}</p>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{t("challenge.items.staff.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("challenge.items.staff.desc")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{t("challenge.items.workflows.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("challenge.items.workflows.desc")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{t("challenge.items.insights.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("challenge.items.insights.desc")}</p>
            </div>
          </div>

          <div className="mt-12">
            <Image
              src="/images/2_The-Challenge-Fragmented-Football-Operations.webp"
              alt="Challenge – Fragmented football operations"
              width={1000}
              height={600}
              loading="lazy"
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container mx-auto px-6">
            <p className="text-sky-600 font-semibold text-sm mb-2">{t("solution.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold">{t("solution.title")}</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{t("solution.subtitle")}</p>
            
            <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl">1</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Unified Data Platform</h3>
                    <p className="text-gray-600 dark:text-gray-400">All your club's data in one secure, accessible location.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl">2</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Automated Workflows</h3>
                    <p className="text-gray-600 dark:text-gray-400">Streamline reporting, planning, and communication.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl">3</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Real-Time Insights</h3>
                    <p className="text-gray-600 dark:text-gray-400">Make informed decisions with up-to-date analytics.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-gray-500">Solution Visual Placeholder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <p className="text-sky-600 font-semibold text-sm mb-2">{t("features.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{t("features.title")}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("features.subtitle")}</p>
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border hover:border-sky-500 transition">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-2xl mb-4">⚽</div>
              <h3 className="font-semibold mb-2">Team Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize squads, track availability, manage rosters</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border hover:border-sky-500 transition">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-2xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">Tactical Boards</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visual tactics, formations, and drill planning</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border hover:border-sky-500 transition">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-2xl mb-4">🏥</div>
              <h3 className="font-semibold mb-2">Medical & Wellness</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Injury tracking, recovery monitoring, health data</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border hover:border-sky-500 transition">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-2xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Advanced Reporting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance analytics, custom dashboards, insights</p>
            </div>
          </div>
        </section>

        {/* Tech Section */}
        <section id="tech" className="bg-black text-white py-20">
          <div className="container mx-auto px-6">
            <p className="text-sky-400 font-semibold text-sm mb-2">{t("tech.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold">{t("tech.title")}</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">{t("tech.subtitle")}</p>
            
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-3 text-sky-400">Universal Clean Architecture</h3>
                <p className="text-gray-400">4-layer pattern ensures consistency across web, mobile, and desktop platforms.</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-3 text-sky-400">High-Performance Graphics</h3>
                <p className="text-gray-400">React Native Skia delivers desktop-class 2D graphics with 60fps rendering.</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-3 text-sky-400">Modern Stack</h3>
                <p className="text-gray-400">Built with Next.js, TypeScript, and cutting-edge development tools.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="font-semibold text-lg mb-2">{t("faq.q1")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("faq.a1")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="font-semibold text-lg mb-2">{t("faq.q2")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("faq.a2")}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="font-semibold text-lg mb-2">{t("faq.q3")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("faq.a3")}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="demo" className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sky-200 font-semibold text-sm mb-2">{t("cta.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-bold">{t("cta.title")}</h2>
            <p className="mt-4 text-lg text-sky-100 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => trackEvent(ANALYTICS_EVENTS.CTA_DEMO_BOTTOM)}
                className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
              >
                {t("cta.buttons.demo")}
              </button>
              <button
                onClick={() => trackEvent(ANALYTICS_EVENTS.CTA_APP_BOTTOM)}
                className="border-2 border-white hover:bg-white hover:text-sky-600 px-8 py-3 rounded-lg font-semibold transition"
              >
                {t("cta.buttons.app")}
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-2xl font-bold text-white mb-4">TACTEC</div>
                <p className="text-sm">{t("footer.about")}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">{t("footer.product")}</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#tech" className="hover:text-white transition">Technology</a></li>
                  <li><a href="#demo" className="hover:text-white transition">Get Demo</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">{t("footer.company")}</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://ventio.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackExternalLink('https://ventio.com', 'About Ventio')}
                      className="hover:text-white transition"
                    >
                      About Ventio
                    </a>
                  </li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-sm text-center">
              <p>{t("footer.rights")}</p>
              <p className="mt-2 text-sky-400">{t("footer.made")}</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
