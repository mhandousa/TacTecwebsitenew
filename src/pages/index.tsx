import TacTecLanding from "@/components/TacTecLanding";
import { GetStaticProps } from "next";

// ✅ Removed fs/path from top-level imports

export default TacTecLanding;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Import Node modules only at build-time (server only)
  const fs = await import("fs");
  const path = await import("path");

  const localeToUse = locale || "en";

  // Path to locale files
  const filePath = path.join(process.cwd(), "src/locales", localeToUse, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");

  let messages = {};

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    messages = JSON.parse(fileContent);
  } catch (error) {
    // If locale file doesn't exist, fall back to English
    try {
      const fallbackContent = fs.readFileSync(fallbackPath, "utf-8");
      messages = JSON.parse(fallbackContent);
      console.warn(`Locale ${localeToUse} not found, using English fallback`);
    } catch (fallbackError) {
      console.error("Failed to load any locale files:", fallbackError);
      messages = {};
    }
  }

  return {
    props: {
      messages,
    },
  };
};
