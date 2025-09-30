import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { SITE_URL } from "@/config/env";
import { trackEvent } from "@/utils/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BrandLink from "@/components/BrandLink";

const buildContactFormSchema = (translate: (key: string) => string) =>
  z.object({
    name: z.string().min(2, translate("validation.nameMin")),
    email: z.string().email(translate("validation.email")),
    club: z.string().min(2, translate("validation.clubMin")),
    role: z.string().min(1, translate("validation.roleMin")),
    message: z.string().min(10, translate("validation.messageMin")),
    requestType: z.enum(["demo", "sales", "support", "general"]),
  });

type ContactApiResult = {
  success?: boolean;
  message?: unknown;
  error?: unknown;
};

const isContactApiResult = (value: unknown): value is ContactApiResult =>
  typeof value === "object" && value !== null;

export default function ContactPage() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");

  const contactFormSchema = useMemo(() => buildContactFormSchema(t), [t]);
  type ContactFormData = z.infer<typeof contactFormSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
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

      const contentType = response.headers.get("content-type") ?? "";
      let result: unknown = null;

      if (contentType.toLowerCase().includes("application/json")) {
        try {
          result = await response.json();
        } catch (parseError) {
          console.error("Failed to parse contact response JSON:", parseError);
          throw new Error(t("status.error"));
        }
      } else if (!response.ok) {
        throw new Error(t("status.apiDefaults.error"));
      }

      const parsedResult = isContactApiResult(result) ? result : null;
      const apiSuccess = response.ok && (parsedResult === null || parsedResult.success !== false);

      if (apiSuccess) {
        const apiMessage =
          parsedResult && typeof parsedResult.message === "string"
            ? parsedResult.message.trim()
            : "";
        const successMessage =
          apiMessage && apiMessage !== t("status.apiDefaults.success")
            ? apiMessage
            : t("status.success");

        setSubmitStatus("success");
        setSubmitMessage(successMessage);
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
        const apiError =
          parsedResult && typeof parsedResult.error === "string"
            ? parsedResult.error.trim()
            : "";
        const errorMessage =
          apiError && apiError !== t("status.apiDefaults.error")
            ? apiError
            : t("status.error");

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      const caughtMessage =
        error instanceof Error && error.message
          ? error.message
          : "";
      const localizedMessage =
        caughtMessage && caughtMessage !== t("status.apiDefaults.error")
          ? caughtMessage
          : t("status.error");

      setSubmitMessage(localizedMessage);

      trackEvent("form_submit_error", {
        form_type: "contact",
        request_type: data.requestType,
        error:
          error instanceof Error && error.message
            ? error.message
            : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta
          property="og:title"
          content={t("meta.ogTitle")}
        />
        <meta
          property="og:description"
          content={t("meta.ogDescription")}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <BrandLink />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-sky-600 transition"
            >
              {t("nav.back")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main
        id="content"
        tabIndex={-1}
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("header.title")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t("header.subtitle")}
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
                    {t("form.requestType.label")}
                  </label>
                  <select
                    {...register("requestType")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="demo">
                      {t("form.requestType.options.demo")}
                    </option>
                    <option value="sales">
                      {t("form.requestType.options.sales")}
                    </option>
                    <option value="support">
                      {t("form.requestType.options.support")}
                    </option>
                    <option value="general">
                      {t("form.requestType.options.general")}
                    </option>
                  </select>
                  {errors.requestType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.requestType.message}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form.name.label")}
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={t("form.name.placeholder")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form.email.label")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={t("form.email.placeholder")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Club */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form.club.label")}
                  </label>
                  <input
                    type="text"
                    {...register("club")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={t("form.club.placeholder")}
                  />
                  {errors.club && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.club.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form.role.label")}
                  </label>
                  <input
                    type="text"
                    {...register("role")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={t("form.role.placeholder")}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form.message.label")}
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder={t("form.message.placeholder")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
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
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t("form.submit.loading")}
                    </>
                  ) : (
                    t("form.submit.default")
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{t("info.email.label")}</h3>
                <a
                  href="mailto:info@tactec.club"
                  className="text-sky-600 hover:underline"
                >
                  {t("info.email.value")}
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{t("info.response.label")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("info.response.value")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{t("info.languages.label")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("info.languages.value")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">{tFooter("rights")}</p>
          <p className="mt-2 text-sky-400 text-sm">{tFooter("made")}</p>
        </div>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(
    process.cwd(),
    "src/locales",
    locale || "en",
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
};
