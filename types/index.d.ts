
// Global shared types for TACTEC project

declare type Locale = "en" | "ar" | "pt" | "pt-BR" | "es" | "fr" | "it" | "de";

interface FAQItem {
  q: string;
  a: string;
}

interface NavLink {
  href: string;
  label: string;
}
