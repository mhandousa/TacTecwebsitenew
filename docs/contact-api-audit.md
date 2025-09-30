# Contact API Security & Resilience Audit

## Overview
- **Date**: 2025-09-30
- **Scope**: `/src/pages/api/contact.ts` handler and `/src/lib/ratelimit.ts`
- **Objective**: Evaluate and harden the contact form backend against spoofed traffic metadata, misconfigured CORS, and rate limiter outages.

## Key Improvements Implemented
1. **Trusted proxy hygiene**
   - Normalised IP parsing now strips IPv6 zone identifiers, brackets, ports, and IPv4-mapped prefixes before validation.
   - Invalid `TRUSTED_PROXY_IPS` entries are ignored with a single runtime warning so misconfigurations surface early.
   - Forwarded client IP detection now considers `Forwarded`, `CF-Connecting-IP`, and related headers while still requiring the hop IP to be trusted.

2. **CORS allowlist governance**
   - Centralised allowlist assembly supports a comma-separated `CONTACT_API_ALLOWED_ORIGINS` environment variable with URL validation.
   - All comparisons are case-insensitive, ensuring browsers receive the exact origin they presented without opening the API to wildcard origins.
   - Local development origins are auto-added outside production, avoiding manual edits.

3. **Durable rate limiting safeguards**
   - Upstash HTTP requests use a 5 second abort timeout, preventing long-lived hangs that could cascade into unbounded connection pools before falling back to the in-memory limiter.

## Residual Risks & Recommendations
- **Infrastructure IP ranges**: The allowlist still expects discrete IP addresses. If deploying behind providers that advertise CIDR ranges (e.g. Cloudflare), script-driven environment management will be needed to keep the list current.
- **Monitoring coverage**: Add metrics for rate limiter fallback counts and repeated 429 responses to catch configuration drift.
- **Data retention**: Confirm log retention policies for the anonymised submission metadata to meet regional compliance obligations.

## Verification
- `npm run type-check`
- Manual review of request header parsing and CORS responses via unit-less inspection (no automated tests available for these code paths yet).
