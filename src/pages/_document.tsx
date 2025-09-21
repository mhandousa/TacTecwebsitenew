import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

type Props = { locale: string };

export default function MyDocument({ locale }: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <Html lang={locale || "en"} dir={dir}>
      <Head>
        <meta name="description" content="TACTEC is a professional operating system for football clubs. Unifying tactical, medical, and operational workflows into one platform." />
        <meta property="og:site_name" content="TACTEC" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta property="og:description" content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs." />
        <meta property="og:url" content="https://tactec.club/" />
        <meta property="og:image" content="https://tactec.club/images/1_TacTec-Revolutionising-Football-Club-Management.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TACTEC – Revolutionising Football Club Management" />
        <meta name="twitter:description" content="Unifying tactical, medical, and operational workflows into one professional platform for football clubs." />
        <meta name="twitter:image" content="https://tactec.club/images/1_TacTec-Revolutionising-Football-Club-Management.webp" />
        </Head>
      <body>
        <a className="skip-to-content" href="#content">Skip to content</a>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  // @ts-ignore next adds locale on ctx
  const locale = (ctx as any).locale || "en";
  return { ...initialProps, locale } as any;
};