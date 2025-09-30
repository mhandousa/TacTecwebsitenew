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
1. **Durable rate limiting is optional, not enforced** _(resolved)_
   Production now fails fast if `UPSTASH_REDIS_REST_URL` or `_TOKEN` are unset, and the system logs a single degradation warning whenever the durable limiter is unavailable so operators can react to outages. 【F:src/lib/ratelimit.ts†L97-L142】

2. **Structured data risks inaccurate claims** _(resolved)_
   The JSON-LD payload no longer publishes unverifiable pricing or ratings data and now reflects the real canonical host. 【F:src/components/StructuredData.tsx†L1-L63】

3. **Contact form response handling assumes JSON** _(addressed)_
   The frontend now validates the `Content-Type` header and safely guards JSON parsing so unexpected responses no longer crash the submission flow. Keep API responses consistently typed and log anomalies for operational visibility. 【F:src/pages/contact.tsx†L79-L145】

4. **PII governance for contact submissions**  
   Although the API logs only metadata, the comment notes future database/CRM integrations. Define a data-retention policy and ensure any persistence layer redacts or encrypts sensitive fields before shipping. 【F:src/pages/api/contact.ts†L89-L149】

5. **Environment defaults mask misconfiguration** _(resolved)_
   `NEXT_PUBLIC_SITE_URL` must now be present (and properly formatted) in all environments, with an explicit, logged fallback reserved for local development and tests only. 【F:src/config/env.ts†L19-L63】

6. **Analytics event coverage** _(resolved)_
   Scroll-depth analytics are now wired to the landing page with 25/50/75/100% thresholds so the existing GA event is emitted with real visitor behaviour. 【F:src/utils/analytics.ts†L1-L64】【F:src/components/TacTecLanding.tsx†L1-L49】

## Suggested Next Steps
- Add automated API tests around the contact endpoint (including malformed JSON and rate limit exhaustion) to guard regression risk. 【F:src/pages/api/contact.ts†L1-L149】
- Schedule a follow-up privacy review once persistence or analytics expansions are implemented to ensure data handling stays compliant.

