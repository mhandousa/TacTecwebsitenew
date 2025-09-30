# Codebase Review & Audit Report

## Overview
- **Date**: 2025-10-27
- **Environment**: Static review of the checked-in sources (no network access, tests not executed).
- **Scope**: High-level architecture, security posture, data privacy handling, and maintainability of the Next.js marketing site.

## Application Architecture Snapshot
- The site is implemented with Next.js 14, React 18, next-intl for localisation, and Tailwind CSS for styling, as defined in `package.json`. 【F:package.json†L1-L78】
- Global app composition lives in `src/pages/_app.tsx`, where translations, the error boundary, and cookie consent are wired together. 【F:src/pages/_app.tsx†L1-L91】
- Core landing experience and associated UI primitives are delivered through `TacTecLanding` and supporting components in `src/components`. 【F:src/components/TacTecLanding.tsx†L1-L120】
- Contact workflows are handled via a Next.js API route backed by an in-memory or Upstash-powered rate limiter. 【F:src/pages/api/contact.ts†L1-L120】【F:src/lib/ratelimit.ts†L1-L120】

## Notable Strengths
1. **Consent-aware analytics loading** – Google Analytics only boots after a user explicitly accepts the cookie banner, and route change tracking is disabled without consent. 【F:src/pages/_app.tsx†L12-L73】【F:src/components/CookieConsent.tsx†L1-L76】
2. **Runtime environment validation** – `src/config/env.ts` enforces URL formats and highlights missing production configuration early in the boot process. 【F:src/config/env.ts†L1-L68】
3. **Defensive analytics helpers** – `src/utils/analytics.ts` guards all gtag calls behind runtime checks and typed event payloads to prevent noisy errors when analytics is unavailable. 【F:src/utils/analytics.ts†L1-L64】
4. **Rate limiting abstraction** – The contact endpoint can seamlessly upgrade from an in-memory limiter to an Upstash Redis-backed implementation without code changes. 【F:src/lib/ratelimit.ts†L1-L120】

## Findings & Recommendations
1. **Durable rate limiting is optional, not enforced**  
   When `UPSTASH_REDIS_REST_URL`/`_TOKEN` are missing, the API quietly falls back to an in-memory limiter that resets on process restart, which is insufficient for production traffic or multi-instance deployments. Promote configuration failures to hard errors (or at least critical logs) outside development, and add observability around limiter downgrades. 【F:src/lib/ratelimit.ts†L69-L118】

2. **Structured data risks inaccurate claims**  
   The JSON-LD schema advertises a perfect "price" of 0 USD and a 4.8/50 review aggregate without a backend source of truth. Search engines typically require verifiable ratings; consider removing or dynamically sourcing this metadata to avoid manual penalties. 【F:src/components/StructuredData.tsx†L1-L56】

3. **Contact form response handling assumes JSON**  
   The frontend blindly calls `response.json()` even on error branches, so a non-JSON upstream response would trigger an unhandled exception before the catch block runs. Wrap parsing in a try/catch or gate it behind a `Content-Type` check for resilience. 【F:src/pages/contact.tsx†L42-L109】

4. **PII governance for contact submissions**  
   Although the API logs only metadata, the comment notes future database/CRM integrations. Define a data-retention policy and ensure any persistence layer redacts or encrypts sensitive fields before shipping. 【F:src/pages/api/contact.ts†L89-L149】

5. **Environment defaults mask misconfiguration**  
   Falling back to `http://localhost:3000` for `SITE_URL` keeps builds green but can ship incorrect canonical links in production if the variable is omitted. Fail fast for missing `NEXT_PUBLIC_SITE_URL` regardless of environment, or gate the fallback behind explicit development checks. 【F:src/config/env.ts†L41-L67】

6. **Analytics event coverage**  
   CTA/button clicks are tracked, but long-form scroll or section visibility metrics rely on `trackScrollDepth` without any caller in the repo. Audit analytics requirements to avoid silent gaps or dead code. 【F:src/utils/analytics.ts†L1-L64】【F:src/components/TacTecLanding.tsx†L1-L120】

## Suggested Next Steps
- Add automated API tests around the contact endpoint (including malformed JSON and rate limit exhaustion) to guard regression risk. 【F:src/pages/api/contact.ts†L1-L149】
- Document required environment variables and recommended operational settings alongside deployment runbooks so misconfiguration is caught before release. 【F:src/config/env.ts†L1-L67】
- Schedule a follow-up privacy review once persistence or analytics expansions are implemented to ensure data handling stays compliant.

