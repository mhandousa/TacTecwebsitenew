import Head from "next/head";
import Link from "next/link";
import { SITE_URL } from "@/config/env";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - TACTEC</title>
        <meta
          name="description"
          content="TACTEC Privacy Policy - How we collect, use, and protect your data"
        />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Privacy Policy - TACTEC" />
        <meta
          property="og:description"
          content="Learn how TACTEC collects, uses, and protects your personal data"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sky-600">
            TACTEC
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-sky-600 transition">
              Back to Home
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        id="content"
        tabIndex={-1}
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h1>Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Last Updated:</strong>{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to TACTEC ("we," "our," or "us"). We respect your privacy
              and are committed to protecting your personal data. This privacy
              policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website tactec.club.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <p>
              We collect information that you voluntarily provide to us when
              you:
            </p>
            <ul>
              <li>Fill out contact forms</li>
              <li>Request a demo</li>
              <li>Subscribe to our newsletter</li>
              <li>Communicate with us via email or other channels</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Club/Organization name</li>
              <li>Job title/role</li>
              <li>Phone number</li>
              <li>Message content</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you visit our website, we automatically collect certain
              information about your device, including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring URLs</li>
              <li>Pages viewed and time spent on pages</li>
              <li>Links clicked</li>
              <li>Language preferences</li>
            </ul>

            <h3>2.3 Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent. However, if you do not accept cookies, you may not be
              able to use some portions of our website.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul>
              <li>
                <strong>To provide and maintain our service</strong>
              </li>
              <li>
                <strong>To respond to your inquiries</strong> and provide
                customer support
              </li>
              <li>
                <strong>To send you marketing communications</strong> (with your
                consent)
              </li>
              <li>
                <strong>To improve our website</strong> and user experience
              </li>
              <li>
                <strong>To analyze usage patterns</strong> and optimize our
                services
              </li>
              <li>
                <strong>To detect and prevent fraud</strong> and security issues
              </li>
              <li>
                <strong>To comply with legal obligations</strong>
              </li>
            </ul>

            <h2>4. Google Analytics</h2>
            <p>
              We use Google Analytics to analyze website traffic and usage
              patterns. Google Analytics uses cookies to collect information
              about your use of our website. This information is used to compile
              reports and help us improve our website. The cookies collect
              information in an anonymous form.
            </p>
            <p>
              You can opt-out of Google Analytics by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>

            <h2>5. Legal Basis for Processing (GDPR)</h2>
            <p>
              If you are from the European Economic Area (EEA), our legal basis
              for collecting and using your personal information depends on the
              data and the context in which we collect it:
            </p>
            <ul>
              <li>
                <strong>Consent:</strong> You have given us permission to
                process your data for a specific purpose
              </li>
              <li>
                <strong>Contract:</strong> Processing is necessary for a
                contract with you
              </li>
              <li>
                <strong>Legal obligation:</strong> We need to comply with the
                law
              </li>
              <li>
                <strong>Legitimate interests:</strong> Processing is in our
                legitimate interests and doesn't override your rights
              </li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this privacy policy, unless a
              longer retention period is required or permitted by law. When we
              have no ongoing legitimate business need to process your personal
              information, we will delete or anonymize it.
            </p>

            <h2>7. Data Sharing and Disclosure</h2>
            <p>We may share your information in the following situations:</p>
            <ul>
              <li>
                <strong>With service providers:</strong> Third-party companies
                that help us operate our website (e.g., hosting, analytics,
                email services)
              </li>
              <li>
                <strong>For legal reasons:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a
                merger, acquisition, or sale of assets
              </li>
              <li>
                <strong>With your consent:</strong> When you have given us
                permission to share your information
              </li>
            </ul>
            <p>
              <strong>
                We do not sell your personal information to third parties.
              </strong>
            </p>

            <h2>8. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul>
              <li>
                <strong>Right to access:</strong> Request copies of your
                personal data
              </li>
              <li>
                <strong>Right to rectification:</strong> Request correction of
                inaccurate data
              </li>
              <li>
                <strong>Right to erasure:</strong> Request deletion of your data
              </li>
              <li>
                <strong>Right to restrict processing:</strong> Request
                limitation on how we use your data
              </li>
              <li>
                <strong>Right to data portability:</strong> Request transfer of
                your data to another organization
              </li>
              <li>
                <strong>Right to object:</strong> Object to our processing of
                your data
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> Withdraw consent at
                any time where we relied on consent
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@tactec.club">privacy@tactec.club</a>
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on computers
              located outside of your state, province, country, or other
              governmental jurisdiction where data protection laws may differ.
              We will take all steps reasonably necessary to ensure that your
              data is treated securely and in accordance with this privacy
              policy.
            </p>

            <h2>10. Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>

            <h2>11. Children's Privacy</h2>
            <p>
              Our website is not intended for children under the age of 16. We
              do not knowingly collect personal information from children under
              16. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>

            <h2>12. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to read their privacy policies.
            </p>

            <h2>13. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the "Last Updated" date. You are advised to
              review this privacy policy periodically for any changes.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please
              contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@tactec.club">privacy@tactec.club</a>
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a href="https://tactec.club/contact">
                  https://tactec.club/contact
                </a>
              </li>
            </ul>

            <h2>15. Cookie Policy</h2>

            <h3>15.1 What Are Cookies?</h3>
            <p>
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and understanding how
              you use our site.
            </p>

            <h3>15.2 Types of Cookies We Use</h3>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required for the website to
                function properly
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use our website (Google Analytics)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>

            <h3>15.3 Managing Cookies</h3>
            <p>
              You can control and manage cookies through our cookie consent
              banner or your browser settings. Please note that disabling
              certain cookies may affect the functionality of our website.
            </p>

            <div className="mt-12 p-6 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
              <h3 className="text-sky-900 dark:text-sky-100 mt-0">
                Need More Information?
              </h3>
              <p className="mb-4">
                If you have questions about our privacy practices or want to
                exercise your data rights, we're here to help.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold no-underline transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© Ventio. All rights reserved.</p>
          <p className="mt-2 text-sky-400 text-sm">
            Made with care for football.
          </p>
        </div>
      </footer>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(
    process.cwd(),
    "src/locales",
    locale,
    "common.json",
  );
  const fallbackPath = path.join(
    process.cwd(),
    "src/locales",
    "en",
    "common.json",
  );
  let messages = {};

  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }

  return { props: { messages } };
}
