# TACTEC Marketing Site – Text Wireframe

This document captures a text-first wireframe for the refreshed TACTEC marketing homepage. It clarifies the narrative flow, key UI elements, and supporting content that will guide subsequent visual design and implementation.

---

## 1. Global Header (Sticky)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [TACTEC Logo]     Platform  Features  Pricing  Resources  Contact   |  EN ▾  │
│                                                       [Get Started] [Login]  │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Behaviour:** Sticky on scroll with subtle shadow. Language menu reveals available locales with availability status. Primary CTA (Get Started) uses brand accent colour; secondary Login is outlined.
* **Responsive:** Navigation condenses into a hamburger menu on tablet/mobile, preserving Get Started as a persistent CTA.

---

## 2. Hero (Above the Fold)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Headline: “Revolutionising Football Club Management.”                         │
│ Subhead: “Unify tactics, wellness, and operations in a single operating       │
│          system built for modern clubs.”                                      │
│                                                                              │
│ [▶ Watch 60s Demo]   [Request Live Demo]                                      │
│                                                                              │
│ Right rail: looping product hero (tactical board animation layered over      │
│            dashboard screenshot).                                            │
│ Supporting badges: “Trusted by 120+ clubs”, “UEFA compliant workflows”.       │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Goal:** Communicate value within first screen, offer low-friction (Watch demo) and high-intent (Request demo) actions.
* **Motion:** Light parallax of pitch lines; CTA hover reveals gradient fills.

---

## 3. Pain → Solution Narrative

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Column A (Challenges)                                                         │
│  • Fragmented tools across coaching, medical, and analytics.                  │
│  • Manual reporting steals hours every week.                                  │
│  • Communication silos create costly errors.                                  │
│                                                                              │
│ Column B (TACTEC OS)                                                          │
│  • Unified workspace with shared context.                                     │
│  • Automated reporting & proactive alerts.                                    │
│  • Role-based views align every department.                                   │
│                                                                              │
│ Visual: before/after illustrations transitioning from clutter to order.       │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Copy:** Short paragraph bridging problem to solution, closing with CTA link “See the platform in action →”.

---

## 4. Product Pillars (Feature Grid)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Card 1] Tactical Boards                                                       │
│  • Drag-and-drop plays, real-time sync with players.                          │
│  • Screenshot: interactive pitch diagram.                                     │
│                                                                              │
│ [Card 2] Medical & Wellness                                                    │
│  • Injury tracking, wellness surveys, alerts.                                 │
│  • Screenshot: wellness dashboard heatmap.                                    │
│                                                                              │
│ [Card 3] Analytics & Insights                                                  │
│  • Auto-generated match & training reports.                                   │
│  • Screenshot: KPI trends with filters.                                       │
│                                                                              │
│ [Card 4] Operations                                                            │
│  • Scheduling, attendance, and compliance logs.                               │
│  • Screenshot: calendar with session status pills.                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Layout:** Two-by-two grid on desktop; carousel on mobile with swipe gestures.
* **Microcopy:** Each card closes with a secondary link: “Explore Tactical Boards →”.

---

## 5. Proof & Outcomes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Section header: “Trusted by elite clubs & academies worldwide.”               │
│ Row of 6 partner logos (auto-scrolling on mobile).                             │
│                                                                              │
│ Testimonial slider (3 cards):                                                  │
│  • Quote, name, role, club crest.                                             │
│  • Highlight key metrics (e.g., “12 hours saved weekly”).                      │
│                                                                              │
│ Data ribbon:                                                                  │
│  • 98% coach adoption   |   24/7 medical visibility   |   3.5× faster reports │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Interaction:** Auto-play carousel pauses on hover/focus; accessible controls provided.

---

## 6. Pricing Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Heading: “Choose the right plan for your club.”                               │
│                                                                              │
│ [Starter]          [Pro – highlighted]         [Enterprise]                   │
│  $99/mo            $249/mo                     Custom pricing                 │
│  • Up to 50 players• Unlimited players         • Tailored onboarding          │
│  • Tactical boards • Full wellness suite       • API & integrations           │
│  • Standard support• Advanced analytics        • Dedicated success team       │
│  [Start Free Trial][Book Consultation]         [Contact Sales]                │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Notes:** Pro card elevated with brand background. FAQ accordion sits beneath plans covering billing, onboarding, integrations.

---

## 7. Closing CTA & Resources

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Headline: “Ready to transform match preparation?”                              │
│ Subhead: “See how TACTEC centralises performance, wellness, and operations.”   │
│                                                                              │
│ [Request a Live Demo]  [Talk to an Expert]                                     │
│                                                                              │
│ Secondary strip: link cards to case studies, product updates, help centre.     │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Supportive content:** Contact email, phone, and office locations appear in footer along with compliance links (Privacy, Terms, Cookies).

---

## 8. Footer

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Product       Company        Resources        Legal                            │
│ Platform      About          Help Centre      Privacy Policy                   │
│ Features      Careers        Blog             Terms of Use                     │
│ Pricing       Press          Status           Cookies                          │
│                                                                              │
│ Social icons (LinkedIn, Twitter, YouTube).                                    │
│ Newsletter signup with inline success feedback.                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. Validate the narrative with stakeholders (product, sales, customer success).
2. Translate the wireframe into low-fidelity visuals (Figma or similar) to explore spacing, typography, and colour.
3. Prepare component inventory for implementation, mapping sections to existing or new React/Tailwind components.
4. Align localisation requirements to ensure new strings are captured in translation files.

This wireframe balances storytelling with conversion clarity, ensuring each section communicates value while guiding visitors toward demo requests and product exploration.
