// Update the imports at the top of TacTecLanding.tsx
import { pageview, ANALYTICS_EVENTS } from "@/utils/analytics";
import { SITE_URL } from "@/config/env";

// Then update these lines in the component:

// In Hero section CTA buttons:
<Link href="#demo" legacyBehavior>
  <a
    onClick={() => pageview(ANALYTICS_EVENTS.CTA_START)} // ✅ Use constant
    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
  >
    {t("hero.cta.start")}
  </a>
</Link>
<Link href="#demo" legacyBehavior>
  <a
    onClick={() => pageview(ANALYTICS_EVENTS.CTA_DEMO)} // ✅ Use constant
    className="border border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500 px-6 py-3 rounded-lg font-semibold transition"
  >
    {t("hero.cta.demo")}
  </a>
</Link>

// In CTA section buttons:
<button
  onClick={() => pageview(ANALYTICS_EVENTS.CTA_DEMO_BOTTOM)} // ✅ Use constant
  className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
>
  {t("cta.buttons.demo")}
</button>
<button
  onClick={() => pageview(ANALYTICS_EVENTS.CTA_APP_BOTTOM)} // ✅ Use constant
  className="border-2 border-white hover:bg-white hover:text-sky-600 px-8 py-3 rounded-lg font-semibold transition"
>
  {t("cta.buttons.app")}
</button>

// Update the siteUrl line:
const siteUrl = SITE_URL; // ✅ Use imported constant
