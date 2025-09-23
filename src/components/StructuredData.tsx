import Head from 'next/head';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'softwareApplication';
}

export default function StructuredData({ type = 'softwareApplication' }: StructuredDataProps) {
  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Ventio",
      "url": "https://ventio.com",
      "logo": "https://tactec.club/images/logo.png",
      "description": "TACTEC by Ventio - Professional football club management platform",
      "sameAs": [
        "https://twitter.com/ventio",
        "https://linkedin.com/company/ventio"
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TACTEC",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Sports Management Software",
      "operatingSystem": "Web, iOS, Android",
      "description": "TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Contact for pricing"
      },
      "creator": {
        "@type": "Organization",
        "name": "Ventio",
        "url": "https://ventio.com"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "50"
      },
      "featureList": [
        "Team Management",
        "Tactical Boards",
        "Medical & Wellness Tracking",
        "Performance Analytics",
        "Multi-language Support",
        "Cross-platform Compatibility"
      ]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "TACTEC",
      "url": "https://tactec.club",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://tactec.club/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };

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
