import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/data/projects";

const url = (import.meta.env.VITE_SUPABASE_URL as string) || "https://placeholder.supabase.co";
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-key";

export const supabase = createClient(url, key);

export type DbProject = {
  id: string;
  title: string;
  client: string;
  categories: string[];
  banner: string;
  images: string[];
  live_preview: string;
  problem: string;
  solution: string;
  challenge: string;
  tools: string[];
  testimonial_quote: string;
  testimonial_author: string;
  testimonial_role: string;
  testimonial_avatar: string | null;
  client_type: string;
  video_url: string | null;
  sort_order: number;
  updated_at: string;
};

export type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_body: string;
  brand_accent: string;
  font_body: string;
  font_heading: string;
  footer_text: string;
  category_list: string; // JSON array stored as string
};

export const DEFAULT_CATEGORIES = ["Web Design", "UI/UX", "Branding", "Pitch Deck", "Motion", "Framer"];

export function parseCategoryList(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_CATEGORIES;
  try { return JSON.parse(raw) as string[]; } catch { return DEFAULT_CATEGORIES; }
}

export function dbToProject(p: DbProject): Project {
  return {
    id: p.id,
    title: p.title,
    client: p.client,
    categories: p.categories ?? [],
    banner: p.banner,
    images: p.images ?? [],
    livePreview: p.live_preview,
    problem: p.problem,
    solution: p.solution,
    challenge: p.challenge,
    tools: p.tools ?? [],
    testimonial: {
      quote: p.testimonial_quote,
      author: p.testimonial_author,
      role: p.testimonial_role,
      avatar: p.testimonial_avatar ?? undefined,
    },
    clientType: (p.client_type === "retainer" ? "retainer" : "oneoff"),
    videoUrl: p.video_url ?? undefined,
  };
}

export function projectToDb(p: Project, sortOrder: number): Omit<DbProject, "updated_at"> {
  return {
    id: p.id,
    title: p.title,
    client: p.client,
    categories: p.categories,
    banner: p.banner,
    images: p.images,
    live_preview: p.livePreview,
    problem: p.problem,
    solution: p.solution,
    challenge: p.challenge,
    tools: p.tools,
    testimonial_quote: p.testimonial.quote,
    testimonial_author: p.testimonial.author,
    testimonial_role: p.testimonial.role,
    testimonial_avatar: p.testimonial.avatar ?? null,
    client_type: p.clientType,
    video_url: p.videoUrl ?? null,
    sort_order: sortOrder,
  };
}

export async function fetchSettings(): Promise<Partial<SiteSettings>> {
  const { data } = await supabase.from("site_settings").select("key,value");
  if (!data) return {};
  return Object.fromEntries(data.map((r) => [r.key, r.value])) as Partial<SiteSettings>;
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<void> {
  const rows = Object.entries(patch).map(([key, value]) => ({ key, value }));
  await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
}
