# Dependency Audit Report

## Overview
- **Date**: 2025-09-30
- **Environment**: Node v22.19.0, npm 11.4.2
- **Scope**: `package.json` dependencies for the Next.js web application.

## Lockfile Generation
A fresh `package-lock.json` was generated with `npm install --package-lock-only` to capture the exact dependency tree for auditing purposes.

## Installed Top-Level Dependencies
The following direct dependencies are present (via `npm ls --depth=0`):

```
├── @hookform/resolvers@3.3.2
├── @testing-library/jest-dom@6.1.0
├── @testing-library/react@14.0.0
├── @types/lru-cache@7.10.10
├── @types/node@20.11.30
├── @types/react-dom@18.2.18
├── @types/react@18.2.66
├── @typescript-eslint/eslint-plugin@7.18.0
├── @typescript-eslint/parser@7.18.0
├── autoprefixer@10.4.19
├── clsx@2.1.0
├── eslint-config-next@14.2.5
├── eslint@8.57.0
├── husky@8.0.3
├── jest-environment-jsdom@29.7.0
├── jest@29.7.0
├── lint-staged@15.5.2
├── lru-cache@10.4.3
├── next-intl@3.16.0
├── next-sitemap@4.2.3
├── next@14.2.5
├── postcss@8.4.47
├── react-dom@18.2.0
├── react-hook-form@7.49.2
├── react@18.2.0
├── tailwindcss@3.4.10
├── typescript@5.4.5
└── zod@3.22.4
```

## Security Audit Attempt
Running `npm audit` failed because the npm security advisory endpoint responded with HTTP 403 (Forbidden). This is likely due to restricted network access in the execution environment. No vulnerability data could be retrieved as a result.

## Outdated Package Check
Similarly, `npm outdated` could not reach the npm registry and returned HTTP 403. Outdated package information is therefore unavailable in this environment.

## Recommended Next Steps
1. Re-run `npm audit` and `npm outdated` in an environment with internet access to obtain current vulnerability and update information.
2. If advisories are reported, prioritize remediation of high and critical severity issues and schedule updates for moderate or low severity findings.
3. Keep the `package-lock.json` committed to ensure reproducible installs and to support future security checks.
