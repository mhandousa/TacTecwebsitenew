import { getRequestConfig } from 'next-intl/server';

// Define all supported locales
export const locales = ['en', 'ar', 'pt', 'pt-BR', 'es', 'fr', 'it', 'de'];

// Default locale (fallback)
export const defaultLocale = 'en';

// Export Next-Intl configuration
export default getRequestConfig(async ({ locale }) => ({
  locale,
  messages: (await import(`./src/locales/${locale}/common.json`)).default
}));
