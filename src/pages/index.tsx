import TacTecLanding from "@/components/TacTecLanding";
import fs from "fs";
import path from "path";

export default TacTecLanding;

export async function getStaticProps({ locale }: { locale: string }) {
  const filePath = path.join(process.cwd(), "src/messages", locale, "common.json");
  const fallbackPath = path.join(process.cwd(), "src/messages", "en", "common.json");
  let messages = {};
  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    messages = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  }
  return { props: { messages } };
}