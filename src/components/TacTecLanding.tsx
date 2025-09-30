import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";
import StructuredData from "./StructuredData";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";

type NavLink = {
  href: string;
  labelKey: string;
};

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const navigationLinks: NavLink[] = [
  { href: "#challenge", labelKey: "nav.challenge" },
  { href: "#solution", labelKey: "nav.solution" },
  { href: "#features", labelKey: "nav.features" },
  { href: "#case-studies", labelKey: "nav.caseStudies" },
  { href: "#pricing", labelKey: "nav.pricing" },
  { href: "#contact", labelKey: "nav.contact" },
];

const heroStatKeys = ["injury", "sync", "adoption"] as const;
const challengeKeys = ["staff", "workflows", "insights"] as const;
const solutionKeys = ["connect", "coordinate", "measure"] as const;
const solutionOutcomeKeys = ["clarity", "speed", "confidence"] as const;
const featureKeys = ["medical", "performance", "tactical", "operations"] as const;
const highlightKeys = ["mobile", "security", "support"] as const;
const techKeys = ["cloud", "analytics", "access"] as const;
const metricKeys = ["satisfaction", "reporting", "recovery"] as const;
const caseStudyKeys = ["academy", "firstTeam", "women"] as const;

export default function TacTecLanding() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const socialProofLogos = (t.raw("socialProof.logos") as string[]) ?? [];
  const pricingPlans = (t.raw("pricing.plans") as PricingPlan[]) ?? [];
  const pageTitle = `TACTEC – ${t("hero.title_highlight")}`;

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty("overflow");
      return undefined;
    }

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    document.body.style.setProperty("overflow", "hidden");

    const firstFocusable = menuContainerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    firstFocusable?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node) &&
        event.target !== menuButtonRef.current
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.removeProperty("overflow");
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      previouslyFocusedElement.current?.focus();
    };
  }, [isMenuOpen]);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavClick = (type: string) => {
    trackEvent("cta_click", { type });
    setIsMenuOpen(false);
  };

  const handlePrimaryCTA = (type: string) => () => {
    trackEvent("cta_click", { type });
  };

  const renderNavLinks = (className?: string) => (
    <div className={className}>
      {navigationLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-gray-700 hover:text-sky-600 dark:text-gray-200 dark:hover:text-sky-300 transition-colors"
          onClick={() => handleNavClick(link.href.replace("#", ""))}
        >
          {t(link.labelKey)}
        </a>
      ))}
    </div>
  );

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-sky-600 focus:text-white"
      >
        {t("layout.skip")}
      </a>

      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content="Professional football club management platform"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
      </Head>

      <StructuredData type="softwareApplication" />

      <nav className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-sky-600">
            TACTEC
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {renderNavLinks("flex items-center gap-6")}
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              onClick={() => trackEvent("cta_click", { type: "contact" })}
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={handleToggleMenu}
              className="inline-flex items-center rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {isMenuOpen ? t("nav.close") : t("nav.menu")}
              </span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={menuContainerRef}
            className="border-t border-gray-200 bg-white px-6 py-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:hidden"
          >
            <div className="flex flex-col gap-4" role="menu">
              {navigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-gray-800 hover:text-sky-600 dark:text-gray-100 dark:hover:text-sky-300"
                  onClick={() => handleNavClick(link.href.replace("#", ""))}
                >
                  {t(link.labelKey)}
                </a>
              ))}
              <Link
                href="/contact"
                className="rounded-full bg-sky-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                onClick={() => handleNavClick("contact")}
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main id="content" className="bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <section className="container mx-auto px-6 pb-24 pt-20" id="hero">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                {t("hero.trusted")}
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl">
                {t("hero.title")} {" "}
                <span className="text-sky-600">{t("hero.title_highlight")}</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                {t("hero.subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  onClick={handlePrimaryCTA("hero_demo")}
                >
                  {t("hero.cta.demo")}
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-100 dark:hover:border-sky-500"
                  onClick={handlePrimaryCTA("hero_learn")}
                >
                  <span aria-hidden="true">▶</span>
                  {t("hero.cta.learn")}
                </button>
                <Link
                  href="#case-studies"
                  className="rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-gray-100"
                  onClick={handlePrimaryCTA("hero_case_studies")}
                >
                  {t("hero.cta.start")}
                </Link>
              </div>

              <dl className="mt-12 grid gap-6 sm:grid-cols-3">
                {heroStatKeys.map((key) => (
                  <div key={key} className="rounded-xl border border-gray-200 bg-white/80 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t(`hero.stats.${key}.label`)}
                    </dt>
                    <dd className="mt-2 text-3xl font-semibold text-sky-600">
                      {t(`hero.stats.${key}.value`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
              <div className="rounded-2xl bg-sky-950/90 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
                  {t("problemSolution.label")}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-sky-100">
                  {t("problemSolution.copy")}
                </p>
                <p className="mt-6 text-sm text-sky-200">
                  {t("problemSolution.note")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="challenge" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              {t("challenge.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("challenge.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("challenge.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {challengeKeys.map((key) => (
              <article key={key} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t(`challenge.items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {t(`challenge.items.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="solution" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              {t("solution.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("solution.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("solution.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {solutionKeys.map((key) => (
              <article key={key} className="rounded-3xl border border-emerald-200/70 bg-white p-8 shadow-sm dark:border-emerald-500/30 dark:bg-gray-900">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                  {t(`solution.pillars.${key}.title`)}
                </p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {t(`solution.pillars.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-slate-900 px-8 py-10 text-white">
            <h3 className="text-xl font-semibold">{t("solution.outcome.title")}</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {solutionOutcomeKeys.map((key) => (
                <p key={key} className="text-sm text-slate-200">
                  {t(`solution.outcome.items.${key}`)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              {t("features.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-4">
            {featureKeys.map((key) => (
              <article key={key} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t(`features.categories.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {t(`features.categories.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-gray-200 bg-gradient-to-r from-sky-600 to-purple-600 p-8 text-white shadow-lg dark:border-gray-800">
            <h3 className="text-xl font-semibold">{t("features.highlights.title")}</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {highlightKeys.map((key) => (
                <p key={key} className="text-sm text-sky-50">
                  {t(`features.highlights.items.${key}`)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="technology" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              {t("tech.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("tech.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("tech.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {techKeys.map((key) => (
              <article key={key} className="rounded-3xl border border-indigo-200/70 bg-white p-8 shadow-sm dark:border-indigo-500/30 dark:bg-gray-900">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                  {t(`tech.pillars.${key}.title`)}
                </p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {t(`tech.pillars.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="metrics" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("metrics.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("metrics.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {metricKeys.map((key) => (
              <article key={key} className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-4xl font-bold text-sky-600">
                  {t(`metrics.items.${key}.value`)}
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {t(`metrics.items.${key}.label`)}
                </p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {t(`metrics.items.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="social-proof" className="bg-slate-900 py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
                {t("socialProof.eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold">{t("socialProof.title")}</h2>
              <p className="mt-4 text-lg text-slate-200">{t("socialProof.subtitle")}</p>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {socialProofLogos
                .filter((logo) => Boolean(logo))
                .map((logo) => (
                  <span key={logo} className="text-lg font-semibold tracking-wide text-slate-300">
                    {logo}
                  </span>
                ))}
            </div>

              <blockquote className="mx-auto mt-12 max-w-2xl text-center text-lg italic text-slate-100">
                “{t("socialProof.quote")}”
              <footer className="mt-4 text-sm font-semibold text-slate-300">
                {t("socialProof.role")}
              </footer>
            </blockquote>
          </div>
        </section>

        <section id="case-studies" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-500">
              {t("caseStudies.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("caseStudies.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("caseStudies.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {caseStudyKeys.map((key) => (
              <article key={key} className="rounded-3xl border border-purple-200/60 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-purple-500/20 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">
                  {t(`caseStudies.cards.${key}.sector`)}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {t(`caseStudies.cards.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {t(`caseStudies.cards.${key}.summary`)}
                </p>
                <p className="mt-6 text-sm font-semibold text-purple-500">
                  {t(`caseStudies.cards.${key}.result`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              {t("pricing.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t("pricing.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex flex-col rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-900 ${
                    plan.highlighted
                      ? "border-sky-500 ring-2 ring-sky-200 dark:border-sky-500/70 dark:ring-sky-500/30"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <span className="text-sm font-medium text-sky-600">
                      {plan.price}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 text-sky-500">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "border border-gray-300 text-gray-900 hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-100"
                    }`}
                    onClick={() => trackEvent("cta_click", { type: `pricing_${plan.name}` })}
                  >
                    {t("pricing.cta")}
                  </Link>
                </article>
              ))}
          </div>
        </section>

        <section id="contact" className="container mx-auto px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                {t("cta.eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {t("cta.subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  onClick={() => trackEvent("cta_click", { type: "cta_demo" })}
                >
                  {t("cta.buttons.demo")}
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-100"
                  onClick={handlePrimaryCTA("cta_overview")}
                >
                  {t("cta.buttons.tour")}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-100"
                  onClick={handlePrimaryCTA("cta_app")}
                >
                  {t("cta.buttons.app")}
                </button>
              </div>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.q1")}
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t("faq.a1")}</p>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.q2")}
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t("faq.a2")}</p>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                {t("faq.q3")}
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t("faq.a3")}</p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-2xl font-semibold text-sky-600">
                TACTEC
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                {t("footer.about")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                {t("footer.product")}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {navigationLinks.map((link) => (
                  <li key={`footer-${link.href}`}>
                    <a
                      href={link.href}
                      className="transition hover:text-sky-600 dark:hover:text-sky-400"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                {t("footer.company")}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link href="/privacy" className="transition hover:text-sky-600 dark:hover:text-sky-400">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-sky-600 dark:hover:text-sky-400">
                    {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                {t("footer.resources.productOverview")}
              </h3>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                {t("footer.made")}
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <p>{t("footer.rights")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
