import React from "react";
import Image from "next/image";
import Head from "next/head";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { trackEvent } from "@/utils/analytics";

const SectionTitle: React.FC<{ eyebrow: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="max-w-4xl mx-auto text-center">
    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">{eyebrow}</p>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
    {subtitle && <p className="text-base md:text-lg text-muted-foreground">{subtitle}</p>}
  </div>
);
const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold">{value}</div>
    <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

export default function TacTecLanding() {
  const t = useTranslations("common");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club";
  const ogImage = `${siteUrl}/images/1_TacTec-Revolutionising-Football-Club-Management.webp`;
  return (
    <div className="min-h-screen">
      <Head>
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="canonical" href={(process.env.NEXT_PUBLIC_SITE_URL || 'https://tactec.club') + '/'} />
        {/* hreflang alternates will be rendered at build if needed; keeping canonical sufficient here */}

        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="canonical" href={`${siteUrl}/`} />
        {locales?.map((l) => (
          <link key={l} rel="alternate" hrefLang={l.toLowerCase()} href={`${siteUrl}${l===defaultLocale?'/':`/${l}/`}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={(process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + (typeof window!=="undefined" ? window.location.pathname : "/") } />
        <title>{`TACTEC – ${t("hero.title")} ${t("hero.title_highlight")}`}</title>
        <meta name="description" content={t("hero.subtitle")} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:title" content={`TACTEC – ${t("hero.title")} ${t("hero.title_highlight")}`} />
        <meta property="og:description" content={t("hero.subtitle")} />
        <meta property="og:image" content={(process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + "/images/\1"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`TACTEC – ${t("hero.title")} ${t("hero.title_highlight")}`} />
        <meta name="twitter:description" content={t("hero.subtitle")} />
        <meta name="twitter:image" content={(process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + "/images/\1"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Ventio",
                  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club",
                  "logo": (process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + "/images/Tactec-2nd-lockup.webp",
                  "sameAs": [
                    "https://linkedin.com/company/ventio",
                    "https://twitter.com/ventio",
                    "https://facebook.com/ventio",
                    "https://instagram.com/ventio"
                  ]
                },
                {
                  "@type": "Product",
                  "name": "TACTEC",
                  "brand": { "@type": "Organization", "name": "Ventio" },
                  "description": "TACTEC unifies sports science, medical, tactical, and operations into one clean platform.",
                  "image": (process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + "/images/1_TacTec-Revolutionising-Football-Club-Management.webp"
                },
                {
                  "@type": "WebSite",
                  "name": "TACTEC",
                  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": (process.env.NEXT_PUBLIC_SITE_URL || "https://tactec.club") + "/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    { "@type": "Question", "name": t("faq.q1"), "acceptedAnswer": { "@type": "Answer", "text": t("faq.a1") } },
                    { "@type": "Question", "name": t("faq.q2"), "acceptedAnswer": { "@type": "Answer", "text": t("faq.a2") } },
                    { "@type": "Question", "name": t("faq.q3"), "acceptedAnswer": { "@type": "Answer", "text": t("faq.a3") } }
                  ]
                }
              ]
            })
          }}
        />
      </Head>

      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-gray-950/60 border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/Tactec-2nd-lockup.webp" alt="TACTEC logo" width={36} height={36} className="rounded"  loading="lazy"/>
            <span className="font-bold tracking-tight">TACTEC</span>
            <Badge className="rounded-full">{t("nav.club_os")}</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#challenge" className="hover:text-blue-600">{t("nav.challenge")}</a>
            <a href="#solution" className="hover:text-blue-600">{t("nav.solution")}</a>
            <a href="#features" className="hover:text-blue-600">{t("nav.features")}</a>
            <a href="#tech" className="hover:text-blue-600">{t("nav.tech")}</a>
            <a href="#pricing" className="hover:text-blue-600">{t("nav.pricing")}</a>
            <a href="#contact" className="hover:text-blue-600">{t("nav.contact")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" className="hidden md:inline-flex">{t("nav.signin")}</Button>
            <Button className="rounded-md" onClick={() => trackEvent('cta_demo_click',{label:'Request Demo'})}>{t("hero.cta.demo")}</Button>
          </div>
        </div>
      </header>

      <section id="content" className="relative overflow-hidden">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs mb-4">{t("hero.trusted")}</div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              {t("hero.title")} <span className="text-blue-600">{t("hero.title_highlight")}</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">{t("hero.subtitle")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="rounded-md" onClick={() => trackEvent('cta_start_click',{label:'Get Started'})}>{t("hero.cta.start")}</Button>
              <Button variant="outline" className="rounded-md" onClick={() => trackEvent('cta_demo_click',{label:'Request Demo'})}>{t("hero.cta.demo")}</Button>
              <div className="flex items-center gap-4">
                <Stat value="30%" label={t("hero.stats.injury")} />
                <Stat value="2×" label={t("hero.stats.sync")} />
              </div>
            </div>
          </div>
          <div className="relative">
            <Image src="/images/1_TacTec-Revolutionising-Football-Club-Management.webp" priority sizes="(min-width: 1024px) 900px, 100vw" priority sizes="(min-width: 1024px) 900px, 100vw" alt="TACTEC revolutionising football club management" width={900} height={650} priority className="rounded-2xl border shadow-sm" / priority sizes="(min-width: 1024px) 900px, 100vw">
          </div>
        </div>
      </section>

      <section id="challenge" className="section">
        <SectionTitle eyebrow={t("challenge.eyebrow")} title={t("challenge.title")} subtitle={t("challenge.subtitle")} />
        <div className="container mt-10 grid md:grid-cols-2 gap-6 items-center">
          <div><Image src="/images/2_The-Challenge-Fragmented-Football-Operations.webp" alt="Fragmented football operations" width={1000} height={700} className="rounded-xl shadow-md"  loading="lazy"/></div>
          <div className="grid gap-6">
            <Card><CardHeader><CardTitle>{t("challenge.items.staff.title")}</CardTitle></CardHeader><CardContent>{t("challenge.items.staff.desc")}</CardContent></Card>
            <Card><CardHeader><CardTitle>{t("challenge.items.workflows.title")}</CardTitle></CardHeader><CardContent>{t("challenge.items.workflows.desc")}</CardContent></Card>
            <Card><CardHeader><CardTitle>{t("challenge.items.insights.title")}</CardTitle></CardHeader><CardContent>{t("challenge.items.insights.desc")}</CardContent></Card>
          </div>
        </div>
      </section>

      <section id="solution" className="section bg-muted/30">
        <SectionTitle eyebrow={t("solution.eyebrow")} title={t("solution.title")} subtitle={t("solution.subtitle")} />
        <div className="container mt-10 grid md:grid-cols-2 gap-6 items-center">
          <Image src="/images/3_The-Solution.webp" alt="TACTEC solution overview" width={1000} height={700} className="rounded-xl shadow-md"  loading="lazy"/>
          <Image src="/images/4_What-is-TacTec.webp" alt="What is TACTEC" width={1000} height={700} className="rounded-xl shadow-md"  loading="lazy"/>
        </div>
      </section>

      <section id="features" className="section">
        <SectionTitle eyebrow={t("features.eyebrow")} title={t("features.title")} subtitle={t("features.subtitle")} />
        <div className="container mt-10 grid md:grid-cols-3 gap-6">
          <Image src="/images/8_Comprehensive-Team-Management.webp" alt="Comprehensive team management" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/7_Tactical-Board-and-Formation-Maker.webp" alt="Tactical board and formation maker" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/9_Medical-Module-and-Wellness-Monitoring.webp" alt="Medical module and wellness monitoring" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/10_Proactive-Health-Management.webp" alt="Proactive health management" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/11_Advanced-Reporting-Systems.webp" alt="Advanced reporting systems" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/12_Integrated-Communication-System.webp" alt="Integrated communication system" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
        </div>
      </section>

      <section id="tech" className="section bg-muted/30">
        <SectionTitle eyebrow={t("tech.eyebrow")} title={t("tech.title")} subtitle={t("tech.subtitle")} />
        <div className="container mt-10 grid md:grid-cols-3 gap-6">
          <Image src="/images/13_Technical-Excellence-Universal-Clean-Architecture.webp" alt="Universal clean architecture diagram" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/14_Revolutionary-Graphics-Engine.webp" alt="Revolutionary graphics engine" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/5_Cross-Platform-Excellence.webp" alt="Cross platform excellence" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
        </div>
      </section>

      <section className="section">
        <div className="container grid md:grid-cols-2 gap-6">
          <Image src="/images/6_Why-Choose-TacTec.webp" alt="Why choose TACTEC" width={1000} height={700} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/18_Getting-Started.webp" alt="Getting started with TACTEC" width={1000} height={700} className="rounded-xl shadow"  loading="lazy"/>
        </div>
      </section>

      <section id="contact" className="section bg-muted/30">
        <SectionTitle eyebrow={t("cta.eyebrow")} title={t("cta.title")} subtitle={t("cta.subtitle")} />
        <div className="container grid md:grid-cols-2 gap-6 items-center">
          <Image src="/images/19_Your-Club-in-your-Hand.webp" alt="Your club in your hand" width={1000} height={700} className="rounded-2xl shadow-lg"  loading="lazy"/>
          <div className="flex flex-col gap-3">
            <Button className="rounded-md" onClick={() => trackEvent('cta_footer_demo',{label:'Request Live Demo'})}>{t("cta.buttons.demo")}</Button>
            <Button variant="outline" className="rounded-md" onClick={() => trackEvent('cta_footer_app',{label:'Try Player App'})}>{t("cta.buttons.app")}</Button>
            <Image src="/images/Tactec-Lock-1-2-1.webp" alt="Security lock TACTEC" width={420} height={300} className="rounded-lg border"  loading="lazy"/>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Gallery" title="TACTEC Visual Library" subtitle="A snapshot of interfaces, devices, and brand assets." />
        <div className="container grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Image src="/images/Surface-Pro-8-1-2.webp" alt="Surface Pro 8 showcase" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/16.webp" alt="TACTEC UI card" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/Tactec-2nd-lockup.webp" alt="TACTEC lockup" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/Client_Offering_Catalog1.webp" alt="Client offering catalog 1" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/Client_Offering_Catalog_final.webp" alt="Client offering catalog final" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/1000286390.webp" alt="Team photo 6390" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/1000286398.webp" alt="Team photo 6398" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
          <Image src="/images/1000286392.webp" alt="Team photo 6392" width={800} height={600} className="rounded-xl shadow"  loading="lazy"/>
        </div>
      </section>

      <footer className="border-t">
        <div className="container py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div><p>{t("footer.about")}</p></div>
          <div><p>{t("footer.product")}</p><p>{t("footer.company")}</p></div>
          <div className="text-end"><p>{t("footer.rights")}</p><p className="text-xs">{t("footer.made")}</p></div>
        </div>
      </footer>
    </div>
  );
}