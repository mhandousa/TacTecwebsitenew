import TacTecLanding from "@/components/TacTecLanding";
import fs from "fs";
import path from "path";

export default TacTecLanding;

export async function getStaticProps({ locale }: { locale: string }) {
  // ✅ Fixed: Now uses src/locales/ to match _app.tsx
  const filePath = path.join(process.cwd(), "src/locales", locale, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");
  let messages = {};
  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }
  return { props: { messages } };
}
