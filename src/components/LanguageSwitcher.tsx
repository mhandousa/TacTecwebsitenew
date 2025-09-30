import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { trackLanguageSwitch } from "@/utils/analytics";

type LocaleStatus = "full" | "beta";

const locales = [
  { code: "en", label: "EN", name: "English", status: "full", coverageKey: "fullProduct" },
  { code: "ar", label: "AR", name: "العربية", status: "beta", coverageKey: "corePages" },
  { code: "pt", label: "PT", name: "Português", status: "full", coverageKey: "fullProduct" },
  { code: "pt-BR", label: "PT-BR", name: "Português (BR)", status: "beta", coverageKey: "corePages" },
  { code: "es", label: "ES", name: "Español", status: "beta", coverageKey: "corePages" },
  { code: "fr", label: "FR", name: "Français", status: "beta", coverageKey: "corePages" },
  { code: "it", label: "IT", name: "Italiano", status: "beta", coverageKey: "corePages" },
  { code: "de", label: "DE", name: "Deutsch", status: "beta", coverageKey: "corePages" },
] as const;

export default function LanguageSwitcher() {
  // Note: `asPath` is intentionally not destructured because the localized
  // links are generated from the pathname/query combination.
  const { locale, pathname, query } = useRouter();
  const t = useTranslations("languageSwitcher");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [preferenceMessage, setPreferenceMessage] = useState("");

  const statusLabels: Record<LocaleStatus, string> = {
    full: t("status.full"),
    beta: t("status.beta"),
  };

  const handleLanguageChange = (newLocale: string) => {
    const selectedLocale = locales.find((item) => item.code === newLocale);

    if (locale && newLocale !== locale) {
      trackLanguageSwitch(locale, newLocale);
    }

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("tactec_locale", newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      } catch (error) {
        console.error("Failed to persist locale preference", error);
      }
    }

    setPreferenceMessage(
      t("remembered", {
        locale: selectedLocale?.name ?? newLocale,
      }),
    );

    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="md:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          aria-label={t("current", { locale: currentLocale.name })}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls="language-menu-mobile"
        >
          <span aria-hidden="true">{currentLocale.label}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            id="language-menu-mobile"
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-button"
          >
            {locales.map((l) => {
              const descriptionId = `language-${l.code}-coverage`;
              const coverageCopy = t(`coverage.${l.coverageKey}`);
              const statusLabel = statusLabels[l.status];

              return (
                <Link
                  key={l.code}
                  href={{ pathname, query }}
                  locale={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    l.code === locale ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                  }`}
                  role="menuitem"
                  aria-current={l.code === locale ? "true" : undefined}
                  lang={l.code}
                  aria-describedby={descriptionId}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium" aria-hidden="true">
                        {l.label}
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {l.name}
                      </span>
                    </div>
                    <span className="ml-3 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                      {statusLabel}
                    </span>
                  </div>
                  <p
                    id={descriptionId}
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    {coverageCopy}
                  </p>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
              {t("coverageNote")}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Inline Buttons */}
      <div 
        className="hidden md:inline-flex border rounded-md overflow-hidden text-xs" 
        role="group"
        aria-label={t("label")}
      >
        {locales.map((l) => {
          const coverageCopy = t(`coverage.${l.coverageKey}`);
          const statusLabel = statusLabels[l.status];
          const description = `${statusLabel}. ${coverageCopy}`;

          return (
            <Link
              key={l.code}
              href={{ pathname, query }}
              locale={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={`px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors ${
                l.code === locale
                  ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                  : ""
              }`}
              aria-label={t("switchTo", { locale: l.name, description })}
              aria-current={l.code === locale ? "true" : undefined}
              lang={l.code}
              title={`${l.name} • ${description}`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
      <div className="sr-only" aria-live="polite">
        {preferenceMessage}
      </div>
    </>
  );
}
