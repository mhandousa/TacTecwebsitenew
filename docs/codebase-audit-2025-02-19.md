# Codebase Audit – 19 Feb 2025

## Scope & Methodology
- **Approach**: Manual static review of the Next.js marketing site source tree, configuration, and API route logic. No production credentials or runtime instrumentation were used.
- **Focus areas**: security posture of public endpoints, configuration hygiene, data privacy/compliance claims, and operational readiness of the contact workflow.

## Notable Strengths
- **Secure-by-default delivery** – Centralised security headers (HSTS, frame busting, MIME sniffing, permissions policy) are applied to every route via Next.js middleware configuration, elevating the baseline without per-page duplication.【F:next.config.js†L24-L58】
- **Consent-aware analytics bootstrap** – Google Analytics is withheld until the cookie banner reports an accepted state, and route change tracking is conditioned on that consent bit to avoid accidental data capture.【F:src/pages/_app.tsx†L18-L83】【F:src/components/CookieConsent.tsx†L10-L72】
- **Tiered rate-limiting abstraction** – The contact API shares a ratelimiting facade that prefers durable Upstash storage yet gracefully degrades to in-memory throttling when credentials are absent, simplifying future hardening.【F:src/lib/ratelimit.ts†L62-L153】

## Findings
### High Severity
1. **Untrusted SVG rendering remains enabled**  
   `dangerouslyAllowSVG: true` instructs the Next.js image optimiser to proxy arbitrary SVG uploads. Even with an attachment content-disposition, browsers will execute embedded scripts if those SVGs are ever reused inline or served by accident. Unless the asset pipeline guarantees trusted, sanitised SVGs, disable this flag or enforce signature validation before delivery.【F:next.config.js†L13-L22】

### Medium Severity
1. **Rate limiter silently falls back to non-durable storage**  
   When Upstash credentials are misconfigured or missing, the limiter downgrades to a per-process LRU cache after logging only a warning. Horizontal scaling or a single process restart in production would effectively remove throttling. Treat this as a deployment failure (or emit a high-severity alert) so the contact endpoint is never exposed without durable limits.【F:src/lib/ratelimit.ts†L115-L153】
2. **CORS allowlist is hard-coded to production hosts**  
   The contact endpoint only trusts `tactec.club` (plus localhost in development). Staging domains, preview deployments, or regional mirrors will fail preflight checks unless code changes ship with each environment. Externalise the allowlist to configuration (for example via `NEXT_PUBLIC_SITE_URL` or an environment array) to keep builds environment-agnostic.【F:src/pages/api/contact.ts†L93-L142】
3. **Frontend assumes JSON bodies for every API response**  
   The contact form calls `response.json()` before checking `response.ok`. Upstream 500s that return HTML (e.g., proxies or WAFs) will throw inside the JSON parser and bypass the tailored error messaging. Guard on the `Content-Type` header or wrap JSON parsing in a try/catch so the UX remains resilient.【F:src/pages/contact.tsx†L70-L142】
4. **Canonical hosts are frozen to production values**  
   `NEXT_PUBLIC_SITE_URL` defaults to `https://tactec.club` at build time while the runtime validator falls back to `http://localhost:3000`. Forgetting to override either in staging or preview builds will quietly ship incorrect canonical tags and Open Graph metadata. Prefer failing fast when the variable is absent outside local development and avoid hard-coded production domains in `next.config.js`.【F:next.config.js†L99-L102】【F:src/config/env.ts†L19-L59】
5. **Structured data advertises unverifiable ratings**  
   The software schema publishes a hard-coded `aggregateRating` (4.8/50 reviews). Search engines treat fabricated ratings as spam and may penalise the domain. Remove the rating block or only emit it when a verifiable review source backs the numbers.【F:src/components/StructuredData.tsx†L21-L52】

### Low Severity
1. **API success path omits explicit termination**  
   The contact handler writes the 200 response but relies on fallthrough to exit. Future refactors risk mutating headers after the body is sent. Returning immediately after `res.status(200).json(...)` improves clarity and prevents this class of bug.【F:src/pages/api/contact.ts†L143-L180】
2. **Contact analytics emit multiple success events**  
   A successful submission fires both `form_submit_success` and `demo_request`, even when the request type is sales/support/general. Tightening the event taxonomy (or scoping `demo_request` to actual demo requests) will keep downstream dashboards trustworthy.【F:src/pages/contact.tsx†L88-L101】
3. **Cookie consent banner redefines storage keys inline**  
   The banner reuses raw string literals for the consent key and accepted/declined values instead of the shared constants. Aligning on `src/utils/constants.ts` reduces drift if the storage contract ever changes.【F:src/components/CookieConsent.tsx†L20-L59】【F:src/utils/constants.ts†L17-L24】

## Recommended Next Steps
1. Disable SVG passthrough (or enforce sanitisation/signatures) and redeploy the marketing site.
2. Promote durable rate limiting and CORS configuration to mandatory environment checks for production deploys.
3. Harden the contact form exchange with defensive JSON parsing and explicit API returns, then align analytics event naming with actual intents.
4. Replace hard-coded metadata origins and structured data ratings with environment-driven or dynamically sourced values, ensuring staging/preview builds stay SEO compliant.
