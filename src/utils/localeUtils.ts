import { GetStaticPropsContext } from 'next';

// Default fallback messages to prevent build failures
const getDefaultMessages = () => ({
  nav: {
    club_os: "Club OS",
    challenge: "Challenge",
    solution: "Solution",
    features: "Features",
    tech: "Technology",
    pricing: "Pricing",
    contact: "Contact",
    signin: "Sign In"
  },
  hero: {
    trusted: "Trusted by clubs and staff",
    title: "Revolutionising",
    title_highlight: "Football Club Management",
    subtitle: "TACTEC unifies sport science, medical, tactical and operations into one clean platform for every department.",
    cta: {
      start: "Get Started",
      demo: "Request Demo"
    },
    stats: {
      injury: "Fewer soft tissue injuries",
      sync: "Faster data sync"
    }
  },
  challenge: {
    eyebrow: "The Challenge",
    title: "Fragmented Football Operations Slow Clubs Down",
    subtitle: "Data is scattered. Workflows are manual. Insights arrive late.",
    items: {
      staff: {
        title: "Staff Alignment",
        desc: "Medical, coaching, and analytics teams work in silos with duplicated efforts."
      },
      workflows: {
        title: "Manual Workflows",
        desc: "Reporting, planning, and communication spread across multiple tools and spreadsheets."
      },
      insights: {
        title: "Slow Insights",
        desc: "Decisions rely on delayed or incomplete information."
      }
    }
  },
  solution: {
    eyebrow: "The Solution",
    title: "One Operating System for Your Club",
    subtitle: "Bring people, processes, and performance together with TACTEC."
  },
  features: {
    eyebrow: "Core Features",
    title: "Everything Your Staff Needs",
    subtitle: "Team management, tactical boards, wellness & medical, reporting and more."
  },
  tech: {
    eyebrow: "Technology",
    title: "Clean Architecture. Cross-Platform. Fast.",
    subtitle: "Modern stack, universal design, and a powerful graphics engine."
  },
  cta: {
    eyebrow: "Next Step",
    title: "See TACTEC in Action",
    subtitle: "Request a live demo or try the player app.",
    buttons: {
      demo: "Request Live Demo",
      app: "Try Player App"
    }
  },
  footer: {
    about: "TACTEC by Ventio. Built for professional clubs and academies.",
    product: "Product: TACTEC",
    company: "Company: Ventio",
    rights: "© Ventio. All rights reserved.",
    made: "Made with care for football."
  },
  faq: {
    q1: "What is TACTEC?",
    a1: "TACTEC is a unified operating system for football clubs covering medical, tactical, performance, and operations.",
    q2: "Is TACTEC multilingual?",
    a2: "Yes. The interface supports Arabic, Portuguese (EU), Brazilian Portuguese, Spanish, French, Italian, German, and English.",
    q3: "How do we get started?",
    a3: "Contact us for a live demo and onboarding plan."
  }
});

/**
 * Load locale messages with proper error handling and fallbacks
 */
export async function loadLocaleMessages(context: GetStaticPropsContext) {
  try {
    const fs = await import("fs");
    const path = await import("path");

    const locale = context.locale || "en";
    const filePath = path.join(process.cwd(), "src/locales", locale, "common.json");
    const fallbackPath = path.join(process.cwd(), "src/locales", "en", "common.json");

    let messages = {};

    try {
      // Try to load the requested locale
      const fileContent = fs.readFileSync(filePath, "utf-8");
      messages = JSON.parse(fileContent);
      
      // Validate that messages is a valid object
      if (!messages || typeof messages !== 'object' || Array.isArray(messages)) {
        throw new Error(`Invalid messages format for locale ${locale}`);
      }
      
      console.log(`✅ Successfully loaded messages for locale: ${locale}`);
    } catch (localeError) {
      const localeErrorMessage =
        localeError instanceof Error ? localeError.message : String(localeError);
      console.warn(`⚠️ Failed to load locale ${locale}:`, localeErrorMessage);
      
      try {
        // Fall back to English
        const fallbackContent = fs.readFileSync(fallbackPath, "utf-8");
        messages = JSON.parse(fallbackContent);
        
        if (!messages || typeof messages !== 'object' || Array.isArray(messages)) {
          throw new Error('Invalid English fallback messages format');
        }
        
        console.log(`✅ Loaded English fallback for locale: ${locale}`);
      } catch (fallbackError) {
        const fallbackErrorMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);
        console.error("❌ Failed to load English fallback:", fallbackErrorMessage);
        
        // Use hardcoded default messages
        messages = getDefaultMessages();
        console.log(`✅ Using default messages for locale: ${locale}`);
      }
    }

    return {
      props: {
        messages,
        locale,
      },
    };
  } catch (criticalError) {
    console.error("❌ Critical error loading locale messages:", criticalError);
    
    // Return absolute minimum to prevent build failure
    return {
      props: {
        messages: getDefaultMessages(),
        locale: context.locale || "en",
      },
    };
  }
}
