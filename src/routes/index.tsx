import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { ProjectModal } from "@/components/ProjectModal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TickerSection } from "@/components/Ticker";
import { supabase, dbToProject, fetchSettings, parseCategoryList, DEFAULT_CATEGORIES } from "@/lib/supabase";
import type { DbProject, SiteSettings } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { parseVideoUrl } from "@/lib/video";

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
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    Promise.all([
      supabase.from("projects").select("*").order("sort_order"),
      fetchSettings(),
    ]).then(([{ data }, s]) => {
      setProjects(data && data.length > 0 ? (data as DbProject[]).map(dbToProject) : fallbackProjects);
      if (Object.keys(s).length > 0) {
        setSettings(s);
        setCategories(parseCategoryList(s.category_list));
      }
      setLoading(false);
    }).catch(() => {
      setProjects(fallbackProjects);
      setLoading(false);
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

  const filtered = useMemo(() => {
    const base = filter === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));
    // Retainers always first
    return [...base].sort((a, b) => {
      if (a.clientType === "retainer" && b.clientType !== "retainer") return -1;
      if (a.clientType !== "retainer" && b.clientType === "retainer") return 1;
      return 0;
    });
  }, [filter, projects]);

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
          {["All", ...categories].map((c) => {
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
        {loading && (
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="rounded-2xl bg-muted aspect-[16/11] animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded-full w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => openProject(p)}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[16/11]">
                {(() => {
                  const video = p.videoUrl ? parseVideoUrl(p.videoUrl) : null;
                  const src = video?.thumbnailUrl ?? p.banner;
                  return (
                    <>
                      <img
                        src={src}
                        alt={p.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {video && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                            <div style={{ width: 0, height: 0, borderLeft: "14px solid #0a0a0a", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", marginLeft: 3 }} />
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-foreground w-fit">
                    {p.categories[0]}
                  </span>
                  {p.clientType === "retainer" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/90 backdrop-blur px-3 py-1 text-xs font-medium text-white w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Active Retainer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs font-medium text-white/80 w-fit">
                      One-Off
                    </span>
                  )}
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
        </div>}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            No projects in this category yet.
          </p>
        )}
      </section>

      <TickerSection />
      <SiteFooter />

      <ProjectModal project={active} open={open} onOpenChange={setOpen} />
    </main>
  );
}
