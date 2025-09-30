#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const localesDir = path.join(process.cwd(), "src", "locales");
const baseLocale = "en";
const base = JSON.parse(
  fs.readFileSync(path.join(localesDir, baseLocale, "common.json"), "utf8")
);

const flatten = (obj, prefix = []) => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = [...prefix, key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flatten(value, next);
    }
    return next.join(".");
  });
};

const baseKeys = new Set(flatten(base));

fs.readdirSync(localesDir)
  .filter((dir) => dir !== baseLocale)
  .forEach((locale) => {
    const data = JSON.parse(
      fs.readFileSync(path.join(localesDir, locale, "common.json"), "utf8")
    );
    const keys = new Set(flatten(data));
    const missing = [...baseKeys].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !baseKeys.has(key));

    console.log(`Locale: ${locale}`);
    console.log(`  Missing keys: ${missing.length}`);
    if (missing.length) {
      missing.slice(0, 10).forEach((key) => console.log(`    - ${key}`));
    }
    console.log(`  Extra keys: ${extra.length}`);
    if (extra.length) {
      extra.slice(0, 10).forEach((key) => console.log(`    - ${key}`));
    }
    console.log("");
  });
