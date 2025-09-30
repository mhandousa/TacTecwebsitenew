import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { trackLanguageSwitch } from '@/utils/analytics';

const locales = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'pt-BR', label: 'PT-BR', name: 'Português (BR)' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'de', label: 'DE', name: 'Deutsch' }
];

export default function LanguageSwitcher() {
  const { locale, pathname, asPath, query } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    if (locale && newLocale !== locale) {
      trackLanguageSwitch(locale, newLocale);
    }
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="md:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          aria-label={`Current language: ${currentLocale.name}. Click to change language.`}
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
            {locales.map(l => (
              <Link
                key={l.code}
                href={{ pathname, query }}
                locale={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  l.code === locale ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
                }`}
                role="menuitem"
                aria-current={l.code === locale ? 'true' : undefined}
                lang={l.code}
              >
                <span className="font-medium" aria-hidden="true">{l.label}</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{l.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Inline Buttons */}
      <div 
        className="hidden md:inline-flex border rounded-md overflow-hidden text-xs" 
        role="group" 
        aria-label="Language selection"
      >
        {locales.map(l => (
          <Link
            key={l.code}
            href={{ pathname, query }}
            locale={l.code}
            onClick={() => handleLanguageChange(l.code)}
            className={`px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors ${
              l.code === locale 
                ? 'bg-gray-200 dark:bg-gray-800 font-semibold' 
                : ''
            }`}
            aria-label={`Switch to ${l.name}`}
            aria-current={l.code === locale ? 'true' : undefined}
            lang={l.code}
            title={l.name}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
