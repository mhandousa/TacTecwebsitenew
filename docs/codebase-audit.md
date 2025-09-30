# Codebase Review & Audit Report

## Overview
- **Date**: 2025-02-14
- **Scope**: Static inspection of the checked-in Next.js marketing site (no network access or runtime instrumentation during this review).
- **Repository focus**: Operational readiness of the public contact flow, configuration hygiene, and security posture of shared infrastructure.

## Recognised Strengths
- **Hardened edge defaults** – Strict-Transport-Security, frame busting headers, and a locked-down image proxy that now disallows inline SVG execution provide a strong security baseline without per-route tuning.【F:next.config.js†L14-L58】
- **Consent-aware telemetry** – Google Analytics only initialises after the cookie banner records acceptance, and subsequent route tracking remains gated behind that consent flag so anonymous visitors are not followed inadvertently.【F:src/pages/_app.tsx†L18-L109】
- **Fail-closed rate limiting** – Upstash credentials are now required for production boots and runtime failures surface immediately, ensuring the contact API keeps durable throttling in front of spam bursts rather than silently downgrading to memory state.【F:src/lib/ratelimit.ts†L117-L158】
- **Configurable CORS enforcement** – Allowed origins are derived from configuration (including `CONTACT_ALLOWED_ORIGINS` and the primary site URL variants), giving each environment a zero-code pathway to adjust who can call the contact endpoint.【F:src/pages/api/contact.ts†L90-L215】

## Risk Register
### High Severity
- _None observed after the applied remediations._

### Medium Severity
1. **Contact endpoint still lacks human verification**
   The server trusts any client that can reach the API over HTTPS; there is no CAPTCHA, proof-of-work, or honeypot field beyond IP-based throttling. Persistent bots can still cycle IPs or operate below the limit, so layering behavioural or challenge-based protections will reduce spam risk before CRM integrations arrive.【F:src/pages/api/contact.ts†L173-L215】

### Low Severity
1. **Environment contracts need documentation**
   The stricter runtime checks and origin derivation lean on env vars such as `NEXT_PUBLIC_SITE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CONTACT_ALLOWED_ORIGINS`. Missing runbook guidance could stall deployments or lead to emergency reconfigurations when boot validation starts failing.【F:src/config/env.ts†L19-L89】【F:src/pages/api/contact.ts†L104-L142】
2. **Error telemetry remains best-effort**
   Errors are logged and optionally forwarded to a custom endpoint, but without mandatory destinations or structured production logging the signal will stay console-bound. Establishing a required sink (Sentry or similar) keeps incident response timely.【F:src/utils/errorReporting.ts†L17-L88】

## Operational Opportunities
- **Capture configuration runbooks** – Enumerate required environment variables (GA, Sentry/error endpoints, Upstash credentials, trusted proxies, and `CONTACT_ALLOWED_ORIGINS`) so teams know which knobs must be set per environment.【F:src/config/env.ts†L19-L89】【F:src/pages/api/contact.ts†L104-L215】
- **Automate the contact flow checks** – A small Playwright or integration suite that exercises happy paths, schema validation failures, rate-limit exhaustion, and CORS preflights would guard regressions before marketing pushes.【F:package.json†L17-L42】【F:src/pages/api/contact.ts†L144-L215】
- **Broaden observability** – Emit structured logs or metrics when the limiter fails, when submissions succeed, and when error reports are captured to move beyond console scraping for operational awareness.【F:src/lib/ratelimit.ts†L117-L158】【F:src/pages/api/contact.ts†L192-L215】【F:src/utils/errorReporting.ts†L17-L88】

## Suggested Next Steps
1. Introduce a human verification layer (CAPTCHA, honeypot, or rate-limit-backed challenge) ahead of wiring the form into downstream systems.【F:src/pages/api/contact.ts†L173-L215】
2. Stand up automated tests that cover the full contact submission lifecycle, including CORS checks and rate-limit boundaries.【F:src/pages/api/contact.ts†L144-L215】
3. Publish and maintain environment setup guides reflecting the new required variables and monitoring expectations.【F:src/config/env.ts†L19-L89】【F:src/pages/api/contact.ts†L104-L142】
