import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import StructuredData from "./StructuredData";
import { SITE_URL } from "@/config/env";
import { trackEvent, trackScrollDepth } from "@/utils/analytics";

export default function TacTecLanding() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const thresholds = [25, 50, 75, 100];
    const seen = new Set<number>();

    const evaluateScrollDepth = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;

      for (const threshold of thresholds) {
        if (progress >= threshold && !seen.has(threshold)) {
          seen.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    };

    const handleScroll = () => evaluateScrollDepth();
    const handleResize = () => evaluateScrollDepth();

    evaluateScrollDepth();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const heroStatKeys = ["injury", "sync", "adoption"] as const;
  const solutionPillarKeys = ["connect", "coordinate", "measure"] as const;
  const solutionOutcomeKeys = ["clarity", "speed", "confidence"] as const;
  const featureKeys = ["medical", "performance", "tactical", "operations"] as const;
  const highlightKeys = ["mobile", "security", "support"] as const;
  const techPillarKeys = ["cloud", "analytics", "access"] as const;
  const metricsKeys = ["satisfaction", "reporting", "recovery"] as const;
  const testimonialKeys = ["director", "coach"] as const;

  const featureIcons: Record<typeof featureKeys[number], string> = {
    medical: "🩺",
    performance: "📊",
    tactical: "🧠",
    operations: "🛠️",
  };

  const techIcons: Record<typeof techPillarKeys[number], string> = {
    cloud: "☁️",
    analytics: "📈",
    access: "🌍",
  };

  const solutionIcons: Record<typeof solutionPillarKeys[number], string> = {
    connect: "🤝",
    coordinate: "🗂️",
    measure: "📏",
  };

  const metricStyles: Record<typeof metricsKeys[number], string> = {
    satisfaction: "from-sky-500/10 to-sky-500/5 dark:from-sky-400/10 dark:to-sky-500/5",
    reporting: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-400/10 dark:to-emerald-500/5",
    recovery: "from-purple-500/10 to-purple-500/5 dark:from-purple-400/10 dark:to-purple-500/5",
  };

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-sky-600 focus:text-white"
      >
        {t("layout.skip")}
      </a>
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
      <nav
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50"
        aria-label="Primary"
      >
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
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
          </div>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center relative">
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
                  className="border border-gray-300 dark:border-gray-600 hover:border-sky-400 hover:bg-white/60 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition"
                >
                  {t("hero.cta.start")}
                </Link>
                <a
                  href="#solution"
                  className="inline-flex items-center justify-center gap-2 text-sky-600 font-semibold px-8 py-3 rounded-lg transition hover:text-sky-700"
                >
                  {t("hero.cta.learn")}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {heroStatKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-white/60 bg-white/80 px-6 py-5 text-left shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70"
                >
                  <p className="text-3xl font-bold text-sky-600">
                    {t(`hero.stats.${key}.value`)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t(`hero.stats.${key}.label`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 max-w-5xl mx-auto relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-sky-500/5 blur-2xl" aria-hidden="true" />
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
        <section id="solution" className="py-24 bg-gray-50 dark:bg-gray-800">
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

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {solutionPillarKeys.map((key) => (
                <div
                  key={key}
                  className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl">
                    <span aria-hidden="true">{solutionIcons[key]}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t(`solution.pillars.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {t(`solution.pillars.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-sky-100 bg-sky-50/60 p-8 text-center dark:border-sky-500/30 dark:bg-sky-500/10">
              <h3 className="text-2xl font-semibold text-sky-700 dark:text-sky-300">
                {t("solution.outcome.title")}
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {solutionOutcomeKeys.map((key) => (
                  <p key={key} className="text-sm text-gray-700 dark:text-gray-200">
                    {t(`solution.outcome.items.${key}`)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-gray-900">
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

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureKeys.map((key) => (
                <div
                  key={key}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl">
                    <span aria-hidden="true">{featureIcons[key]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t(`features.categories.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {t(`features.categories.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 p-8 text-white shadow-xl">
                <h3 className="text-2xl font-semibold">{t("features.highlights.title")}</h3>
                <p className="mt-4 text-sm text-sky-100">
                  {t("challenge.subtitle")}
                </p>
              </div>
              <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
                {highlightKeys.map((key) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {t(`features.highlights.items.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Section */}
        <section id="tech" className="py-24 bg-gray-50 dark:bg-gray-800">
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

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {techPillarKeys.map((key) => (
                <div
                  key={key}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl">
                    <span aria-hidden="true">{techIcons[key]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t(`tech.pillars.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {t(`tech.pillars.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl text-center mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t("metrics.title")}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {t("metrics.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {metricsKeys.map((key) => (
                <div
                  key={key}
                  className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${metricStyles[key]} opacity-80`}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {t(`metrics.items.${key}.value`)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                      {t(`metrics.items.${key}.label`)}
                    </p>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                      {t(`metrics.items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl text-center mx-auto">
              <p className="text-sky-400 font-semibold mb-4">{t("testimonials.title")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold">{t("testimonials.subtitle")}</h2>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {testimonialKeys.map((key) => (
                <figure
                  key={key}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
                >
                  <blockquote className="text-lg leading-relaxed text-gray-100">
                    “{t(`testimonials.quotes.${key}.quote`)}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm uppercase tracking-wide text-sky-200">
                    {t(`testimonials.quotes.${key}.role`)}
                  </figcaption>
                </figure>
              ))}
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
                <a
                  href="/docs/tactec-product-overview.pdf"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  {t("cta.buttons.tour")}
                </a>
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
