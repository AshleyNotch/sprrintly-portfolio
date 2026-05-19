export type StackItem = { name: string; color: string };

export type Project = {
  id: string;
  title: string;
  client: string;
  year: number;
  category: string;
  summary: string;
  overview: string;
  challenge: string;
  liveUrl: string;
  color: string;
  accent: string;
  tags: string[];
  duration: string;
  role: string;
  deliverables: string;
  stack: StackItem[];
  quote: string;
  author: string;
  role_author: string;
  mockType: string;
};

export const CATEGORIES = [
  "All",
  "Web Design",
  "UI/UX",
  "Branding",
  "Pitch Deck",
  "Motion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const projects: Project[] = [
  {
    id: "harmonic",
    title: "Harmonic",
    client: "Harmonic Wellness",
    year: 2025,
    category: "Branding",
    summary: "A timeless brand identity for a wellness studio rooted in mindful design.",
    overview:
      "Harmonic approached us looking to express their slow, intentional approach to wellness through every brand touchpoint — from a primary mark that felt grounded and modern, to a complete visual system across packaging, signage, and digital.",
    challenge:
      "The founders had a clear philosophy but no visual language. Existing wellness brands felt either clinical or overly spiritual — we needed a middle path: warm, premium, and unmistakably modern without leaning on trend-driven typography or motifs that would age out within a year.",
    liveUrl: "https://sprrintly.io/",
    color: "#E8DFD0",
    accent: "#3A3A38",
    tags: ["Brand Identity", "Logo Design", "Print", "Packaging"],
    duration: "6 weeks",
    role: "Design Lead",
    deliverables: "40+ assets",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Illustrator", color: "#FF9A00" },
      { name: "Photoshop", color: "#31A8FF" },
      { name: "InDesign", color: "#FF3366" },
    ],
    quote:
      "Ashley really took the time to understand our brand and created a beautiful, timeless logo and identity that we absolutely love. It feels premium and intentional.",
    author: "Siyara E.",
    role_author: "Founder, Harmonic — New Zealand",
    mockType: "logo",
  },
  {
    id: "donely",
    title: "Donely AI",
    client: "Donely",
    year: 2026,
    category: "UI/UX",
    summary: "Product design for an AI-native task platform that reasons about your roadmap.",
    overview:
      "As founding product designer, the brief was to design every surface of Donely from the ground up — auth, the conversational planning canvas, project workspaces, and the agent settings layer. The product had to feel as fast as the underlying model and as warm as a notes app.",
    challenge:
      "AI products tend to drown the user in capability — long chat threads, dense settings, opaque agent state. We compressed all of it into a single, focused canvas where conversation, plan, and execution share the same visual rhythm.",
    liveUrl: "https://sprrintly.io/",
    color: "#0A0A0A",
    accent: "#A8FF60",
    tags: ["UI/UX", "Product Design", "Design System"],
    duration: "8 months",
    role: "Founding Designer",
    deliverables: "Full product suite",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Framer", color: "#0055FF" },
      { name: "Linear", color: "#5E6AD2" },
      { name: "Notion", color: "#000" },
    ],
    quote:
      "Design was on point. They captured our AI brand’s vibe perfectly and built a site that’s lightning fast. Couldn’t be happier.",
    author: "Chamaru A.",
    role_author: "CTO, Donely — USA",
    mockType: "app-dark",
  },
  {
    id: "motomaxx",
    title: "Motomaxx",
    client: "Motomaxx",
    year: 2025,
    category: "Web Design",
    summary: "An e-commerce flagship for a Victoria-based moto-gear retailer.",
    overview:
      "Motomaxx came to us with a strong product line but a fragmented digital experience. We rebuilt their store from the inventory model up — homepage, PDP, configurator, checkout — and shipped it on Shopify with a custom theme.",
    challenge:
      "The previous site was a wall of SKUs with no narrative. Riders wanted spec depth without losing the emotional pull of the brand. We led with editorial imagery and let the technical detail unfold progressively in the PDP.",
    liveUrl: "https://sprrintly.io/",
    color: "#FF4A1C",
    accent: "#111111",
    tags: ["Web Design", "E-commerce", "Shopify"],
    duration: "10 weeks",
    role: "Design + Build",
    deliverables: "Full site",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Shopify", color: "#96BF47" },
      { name: "Webflow", color: "#4353FF" },
      { name: "After Effects", color: "#9999FF" },
    ],
    quote:
      "These guys killed it! Our site looks stunning and the user flow is so much smoother now. Highly recommend Sprrintly for web design!",
    author: "Nirosha S.",
    role_author: "CEO, Motomaxx — Victoria, Australia",
    mockType: "browser-bold",
  },
  {
    id: "digitpay",
    title: "DigitPay",
    client: "DigitPay",
    year: 2025,
    category: "UI/UX",
    summary: "A fintech platform redesign for a Singapore-based payments provider.",
    overview:
      "DigitPay was scaling fast and the existing dashboard couldn’t keep up. We re-architected the entire merchant console — payments, payouts, reconciliation, reporting — and shipped a design system the in-house team could extend.",
    challenge:
      "Finance products live or die on data density. We needed every screen to hold more information than felt comfortable while still feeling clean. The answer was a tight grid, careful type scale, and one accent color used like a scalpel.",
    liveUrl: "https://sprrintly.io/",
    color: "#F4F4EF",
    accent: "#2540F5",
    tags: ["UI/UX", "Fintech", "Dashboard", "Design System"],
    duration: "14 weeks",
    role: "Design Lead",
    deliverables: "Console + DS",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Storybook", color: "#FF4785" },
      { name: "Linear", color: "#5E6AD2" },
    ],
    quote:
      "Incredible UI/UX. They turned our complex fintech platform into a clean, professional website. Sprrintly is easily one of the best decisions we made.",
    author: "Naveed W.",
    role_author: "Founder, DigitPay — Singapore",
    mockType: "dashboard",
  },
  {
    id: "arca",
    title: "Arca Dynamics",
    client: "Arca Dynamics",
    year: 2024,
    category: "Pitch Deck",
    summary: "A 24-slide investor deck for a Series A robotics startup.",
    overview:
      "Arca was raising their Series A and the existing deck buried a strong story under bullet points. We re-wrote the narrative arc with the founders and rebuilt every slide to lead with the single most important thing on each page.",
    challenge:
      "Hardware decks are unforgiving — investors want both poetry and precision in the same room. We balanced a cinematic opening sequence against detail-dense unit economics slides without the deck feeling like two different documents stapled together.",
    liveUrl: "https://sprrintly.io/",
    color: "#15161A",
    accent: "#E0E0E0",
    tags: ["Pitch Deck", "Investor Deck", "Storytelling"],
    duration: "3 weeks",
    role: "Designer + Narrative",
    deliverables: "24 slides",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Keynote", color: "#0095FF" },
      { name: "After Effects", color: "#9999FF" },
    ],
    quote:
      "I’ve worked with many designers, but Ashley is on another level. He balances beautiful design with strong functionality better than anyone I’ve seen.",
    author: "Leo Thorne",
    role_author: "CEO, Arca Dynamics — Canada",
    mockType: "deck",
  },
  {
    id: "adup",
    title: "AdUp",
    client: "AdUp",
    year: 2025,
    category: "UI/UX",
    summary: "A creative review tool for Netherlands-based ad teams.",
    overview:
      "AdUp’s product solves a real problem — async creative review across timezones — but the UI got in the way. We mapped the full collaboration loop, killed three redundant surfaces, and re-introduced a single inbox-style review queue at the center.",
    challenge:
      "Review tools live between creative people and ops people, and both groups expect totally different things. We split the UI into a calm review mode and a denser ops mode, sharing the same data layer, so each persona felt the product was built for them.",
    liveUrl: "https://sprrintly.io/",
    color: "#FFE76A",
    accent: "#15161A",
    tags: ["UI/UX", "SaaS", "Product Design"],
    duration: "12 weeks",
    role: "Product Designer",
    deliverables: "Product redesign",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Framer", color: "#0055FF" },
      { name: "Notion", color: "#000" },
    ],
    quote: "Working with Ashley felt like working with a product-minded co-founder.",
    author: "Maikel Snijders",
    role_author: "Founder, AdUp — Netherlands",
    mockType: "browser-soft",
  },
  {
    id: "lankaauto",
    title: "Lankaauto",
    client: "Lankaauto",
    year: 2024,
    category: "Web Design",
    summary: "A marketplace + dealer portal for the largest used-car platform in Sri Lanka.",
    overview:
      "Lankaauto runs a two-sided marketplace — public buyer search plus a heavy dealer-facing portal for inventory, leads, and pricing. We redesigned both halves so they shared a brand but flexed their density independently.",
    challenge:
      "The product needed to feel premium without alienating its core user base of regional dealers running the site on older browsers. We constrained ourselves to a small CSS feature set and leaned on typography and rhythm to do the heavy lifting.",
    liveUrl: "https://sprrintly.io/",
    color: "#0F4F3C",
    accent: "#F2F2EE",
    tags: ["Web Design", "Marketplace", "Branding"],
    duration: "16 weeks",
    role: "Design Lead",
    deliverables: "Brand + Site + Portal",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Webflow", color: "#4353FF" },
      { name: "Elementor", color: "#92003B" },
    ],
    quote:
      "Working with Ashley was a total game-changer for our digital presence. It genuinely feels like having a tech partner in-house.",
    author: "Nandana",
    role_author: "Founder, Lankaauto — Victoria, Australia",
    mockType: "browser-soft",
  },
  {
    id: "metana",
    title: "Metana",
    client: "Metana — Coding Bootcamps",
    year: 2024,
    category: "Web Design",
    summary: "A complete site refresh for a global coding bootcamp brand.",
    overview:
      "Metana had grown beyond their original site’s scope — multiple programs, regions, and admission flows competing for the same hero slot. We re-mapped the funnel and rebuilt the marketing site around a single, repeating program template.",
    challenge:
      "The previous site converted on hype. We wanted to convert on trust without losing any of the energy. We replaced stock illustration with documentary photography of real cohorts and rewrote the CTA copy across every page.",
    liveUrl: "https://sprrintly.io/",
    color: "#1E2330",
    accent: "#FFD23F",
    tags: ["Web Design", "Marketing Site", "Branding"],
    duration: "8 weeks",
    role: "Creative Designer",
    deliverables: "Marketing site",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Webflow", color: "#4353FF" },
      { name: "Photoshop", color: "#31A8FF" },
    ],
    quote:
      "The team’s grasp of our brand voice was uncanny. Conversion lifted measurably and the site finally feels like the company.",
    author: "Priya R.",
    role_author: "Head of Marketing, Metana",
    mockType: "browser-dark",
  },
  {
    id: "notch",
    title: "Notch",
    client: "Notch Digital",
    year: 2023,
    category: "Branding",
    summary: "A bold, geometric brand for a digital agency in Melbourne.",
    overview:
      "Notch wanted to retire their first identity — which had carried them through a scrappy first three years — and replace it with something that could carry them through ten. We built a wordmark, a custom monogram, a full type system, and a motion language.",
    challenge:
      "Agencies-for-agencies live or die on taste. Anything too clever ages badly; anything too plain disappears. We landed on a confident geometric wordmark anchored by one quietly weird custom letterform — enough to remember, not enough to date.",
    liveUrl: "https://sprrintly.io/",
    color: "#FF5C2E",
    accent: "#0A0A0A",
    tags: ["Brand Identity", "Logo Design", "Motion"],
    duration: "5 weeks",
    role: "Designer",
    deliverables: "Brand system",
    stack: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Illustrator", color: "#FF9A00" },
      { name: "After Effects", color: "#9999FF" },
    ],
    quote:
      "The new identity is finally a brand we can grow into. Six months in and clients still bring it up on first calls.",
    author: "Marcus T.",
    role_author: "Partner, Notch Digital",
    mockType: "logo",
  },
  {
    id: "lumen",
    title: "Lumen",
    client: "Lumen Studio",
    year: 2026,
    category: "Motion",
    summary: "A 45-second brand film + motion identity for an architecture studio.",
    overview:
      "Lumen needed a film that introduced their practice to new clients in under a minute. We wrote, designed, and animated a sequence that moved from their material palette to a single completed project, scored to a custom track.",
    challenge:
      "Architecture films lean either dry or self-important. We tried to make one that felt like a sketch from the studio — fast, confident, a little playful — and that could be cut down to a 6-second loop for social without losing the idea.",
    liveUrl: "https://sprrintly.io/",
    color: "#F3EFE7",
    accent: "#1E1E1E",
    tags: ["Motion Graphics", "Branding", "Animation"],
    duration: "4 weeks",
    role: "Director + Designer",
    deliverables: "45s film + cuts",
    stack: [
      { name: "After Effects", color: "#9999FF" },
      { name: "Premiere Pro", color: "#9999FF" },
      { name: "Figma", color: "#F24E1E" },
    ],
    quote:
      "It captured the practice in a way our website never has. We open every new business pitch with it now.",
    author: "Eleanor V.",
    role_author: "Principal, Lumen Studio",
    mockType: "motion",
  },
];
