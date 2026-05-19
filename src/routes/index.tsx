import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { projects, CATEGORIES, type Category, type Project } from "@/data/projects";
import { Mock } from "@/components/Mocks";
import { ProjectModal } from "@/components/ProjectModal";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

function Nav() {
  return (
    <nav className="nav">
      <div className="shell nav-inner">
        <a href="https://sprrintly.io/" className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>Sprrintly</span>
        </a>
        <div className="nav-links">
          <a href="https://sprrintly.io/" className="active">Work</a>
          <a href="https://sprrintly.io/#services">Services</a>
          <a href="https://sprrintly.io/#pricing">Pricing</a>
          <a href="https://cal.com/sprrintly-ash/30min" className="nav-cta">Book a call</a>
        </div>
      </div>
    </nav>
  );
}

function PageHeader() {
  return (
    <header className="page-head">
      <div className="shell">
        <div className="eyebrow">Open for ANZ Startups</div>
        <h1 className="page-title">
          Selected <em>work</em> from the studio.
        </h1>
        <p className="page-sub">
          A small set of recent projects — brand systems, product surfaces,
          marketing sites and the occasional pitch deck. Click any project
          to read the case study, or jump to the live build.
        </p>
      </div>
    </header>
  );
}

function Filters({
  active,
  setActive,
  counts,
}: {
  active: Category;
  setActive: (c: Category) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="shell">
      <div className="filters-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={"chip" + (c === active ? " active" : "")}
            onClick={() => setActive(c)}
          >
            {c}
            <span className="chip-count">{counts[c]}</span>
          </button>
        ))}
        <div className="filters-spacer" />
        <div className="results-count">
          Showing {counts[active]} {counts[active] === 1 ? "project" : "projects"}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <article className="card" onClick={() => onOpen(project)}>
      <div className="card-media">
        <div className="card-media-inner">
          <Mock
            type={project.mockType}
            color={project.color}
            accent={project.accent}
            title={project.title}
          />
        </div>
        <div className="card-overlay-top">
          <span className="card-tag">{project.category}</span>
          <span className="card-year">{project.year}</span>
        </div>
        <div className="card-overlay">
          <h3 className="card-title">{project.title}</h3>
          <div className="card-client">{project.client}</div>
        </div>
        <div className="card-arrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="page-footer">
      <div className="shell">
        <div>© {new Date().getFullYear()} Sprrintly. Unlimited designs for ANZ startups.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="https://sprrintly.io/terms">Terms</a>
          <a href="https://sprrintly.io/privacy-policy">Privacy</a>
          <a href="mailto:ashley@sprrintly.io">ashley@sprrintly.io</a>
        </div>
      </div>
    </footer>
  );
}

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const cat of CATEGORIES) {
      if (cat === "All") continue;
      c[cat] = projects.filter((p) => p.category === cat).length;
    }
    return c;
  }, []);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const openProject = openId ? projects.find((p) => p.id === openId) ?? null : null;

  const onNext = useMemo(() => {
    if (!openProject) return { nextTitle: "", go: () => {} };
    const idx = projects.findIndex((p) => p.id === openProject.id);
    const next = projects[(idx + 1) % projects.length];
    return { nextTitle: next.title, go: () => setOpenId(next.id) };
  }, [openProject?.id]);

  return (
    <>
      <Nav />
      <PageHeader />
      <Filters active={activeFilter} setActive={setActiveFilter} counts={counts} />
      <div className="shell">
        <div className="grid">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={(pr) => setOpenId(pr.id)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: "64px 0", textAlign: "center", color: "#9a9a9a" }}>
            No projects in this category yet.
          </div>
        )}
      </div>
      <Footer />
      <ProjectModal
        project={openProject}
        onClose={() => setOpenId(null)}
        onNext={onNext}
      />
    </>
  );
}
