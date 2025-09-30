# Codebase Review & Audit Report

## Overview
- **Date**: 2025-02-14
- **Scope**: Static inspection of the checked-in Next.js marketing site (no network access or runtime instrumentation during this review).
- **Repository focus**: Operational readiness of the public contact flow, configuration hygiene, and security posture of shared infrastructure.

## Recognised Strengths
- **Security-forward delivery defaults** – The framework ships with Strict-Transport-Security, frame busting, MIME sniffing protection, and a hardened permissions policy at the edge, raising the baseline for every route without per-page work.【F:next.config.js†L24-L57】
- **Consent-aware telemetry** – Google Analytics is only initialised after the cookie banner reports acceptance, and route change tracking is gated by that consent bit so anonymous visitors are not tracked inadvertently.【F:src/pages/_app.tsx†L18-L107】
- **Rate limiting abstraction** – The Upstash-backed limiter can be swapped for the in-memory implementation transparently, giving operators a single touch point for hardening the contact API as environments mature.【F:src/lib/ratelimit.ts†L62-L153】

## Risk Register
### High Severity
1. **SVG ingestion can bypass HTML sanitisation**  
   `dangerouslyAllowSVG: true` instructs Next Image to proxy arbitrary SVGs, and while a download content disposition is applied, most browsers will still execute embedded scripts if the asset is ever embedded inline by mistake. Unless SVG assets are trusted and pre-sanitised, drop this flag or enforce signature validation before serving.【F:next.config.js†L14-L22】

### Medium Severity
1. **Rate limiter quietly downgrades durability**  
   When the Upstash credentials are absent or misconfigured the limiter reverts to the process-local cache with only a development-time warning, so horizontal scaling or restarts effectively disable throttling. Escalate this to a production boot failure or critical alert so the contact endpoint is never exposed without durable protection.【F:src/lib/ratelimit.ts†L117-L153】
2. **Hard-coded CORS allowlist complicates multi-environment deployments**  
   The contact API whitelists only the production host (plus localhost in development). Staging domains or preview URLs will fail CORS preflights unless code changes are shipped. Externalise the origin list to configuration or derive it from `NEXT_PUBLIC_SITE_URL` to keep builds environment-agnostic.【F:src/pages/api/contact.ts†L93-L142】
3. **Frontend assumes JSON responses from the contact endpoint**  
   The client unconditionally calls `response.json()` before checking `response.ok`. Any upstream 500 that returns HTML or an empty body will throw and skip the tailored fallback messaging. Wrap JSON parsing in a try/catch or guard on the `Content-Type` header so error handling remains reliable.【F:src/pages/contact.tsx†L70-L141】

### Low Severity
1. **Canonical URL defaults can leak development origins**  
   `SITE_URL` falls back to `http://localhost:3000`, so forgetting to set `NEXT_PUBLIC_SITE_URL` in production would quietly ship incorrect canonical/meta tags. Replace the fallback with a build-time failure outside development to avoid SEO regressions.【F:src/config/env.ts†L19-L89】
2. **Contact API success flow lacks return statements**  
   The handler writes a 200 response but allows execution to continue, relying on the function ending naturally. While harmless today, future refactors could append logic that mutates headers post-send. Returning immediately after responding improves readability and guards against this class of bug.【F:src/pages/api/contact.ts†L143-L180】
3. **Analytics helper includes unused event shapes**  
   Scroll depth tracking is exposed but never invoked, hinting at either dead code or missing instrumentation. Periodically prune the analytics surface area or implement the corresponding listeners to keep dashboards and data contracts trustworthy.【F:src/utils/analytics.ts†L1-L64】

## Operational Opportunities
- **Document configuration contracts** – Capture required and optional environment variables (GA, Sentry, Upstash, trusted proxies) in deployment runbooks so the stricter validations recommended above are easy to satisfy.【F:src/config/env.ts†L19-L89】【F:src/pages/api/contact.ts†L41-L142】
- **Add synthetic tests for the contact flow** – A lightweight Jest or Playwright suite covering happy paths, malformed payloads, and rate limit exhaustion would provide quick signal before marketing pushes.【F:package.json†L17-L42】【F:src/pages/api/contact.ts†L93-L180】
- **Expand observability hooks** – Consider emitting structured logs or metrics when the limiter falls back, when submissions succeed, and when errors are captured to power dashboards beyond CloudWatch-style log tailing.【F:src/lib/ratelimit.ts†L117-L153】【F:src/pages/api/contact.ts†L143-L180】【F:src/utils/errorReporting.ts†L17-L88】

## Suggested Next Steps
1. Remove `dangerouslyAllowSVG` (or gate it behind a sanitised asset pipeline) and retest the marketing pages.
2. Promote durable rate limiting to a hard requirement in production and surface configuration issues in deployment health checks.
3. Harden the contact form exchange with defensive JSON parsing and return statements, then backstop the flow with automated API tests.
4. Publish an environment checklist to accompany releases so SEO, analytics, and error-reporting settings are verified ahead of launch.
