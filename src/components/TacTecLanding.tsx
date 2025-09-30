import { useState } from "react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import StructuredData from "./StructuredData";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";

export default function TacTecLanding() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCTAClick = (type: string) => {
    trackEvent("cta_click", { type });
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = (callback?: () => void) => () => {
    setIsMenuOpen(false);
    if (callback) {
      callback();
    }
  };

  return (
    <>
      <Head>
        <title>TACTEC – Revolutionising Football Club Management</title>
        <meta
          name="description"
          content="TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <link rel="canonical" href={SITE_URL} />
        <meta
          property="og:title"
          content="TACTEC – Revolutionising Football Club Management"
        />
        <meta
          property="og:description"
          content="Professional football club management platform"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta
          property="og:image"
          content={`${SITE_URL}/images/1_TacTec-Revolutionising-Football-Club-Management.webp`}
        />
      </Head>

      <StructuredData type="softwareApplication" />

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition"
            >
              TACTEC
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-6">
                <a href="#features" className="hover:text-sky-600 transition">
                  {t("nav.features")}
                </a>
                <a href="#tech" className="hover:text-sky-600 transition">
                  {t("nav.tech")}
                </a>
                <Link href="/contact" className="hover:text-sky-600 transition">
                  {t("nav.contact")}
                </Link>
              </div>
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <button
                type="button"
                onClick={handleToggleMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-sky-400 md:hidden"
                aria-expanded={isMenuOpen}
                aria-controls="primary-navigation"
              >
                <span className="sr-only">{isMenuOpen ? t("nav.close") : t("nav.menu")}</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div
            id="primary-navigation"
            className={`${isMenuOpen ? "mt-4 block" : "hidden"} md:hidden`}
          >
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <a
                href="#features"
                onClick={handleMenuItemClick()}
                className="block text-base font-medium text-gray-700 transition hover:text-sky-600 dark:text-gray-100"
              >
                {t("nav.features")}
              </a>
              <a
                href="#tech"
                onClick={handleMenuItemClick()}
                className="block text-base font-medium text-gray-700 transition hover:text-sky-600 dark:text-gray-100"
              >
                {t("nav.tech")}
              </a>
              <Link
                href="/contact"
                onClick={handleMenuItemClick()}
                className="block text-base font-medium text-gray-700 transition hover:text-sky-600 dark:text-gray-100"
              >
                {t("nav.contact")}
              </Link>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main id="content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sky-600 font-semibold mb-4">
                {t("hero.trusted")}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                {t("hero.title")}{" "}
                <span className="text-sky-600">
                  {t("hero.title_highlight")}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  onClick={() => handleCTAClick("demo")}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  {t("hero.cta.demo")}
                </Link>
                <Link
                  href="#features"
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
                >
                  {t("hero.cta.start")}
                </Link>
              </div>
            </div>

            <div className="mt-16 max-w-5xl mx-auto">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/1_TacTec-Revolutionising-Football-Club-Management.webp"
                  alt="TACTEC revolutionising football club management"
                  width={1920}
                  height={1080}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
                  quality={90}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section id="challenge" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-sky-600 font-semibold mb-4">
                {t("challenge.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t("challenge.title")}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                {t("challenge.subtitle")}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8 max-w-6xl mx-auto">
              {["staff", "workflows", "insights"].map((item) => (
                <div
                  key={item}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {t(`challenge.items.${item}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(`challenge.items.${item}.desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 max-w-5xl mx-auto">
              <Image
                src="/images/2_The-Challenge-Fragmented-Football-Operations.webp"
                alt="Challenge – Fragmented football operations"
                width={1920}
                height={1080}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
                quality={85}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sky-600 font-semibold mb-4">
                {t("solution.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("solution.title")}</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                {t("solution.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sky-600 font-semibold mb-4">
                {t("features.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("features.title")}</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                {t("features.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Tech Section */}
        <section id="tech" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sky-600 font-semibold mb-4">
                {t("tech.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("tech.title")}</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                {t("tech.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="demo" className="py-20 bg-sky-600 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="font-semibold mb-4">{t("cta.eyebrow")}</p>
              <h2 className="text-4xl font-bold mb-4">{t("cta.title")}</h2>
              <p className="text-xl mb-8">{t("cta.subtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  onClick={() => handleCTAClick("live_demo")}
                  className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
                >
                  {t("cta.buttons.demo")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">TACTEC</h3>
              <p className="text-sm">{t("footer.about")}</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">
                {t("footer.product")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    {t("nav.features")}
                  </a>
                </li>
                <li>
                  <a href="#tech" className="hover:text-white transition">
                    {t("nav.tech")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">
                {t("footer.company")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    {t("nav.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{t("footer.rights")}</p>
            <p className="mt-2 text-sky-400">{t("footer.made")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
