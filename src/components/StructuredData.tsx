import Head from 'next/head';
import { SITE_URL } from '@/config/env';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'softwareApplication';
}

export default function StructuredData({ type = 'softwareApplication' }: StructuredDataProps) {
  const canonicalBase = SITE_URL.replace(/\/+$/, '');

  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Ventio",
      "url": canonicalBase,
      "logo": `${canonicalBase}/images/logo.png`,
      "description": "TACTEC by Ventio - Professional football club management platform",
      "sameAs": [
        "https://www.linkedin.com/company/ventio"
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TACTEC",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Sports Management Software",
      "operatingSystem": "Web, iOS, Android",
      "isAccessibleForFree": false,
      "description": "TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs.",
      "creator": {
        "@type": "Organization",
        "name": "Ventio",
        "url": canonicalBase
      },
      "featureList": [
        "Team management",
        "Tactical planning",
        "Medical & wellness tracking",
        "Performance analytics",
        "Multi-language staff & player apps"
      ]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "TACTEC",
      "url": canonicalBase,
      "inLanguage": "en"
    }
  } as const;

  const schemaData = schemas[type];

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2)
        }}
      />
    </Head>
  );
}
