import Link from 'next/link';
import { useRouter } from 'next/router';
import { trackLanguageSwitch } from '@/utils/analytics';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
  { code: 'pt', label: 'PT' },
  { code: 'pt-BR', label: 'PT-BR' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' }
];

export default function LanguageSwitcher() {
  const { locale, pathname, asPath, query } = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (locale && newLocale !== locale) {
      trackLanguageSwitch(locale, newLocale);
    }
  };

  return (
    <div className="inline-flex border rounded-md overflow-hidden text-xs" role="group" aria-label="Language switcher">
      {locales.map(l => (
        <Link 
          key={l.code} 
          href={{ pathname, query }} 
          as={asPath} 
          locale={l.code}
          onClick={() => handleLanguageChange(l.code)}
          className={`px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors ${
            l.code === locale 
              ? 'bg-gray-200 dark:bg-gray-800 font-semibold' 
              : ''
          }`}
          aria-label={`Switch to ${l.label}`}
          aria-current={l.code === locale ? 'true' : undefined}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
