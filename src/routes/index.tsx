import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects as fallbackProjects, CATEGORIES, type Project } from "@/data/projects";
import { ProjectModal } from "@/components/ProjectModal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase, dbToProject, fetchSettings } from "@/lib/supabase";
import type { DbProject, SiteSettings } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

function injectFont(family: string) {
  const id = `gfont-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  /* Load projects + settings from Supabase, fall back to hardcoded if empty */
  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProjects((data as DbProject[]).map(dbToProject));
        }
      });

    fetchSettings().then((s) => {
      if (Object.keys(s).length > 0) setSettings(s);
    });
  }, []);

  /* Apply fonts from settings */
  useEffect(() => {
    if (settings.font_body) {
      injectFont(settings.font_body);
      document.documentElement.style.setProperty("--font-body", `'${settings.font_body}', sans-serif`);
    }
    if (settings.font_heading) {
      injectFont(settings.font_heading);
      document.documentElement.style.setProperty("--font-heading", `'${settings.font_heading}', sans-serif`);
    }
    if (settings.brand_accent) {
      document.documentElement.style.setProperty("--site-accent", settings.brand_accent);
    }
  }, [settings]);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.categories.includes(filter)),
    [filter, projects],
  );

  const openProject = (p: Project) => {
    setActive(p);
    setOpen(true);
  };

  const heroTitle = settings.hero_title ?? "Recent Works";
  const heroSubtitle = settings.hero_subtitle ?? "";
  const heroBody =
    settings.hero_body ??
    "A small selection of recent work including websites, brand systems and product UI shipped for ANZ startups and all across the globe.";
  const footerText = settings.footer_text ?? "Built for ANZ startups.";

  return (
    <main className="min-h-screen bg-background" style={{ fontFamily: "var(--font-body)" }}>
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-accent" /> Selected work • 2023 – 2026
        </div>
        <h1
          className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heroTitle}
          {heroSubtitle && <span className="text-muted-foreground"> {heroSubtitle}</span>}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{heroBody}</p>
      </section>

      {/* Filter pills */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  border: `1.5px solid ${isActive ? "rgba(10,10,10,1)" : "rgba(10,10,10,0.2)"}`,
                  background: isActive ? "rgba(10,10,10,1)" : "transparent",
                  color: isActive ? "#fff" : "rgba(10,10,10,0.8)",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "all 0.15s",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 py-10 pb-24">
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => openProject(p)}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[16/11]">
                <img
                  src={p.banner}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
                    {p.categories[0]}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-medium">
                    View case <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="text-lg font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.client}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            No projects in this category yet.
          </p>
        )}
      </section>

      <SiteFooter />

      <ProjectModal project={active} open={open} onOpenChange={setOpen} />
    </main>
  );
}
