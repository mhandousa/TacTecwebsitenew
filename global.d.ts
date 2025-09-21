export {};
declare global {
  interface Window {
    gtag: (command: 'config'|'set'|'event'|'consent', targetIdOrEventName: string, params?: Record<string, any>) => void;
    dataLayer: any[];
  }
}