# Translation Review – November 2023

## Summary
- Ensured every locale file now contains the same key set as the English baseline so runtime lookups no longer fail.
- Added translations for the hero call-to-action "learn" label and structured hero statistic entries across all locales.
- Introduced explicit skip-link copy in every locale to improve accessibility coverage.

## Outstanding Work
While structural parity is restored, many of the newly added sections still contain English fallback copy. Prioritise native-language localisation for the following high-visibility areas:

- `solution.pillars.*` titles and descriptions
- `solution.outcome.*`
- `features.categories.*` and `features.highlights.items.*`
- `tech.pillars.*`
- `metrics.*`
- `testimonials.*`
- `cta.buttons.tour`
- `contact.*` (currently English across most locales)

## Recommended Workflow
1. Share the locale JSON files with native-language reviewers (see `/src/locales/<locale>/common.json`).
2. Track progress by updating this document with completion dates per section.
3. After translation, run `node scripts/check-translation-keys.cjs` (or the inline snippet in this report) to verify key parity before committing.

## Verification Snippet
```
node <<'NODE'
const fs = require('fs');
const path = require('path');
const base = JSON.parse(fs.readFileSync('src/locales/en/common.json','utf8'));
const locales = fs.readdirSync('src/locales').filter((dir) => dir !== 'en');
const flatten = (obj, prefix = []) => {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const next = [...prefix, key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flatten(value, next));
    } else {
      keys.push(next.join('.'));
    }
  }
  return keys;
};
const baseKeys = new Set(flatten(base));
for (const locale of locales) {
  const data = JSON.parse(fs.readFileSync(path.join('src/locales', locale, 'common.json'),'utf8'));
  const keys = new Set(flatten(data));
  const missing = [...baseKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !baseKeys.has(k));
  console.log(locale, 'missing:', missing.length, 'extra:', extra.length);
}
NODE
```
