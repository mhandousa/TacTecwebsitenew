import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { SITE_URL } from "@/config/env";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fs from "fs";
import path from "path";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy - TACTEC</title>
        <meta name="description" content="TACTEC Privacy Policy - How we collect, use, and protect your data" />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Privacy Policy - TACTEC" />
        <meta property="og:description" content="Learn how TACTEC collects, uses, and protects your personal data" />
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

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-lg max-w-none dark:prose-invert space-y-8">
              
              <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-xl border border-sky-200 dark:border-sky-800">
                <h2 className="text-2xl font-bold mb-4 text-sky-900 dark:text-sky-100">Summary</h2>
                <p className="text-sky-800 dark:text-sky-200">
                  We respect your privacy and are committed to protecting your personal data. This policy explains what data we collect, 
                  how we use it, and your rights regarding your information.
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Who We Are</h2>
                <p>
                  TACTEC is operated by Ventio, a company dedicated to providing professional football club management solutions. 
                  We are committed to protecting and respecting your privacy.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
                  <p><strong>Data Controller:</strong> Ventio<br />
                  <strong>Contact:</strong> privacy@tactec.club<br />
                  <strong>Website:</strong> <a href="https://tactec.club" className="text-sky-600 hover:underline">tactec.club</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3">Information You Provide to Us</h3>
                <ul className="space-y-2">
                  <li><strong>Contact Information:</strong> Name, email address, club/organization name, and role when you contact us or request a demo</li>
                  <li><strong>Communication Data:</strong> Messages you send us through our contact forms, email, or other communication channels</li>
                  <li><strong>Feedback and Preferences:</strong> Your language preferences, cookie preferences, and any feedback you provide</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Information We Collect Automatically</h3>
                <ul className="space-y-2">
                  <li><strong>Usage Data:</strong> How you interact with our website, pages visited, time spent on pages, click patterns</li>
                  <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, screen resolution, device type</li>
                  <li><strong>Analytics Data:</strong> Via Google Analytics (with your consent) to understand website performance and user behavior</li>
                  <li><strong>Error Data:</strong> Technical error information via Sentry to improve our website's functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p>We use your personal information for the following purposes:</p>
                <ul className="space-y-2 mt-4">
                  <li><strong>Communication:</strong> To respond to your inquiries, provide customer support, and send you information about TACTEC</li>
                  <li><strong>Service Improvement:</strong> To improve our website, services, and user experience based on usage patterns and feedback</li>
                  <li><strong>Marketing:</strong> To send you relevant information about our services (only with your consent)</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our legitimate interests</li>
                  <li><strong>Security:</strong> To protect our website and users from security threats and fraudulent activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing</h2>
                <p>We process your personal information based on the following legal grounds:</p>
                <ul className="space-y-2 mt-4">
                  <li><strong>Consent:</strong> When you provide consent for marketing communications or analytics tracking</li>
                  <li><strong>Legitimate Interest:</strong> For website functionality, security, and business operations</li>
                  <li><strong>Contract Performance:</strong> To fulfill requests for information or services</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Information Sharing and Disclosure</h2>
                <p>We do not sell, rent, or share your personal information with third parties except in the following circumstances:</p>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
                <ul className="space-y-2">
                  <li><strong>Google Analytics:</strong> For website analytics (only with your consent)</li>
                  <li><strong>Sentry:</strong> For error monitoring and website performance</li>
                  <li><strong>Email Services:</strong> For processing contact form submissions</li>
                  <li><strong>Hosting Providers:</strong> For website hosting and data storage</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
                <ul className="space-y-2">
                  <li>When required by law, regulation, or court order</li>
                  <li>To protect our rights, property, or safety, or that of our users</li>
                  <li>In connection with a business transfer, merger, or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar technologies to enhance your browsing experience:</p>
                
                <h3 className="text-xl font-semibold mb-3 mt-4">Types of Cookies We Use</h3>
                <ul className="space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Preference Cookies:</strong> Remember your language and other preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage (Google Analytics - with consent)</li>
                  <li><strong>Performance Cookies:</strong> Improve website speed and functionality</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                  <p><strong>Cookie Control:</strong> You can control cookies through our cookie consent banner and your browser settings. 
                  Note that disabling certain cookies may affect website functionality.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Data Security</h2>
                <p>We implement robust security measures to protect your personal information:</p>
                <ul className="space-y-2 mt-4">
                  <li><strong>Encryption:</strong> All data transmission uses HTTPS encryption</li>
                  <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
                  <li><strong>Regular Updates:</strong> Regular security updates and vulnerability assessments</li>
                  <li><strong>Staff Training:</strong> Regular privacy and security training for our team</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring for security threats and breaches</li>
                </ul>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                  <p><strong>Important:</strong> While we implement strong security measures, no internet transmission is 100% secure. 
                  We cannot guarantee absolute security but commit to following industry best practices.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Your Privacy Rights</h2>
                <p>Depending on your location, you have the following rights regarding your personal information:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Access Rights</h4>
                    <p className="text-sm">Request a copy of the personal information we hold about you</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Correction Rights</h4>
                    <p className="text-sm">Request correction of inaccurate or incomplete information</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Deletion Rights</h4>
                    <p className="text-sm">Request deletion of your personal information</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Portability Rights</h4>
                    <p className="text-sm">Request a copy of your data in a structured format</p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4">
                  <p><strong>How to Exercise Your Rights:</strong> Contact us at privacy@tactec.club or use our contact form. 
                  We'll respond within 30 days and may need to verify your identity.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Data Retention</h2>
                <p>We retain personal information only as long as necessary for the purposes outlined in this policy:</p>
                <ul className="space-y-2 mt-4">
                  <li><strong>Contact Inquiries:</strong> 3 years from last contact</li>
                  <li><strong>Website Analytics:</strong> 26 months (Google Analytics default)</li>
                  <li><strong>Error Logs:</strong> 90 days for troubleshooting</li>
                  <li><strong>Email Communications:</strong> Until you unsubscribe or request deletion</li>
                  <li><strong>Legal Requirements:</strong> As required by applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
                <p>
                  Your personal information may be transferred to and processed in countries outside your country of residence, 
                  including the United States and European Union. We ensure appropriate safeguards are in place for such transfers, including:
                </p>
                <ul className="space-y-2 mt-4">
                  <li>Adequacy decisions by relevant data protection authorities</li>
                  <li>Standard contractual clauses approved by data protection authorities</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
                <p>
                  Our website and services are not intended for children under 16 years of age. We do not knowingly collect 
                  personal information from children under 16. If we become aware that we have collected personal information 
                  from a child under 16, we will delete such information promptly.
                </p>
                <p className="mt-4">
                  If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us immediately at privacy@tactec.club.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update this privacy policy from time to time to reflect changes in our practices, technology, 
                  legal requirements, or other factors. When we make material changes, we will:
                </p>
                <ul className="space-y-2 mt-4">
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Notify you via email if you have provided us with your contact information</li>
                  <li>Display a prominent notice on our website</li>
                  <li>Obtain your consent if required by applicable law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
                <p>If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:</p>
                
                <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-xl mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">General Privacy Inquiries</h4>
                      <p className="text-sm">
                        <strong>Email:</strong> <a href="mailto:privacy@tactec.club" className="text-sky-600 hover:underline">privacy@tactec.club</a><br />
                        <strong>Response Time:</strong> Within 30 days
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                      <p className="text-sm">
                        <strong>Email:</strong> <a href="mailto:dpo@ventio.com" className="text-sky-600 hover:underline">dpo@ventio.com</a><br />
                        <strong>For:</strong> GDPR-related matters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Alternative Contact Methods</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Website Contact Form:</strong> <Link href="/contact" className="text-sky-600 hover:underline">tactec.club/contact</Link></li>
                    <li><strong>General Website:</strong> <a href="https://tactec.club" className="text-sky-600 hover:underline">tactec.club</a></li>
                    <li><strong>Company Website:</strong> <a href="https://ventio.com" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">ventio.com</a></li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Supervisory Authority</h2>
                <p>
                  If you are not satisfied with our response to your privacy concerns, you have the right to lodge a complaint 
                  with your local data protection supervisory authority. Contact details for EU data protection authorities 
                  can be found at <a href="https://edpb.europa.eu/about-edpb/board/members_en" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  edpb.europa.eu</a>.
                </p>
              </section>

            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link 
                href="/"
                className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                ← Back to Home
              </Link>
              
              <Link 
                href="/contact"
                className="inline-block border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
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
          <p className="mt-2 text-sky-400 text-sm">Made with care for football.</p>
        </div>
      </footer>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const filePath = path.join(process.cwd(), "src/locales", locale, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");
  let messages = {};
  
  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }
  
  return { props: { messages } };
}
