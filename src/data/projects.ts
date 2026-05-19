export type Project = {
  id: string;
  title: string;
  client: string;
  categories: string[];
  banner: string;
  images: string[];
  livePreview: string;
  problem: string;
  solution: string;
  challenge: string;
  tools: string[];
  testimonial: { quote: string; author: string; role: string; avatar?: string };
};

export const CATEGORIES = [
  "All",
  "Web Design",
  "Branding",
  "UI/UX",
  "Framer",
  "Motion",
] as const;

export const projects: Project[] = [
  {
    id: "harmonic",
    title: "Harmonic — Brand Identity",
    client: "Harmonic",
    categories: ["Branding"],
    banner:
      "https://framerusercontent.com/images/dyKAmcSn5frmMprV4edgfrdVLA.jpg?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "Harmonic had a generic visual identity that failed to reflect their premium positioning in the wellness space.",
    solution:
      "We crafted a timeless logo, refined typography system and a calming color palette that elevates every touchpoint.",
    challenge:
      "Balancing a premium, intentional feel with warmth — without leaning into wellness clichés.",
    tools: ["Figma", "Illustrator", "Photoshop"],
    testimonial: {
      quote:
        "Ashley really took the time to understand our brand and created a beautiful, timeless logo and identity that we absolutely love.",
      author: "Siyara E.",
      role: "Founder of Harmonic",
      avatar:
        "https://framerusercontent.com/images/DTV2r9ed0XzESu9ldPOZcs3UTBU.webp?width=200&height=200",
    },
  },
  {
    id: "adup",
    title: "AdUp — Marketing Website",
    client: "AdUp",
    categories: ["Web Design"],
    banner:
      "https://framerusercontent.com/images/Bz1f3EDCqjX6ogtibruM6kHs7Y.jpg?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "AdUp's old site was converting poorly and didn't communicate the product's value to performance marketers.",
    solution:
      "A bold, conversion-focused landing experience with clear product narrative, social proof, and a single hero CTA.",
    challenge:
      "Compressing a complex SaaS pitch into a scrollable story under 90 seconds of reading time.",
    tools: ["Figma", "Framer", "After Effects"],
    testimonial: {
      quote:
        "Sign-ups doubled in the first two weeks after launch. The team gets it — speed and quality.",
      author: "Marcus L.",
      role: "Head of Growth, AdUp",
    },
  },
  {
    id: "tinnitunes",
    title: "Tinnitunes — Product UI",
    client: "Tinnitunes",
    categories: ["UI/UX"],
    banner:
      "https://framerusercontent.com/images/FlGWMJnifRlqJqPcdGrSDnhQj8.jpg?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "Users dropped off during onboarding because the audio therapy flow felt clinical and overwhelming.",
    solution:
      "Re-designed the onboarding and player into a calm, guided experience with progressive disclosure.",
    challenge:
      "Designing for accessibility-first audio users while keeping the brand modern and inviting.",
    tools: ["Figma", "Principle", "Lottie"],
    testimonial: {
      quote:
        "Our onboarding completion jumped from 38% to 71%. The new flow finally feels like our brand.",
      author: "Priya R.",
      role: "Product Lead, Tinnitunes",
    },
  },
  {
    id: "buildform",
    title: "Buildform — Framer Site",
    client: "Buildform",
    categories: ["Framer"],
    banner:
      "https://framerusercontent.com/images/6oNDqkXZHWzffUsOz1tVARUjIww.jpg?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "Buildform needed a flagship site live in 10 days for an investor demo — agencies quoted 8 weeks.",
    solution:
      "Designed and shipped a fully responsive Framer site with CMS-driven case studies in under two weeks.",
    challenge:
      "Hitting an aggressive timeline without compromising the typography-led art direction.",
    tools: ["Framer", "Figma", "Notion CMS"],
    testimonial: {
      quote:
        "They moved at startup speed and delivered work that looks like it took a quarter to make.",
      author: "Daniel K.",
      role: "Co-founder, Buildform",
    },
  },
  {
    id: "donely",
    title: "Donely AI — App Design",
    client: "Donely AI",
    categories: ["UI/UX"],
    banner:
      "https://framerusercontent.com/images/QNZreLR0Njc4DHr0nsMRufTBYwc.webp?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "An AI task manager with no clear visual language — every screen felt like a different product.",
    solution:
      "Built a cohesive design system from tokens up, then applied it across web app, mobile, and marketing.",
    challenge:
      "Designing for AI surfaces where state and content change unpredictably without breaking layout.",
    tools: ["Figma", "Tokens Studio", "Storybook"],
    testimonial: {
      quote:
        "Our entire team finally speaks the same design language. Velocity went through the roof.",
      author: "Alex W.",
      role: "CTO, Donely AI",
    },
  },
  {
    id: "metana",
    title: "Metana — Motion Reel",
    client: "Metana",
    categories: ["Motion"],
    banner:
      "https://framerusercontent.com/images/tyQLPNGNTR7gBMBURMt0FNKpAA.png?width=1600&height=1000",
    images: [],
    livePreview: "https://sprrintly.io/",
    problem:
      "Static ads were under-performing on TikTok and Reels for a coding bootcamp audience.",
    solution:
      "Produced a series of punchy 15s motion ads with kinetic type and product moments.",
    challenge:
      "Hitting a recognisable brand look across 12 ad variants on a weekly cadence.",
    tools: ["After Effects", "Premiere Pro", "Figma"],
    testimonial: {
      quote:
        "CPA dropped 41% the month we shipped the new reels. Easy decision to keep going.",
      author: "Imran S.",
      role: "Marketing Lead, Metana",
    },
  },
];
