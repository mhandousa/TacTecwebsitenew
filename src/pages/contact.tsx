import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fs from "fs";
import path from "path";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  club: z.string().min(2, "Club name must be at least 2 characters"),
  role: z.string().min(1, "Please select your role"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  requestType: z.enum(['demo', 'sales', 'support', 'general']),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const router = useRouter();
  const { locale } = router;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      requestType: 'demo',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Track form submission
      trackEvent('form_submit', {
        form_type: 'contact',
        request_type: data.requestType,
      });

      // In production, send to your backend API
      // For now, we'll use a mailto fallback
      const subject = `TACTEC ${data.requestType.charAt(0).toUpperCase() + data.requestType.slice(1)} Request`;
      const body = `
Name: ${data.name}
Email: ${data.email}
Club: ${data.club}
Role: ${data.role}

Message:
${data.message}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:info@tactec.club?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      setSubmitStatus('success');
      reset();

      // Track conversion
      trackEvent('demo_request', {
        request_type: data.requestType,
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - TACTEC</title>
        <meta name="description" content="Get in touch with TACTEC team for demos and inquiries" />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              Interested in TACTEC? We'd love to show you how it can transform your club operations.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      ✅ Thank you! Your message has been sent. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      ❌ Something went wrong. Please try again or email us directly at info@tactec.club
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What can we help you with? <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('requestType')}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="demo">Request a Demo</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="john@club.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Club */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Club/Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('club')}
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Your Football Club"
                    />
                    {errors.club && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.club.message}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('role')}
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="e.g., Head Coach, Medical Director"
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your needs..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        📧
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <a href="mailto:info@tactec.club" className="text-sky-600 hover:underline">
                          info@tactec.club
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        🌐
                      </div>
                      <div>
                        <p className="font-semibold">Website</p>
                        <a href="https://ventio.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                          ventio.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                        ⏰
                      </div>
                      <div>
                        <p className="font-semibold">Business Hours</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Monday - Friday<br />
                          9:00 AM - 6:00 PM (UTC)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50 dark:bg-gray-800 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Quick Response</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
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
