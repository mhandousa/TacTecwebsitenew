import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { pageview } from "@/utils/analytics";

export default function TacTecLanding() {
  const t = useTranslations("common");
  const { locale = "en", defaultLocale = "en" } = useRouter();
  const { i18n } = getConfig() || { i18n: {} };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club";
  const ogImage = `${siteUrl}/images/1_TacTec-Revolutionising-Football-Club-Management.webp`;

  return (
    <>
      <Head>
        <title>TACTEC – {t("hero.title")} {t("hero.title_highlight")}</title>
        <meta
          name="description"
          content="TACTEC unifies tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="canonical" href={`${siteUrl}/`} />

        {/* hreflang alternates */}
        {i18n?.locales?.map((l: string) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l.toLowerCase()}
            href={`${siteUrl}${l === defaultLocale ? "/" : `/${l}/`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />

        {/* OG / Twitter */}
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta
          property="og:description"
          content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta
          name="twitter:description"
          content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs."
        />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <main id="content">
        {/* Hero Section */}
        <section className="relative bg-black text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">
              {t("hero.title")}{" "}
              <span className="text-sky-400">{t("hero.title_highlight")}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl">{t("hero.subtitle")}</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="#demo" legacyBehavior>
                <a
                  onClick={() => pageview("cta_start")}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  {t("hero.cta.start")}
                </a>
              </Link>
              <Link href="#demo" legacyBehavior>
                <a
                  onClick={() => pageview("cta_demo")}
                  className="border border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500 px-6 py-3 rounded-lg font-semibold"
                >
                  {t("hero.cta.demo")}
                </a>
              </Link>
            </div>
            <div className="mt-12">
              <Image
                src="/images/1_TacTec-Revolutionising-Football-Club-Management.webp"
                alt="TACTEC revolutionising football club management"
                width={1000}
                height={600}
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Example Feature Section */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold">{t("challenge.eyebrow")}</h2>
          <p className="mt-4 text-lg">{t("challenge.subtitle")}</p>
          <div className="mt-8">
            <Image
              src="/images/2_The-Challenge-Fragmented-Football-Operations.webp"
              alt="Challenge – Fragmented football operations"
              width={1000}
              height={600}
              loading="lazy"
            />
          </div>
        </section>

        {/* Add more sections (solution, features, tech, etc.) similarly */}
      </main>
    </>
  );
}
