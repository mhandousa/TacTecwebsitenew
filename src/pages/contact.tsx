import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GetStaticProps } from "next";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ✅ Removed fs/path imports from top

// Form validation schema
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
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

  // Auto-clear messages after delay
  useEffect(() => {
    if (submitStatus !== "idle") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
        setSubmitMessage("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      // Track form submission attempt
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

        // Track success
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

      {/* Page Content (same as before)… */}
      {/* Keep your form + sidebar + footer unchanged */}
    </>
  );
}

// ✅ FIXED: Correct Next.js getStaticProps signature
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "src/locales", locale || "en", "common.json");
  const fallbackPath = path.join(
    process.cwd(),
    "src/locales",
    "en",
    "common.json"
  );
  let messages = {};

  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }

  return { props: { messages } };
};
