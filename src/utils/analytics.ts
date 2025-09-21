export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, { page_path: url });
  }
};
export const trackEvent = (event: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_TRACKING_ID) {
    window.gtag("event", event, params || {});
  }
};