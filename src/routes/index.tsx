import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, CATEGORIES, type Project } from "@/data/projects";
import { ProjectModal } from "@/components/ProjectModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Sprrintly" },
      {
        name: "description",
        content:
          "Selected work by Sprrintly — unlimited design for ANZ startups. Branding, web design, UI/UX, Framer and motion projects.",
      },
      { property: "og:title", content: "Portfolio — Sprrintly" },
      {
        property: "og:description",
        content: "Selected work by Sprrintly — design for ANZ startups.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter],
  );

  const openProject = (p: Project) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent">
            <span className="block h-2 w-3 rounded-sm bg-foreground" />
          </span>
          <span className="font-semibold tracking-tight">Sprrintly</span>
        </a>
        <a
          href="https://cal.com/sprrintly-ash/30min"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Book a call <ArrowUpRight className="h-4 w-4" />
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-accent" /> Selected work
          2023 — 2026
        </div>
        <h1 className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
          Portfolio.
          <span className="text-muted-foreground">
            {" "}
            Real projects, real outcomes.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          A small selection of recent work — websites, brand systems and
          product UI shipped for ANZ startups.
        </p>
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
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-foreground/30",
                )}
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
                    {p.category}
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
                  <h3 className="text-lg font-semibold text-foreground">
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

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sprrintly. Built for ANZ startups.</p>
          <a
            href="https://sprrintly.io/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition"
          >
            sprrintly.io ↗
          </a>
        </div>
      </footer>

      <ProjectModal project={active} open={open} onOpenChange={setOpen} />
    </main>
  );
}
