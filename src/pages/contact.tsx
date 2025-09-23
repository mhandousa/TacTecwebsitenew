import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
  const [submitMessage, setSubmitMessage] = useState('');

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

  // Auto-clear messages after delay
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // Track form submission attempt
      trackEvent('form_submit', {
        form_type: 'contact',
        request_type: data.requestType,
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Your message has been sent successfully!');
        reset();

        // Track successful submission
        trackEvent('form_submit_success', {
          form_type: 'contact',
          request_type: data.requestType,
        });

        // Track as conversion
        trackEvent('demo_request', {
          request_type: data.requestType,
          club: data.club,
        });

        // Scroll to success message
        setTimeout(() => {
          document.getElementById('form-status')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);

      } else {
        throw new Error(result.error || 'Failed to send message');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again or email us directly.'
      );

      // Track error
      trackEvent('form_submit_error', {
        form_type: 'contact',
        request_type: data.requestType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - TACTEC</title>
        <meta name="description" content="Get in touch with TACTEC team for demos and inquiries. Transform your football club operations with our professional platform." />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact TACTEC - Football Club Management Platform" />
        <meta property="og:description" content="Request a demo or get in touch with our team to learn how TACTEC can transform your club operations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition">
            TACTEC
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-sky-600 transition">
              ← Back to Home
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Interested in TACTEC? We'd love to show you how our platform can transform your club operations 
                and unify your tactical, medical, and performance workflows.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600">
                      ✉️
                    </span>
                    Send us a message
                  </h2>

                  {/* Status Messages */}
                  <div id="form-status">
                    {submitStatus === 'success' && (
                      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg success-message">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-green-800 dark:text-green-200 font-medium">Message sent successfully! 🎉</p>
                            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                              {submitMessage || 'Thank you for your interest in TACTEC. We will get back to you within 24 hours.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg error-message">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <p className="text-red-800 dark:text-red-200 font-medium">Unable to send message</p>
                            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                              {submitMessage} {!submitMessage.includes('email') && (
                                <>Please try again or email us directly at{' '}
                                <a href="mailto:info@tactec.club" className="underline hover:no-underline font-medium">
                                  info@tactec.club
                                </a></>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Request Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        What can we help you with? <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('requestType')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      >
                        <option value="demo">Request a Live Demo</option>
                        <option value="sales">Sales & Pricing Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="John Smith"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="john@club.com"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Club */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Club/Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('club')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="Your Football Club"
                        />
                        {errors.club && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.club.message}
                          </p>
                        )}
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Your Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('role')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="e.g., Head Coach, Medical Director"
                        />
                        {errors.role && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.role.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none transition-colors"
                        placeholder="Tell us about your club's needs, current challenges, or specific questions about TACTEC..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed scale-[0.98]' 
                          : 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                      } focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`}
                    >
                      <div className="flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Send Message</span>
                          </>
                        )}
                      </div>
                    </button>
                  </form>

                  {/* Form Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      🔒 Your information is secure and will only be used to respond to your inquiry.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>📞</span> Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                        📧
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
                        <a href="mailto:info@tactec.club" className="text-sky-600 hover:text-sky-700 transition">
                          info@tactec.club
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                        🌐
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Company Website</p>
                        <a href="https://ventio.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 transition">
                          ventio.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                        ⏰
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Business Hours</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Monday - Friday<br />
                          9:00 AM - 6:00 PM (UTC)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-sky-100 dark:border-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Quick Response</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        We typically respond to all inquiries within <strong>24 hours</strong> during business days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-green-100 dark:border-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Demo Available</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Request a <strong>live demo</strong> to see how TACTEC can transform your club operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-2xl">⚽</span>
            <span className="text-white font-semibold">TACTEC</span>
          </div>
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
