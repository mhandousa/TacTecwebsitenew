import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GetStaticProps } from "next";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  club: z.string().min(2, "Club name must be at least 2 characters"),
  role: z.string().min(1, "Please select your role"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  requestType: z.enum(["demo", "sales", "support", "general"]),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      requestType: "demo",
    },
  });

  useEffect(() => {
    if (submitStatus !== "idle") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
        setSubmitMessage("");
      }, 8000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [submitStatus]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      trackEvent("form_submit", {
        form_type: "contact",
        request_type: data.requestType,
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          result.message || "Your message has been sent successfully!"
        );
        reset();

        trackEvent("form_submit_success", {
          form_type: "contact",
          request_type: data.requestType,
        });

        trackEvent("demo_request", {
          request_type: data.requestType,
          club: data.club,
        });

        setTimeout(() => {
          document.getElementById("form-status")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email us directly."
      );

      trackEvent("form_submit_error", {
        form_type: "contact",
        request_type: data.requestType,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - TACTEC</title>
        <meta
          name="description"
          content="Get in touch with TACTEC team for demos and inquiries. Transform your football club operations with our professional platform."
        />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta
          property="og:title"
          content="Contact TACTEC - Football Club Management Platform"
        />
        <meta
          property="og:description"
          content="Request a demo or get in touch with our team to learn how TACTEC can transform your club operations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition"
          >
            TACTEC
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-sky-600 transition"
            >
              ← Back to Home
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ready to transform your club? Request a demo or contact our team.
              </p>
            </div>

            {/* Status Message */}
            {submitStatus !== "idle" && (
              <div
                id="form-status"
                className={`mb-8 p-4 rounded-lg ${
                  submitStatus === "success"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Request Type *
                  </label>
                  <select
                    {...register("requestType")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="demo">Request Demo</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Support</option>
                    <option value="general">General Question</option>
                  </select>
                  {errors.requestType && (
                    <p className="mt-1 text-sm text-red-600">{errors.requestType.message}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="john@club.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Club */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Club/Organization *
                  </label>
                  <input
                    type="text"
                    {...register("club")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="FC Example"
                  />
                  {errors.club && (
                    <p className="mt-1 text-sm text-red-600">{errors.club.message}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Role *
                  </label>
                  <input
                    type="text"
                    {...register("role")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Manager, Coach, Director, etc."
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your needs..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a href="mailto:info@tactec.club" className="text-sky-600 hover:underline">
                  info@tactec.club
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-400">Within 24 hours</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <p className="text-gray-600 dark:text-gray-400">8 languages supported</p>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "src/locales", locale || "en", "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");
  let messages = {};

  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }

  return { props: { messages } };
};
