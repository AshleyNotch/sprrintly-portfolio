import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

interface Props {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: Props) {
  const [lastProject, setLastProject] = useState<Project | null>(project);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) setLastProject(project);
  }, [project]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [project?.id, open]);

  const p = lastProject;

  return (
    <>
      <div
        className={"cs-backdrop" + (open ? " open" : "")}
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={"cs-panel" + (open ? " open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={p ? `${p.title} case study` : "Case study"}
      >
        {p && (
          <>
            {/* Top bar */}
            <div className="cs-topbar">
              <div className="cs-topbar-left">
                <button
                  className="cs-icon-btn"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9 4L5 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span>Case study</span>
                <span style={{ color: "#d0d0d0" }}>/</span>
                <span style={{ color: "#0a0a0a", fontWeight: 500 }}>{p.client}</span>
              </div>
              <div className="cs-topbar-actions">
                <a
                  className="cs-btn cs-btn-ghost"
                  href={p.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share
                </a>
                <a
                  className="cs-btn cs-btn-primary"
                  href={p.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Preview
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="cs-body" ref={scrollRef}>
              {/* Hero */}
              <header className="cs-hero">
                <div className="cs-hero-eyebrow">
                  <span className="cs-tag">{p.category}</span>
                  <span className="cs-dot" />
                  <span>{p.client}</span>
                </div>
                <h1 className="cs-title">{p.title}</h1>
                <p className="cs-subtitle">{p.problem}</p>
              </header>

              {/* Hero image */}
              <div className="cs-hero-img">
                <img src={p.banner} alt={p.title} />
              </div>

              {/* Meta strip */}
              <div className="cs-meta-strip">
                <div>
                  <div className="cs-meta-label">Client</div>
                  <div className="cs-meta-value">{p.client}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Category</div>
                  <div className="cs-meta-value">{p.category}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Tools</div>
                  <div className="cs-meta-value">{p.tools.slice(0, 2).join(", ")}</div>
                </div>
              </div>

              {/* Overview */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Overview</div>
                  <div>
                    <p className="cs-lede">{p.solution}</p>
                  </div>
                </div>
              </section>

              {/* Challenge */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">The challenge</div>
                  <div>
                    <h3 className="cs-section-h3">What the project had to solve.</h3>
                    <p className="cs-body-text">{p.challenge}</p>
                  </div>
                </div>
              </section>

              {/* Process gallery */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Process</div>
                  <div>
                    <h3 className="cs-section-h3">From brief to build.</h3>
                    <p className="cs-body-text" style={{ marginBottom: 24 }}>
                      A selection of frames, explorations, and the surfaces that made it into the final build.
                    </p>
                    <div className="cs-gallery">
                      <div className="cs-gallery-wide">
                        <img src={p.banner} alt={`${p.title} process`} />
                      </div>
                      <div className="cs-gallery-halves">
                        <div className="cs-gallery-half">
                          <img src={p.banner} alt={`${p.title} detail A`} style={{ objectPosition: "top" }} />
                        </div>
                        <div className="cs-gallery-half">
                          <img src={p.banner} alt={`${p.title} detail B`} style={{ objectPosition: "bottom" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tools */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Tools</div>
                  <div>
                    <h3 className="cs-section-h3">What we used.</h3>
                    <div className="cs-tools">
                      {p.tools.map((t) => (
                        <span className="cs-tool-chip" key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonial */}
              <section className="cs-section cs-section-tinted">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Words</div>
                  <div>
                    <blockquote className="cs-quote">
                      {p.testimonial.quote}
                    </blockquote>
                    <div className="cs-author-row">
                      {p.testimonial.avatar ? (
                        <img
                          src={p.testimonial.avatar}
                          alt={p.testimonial.author}
                          className="cs-avatar-img"
                        />
                      ) : (
                        <div className="cs-avatar-fallback">
                          {p.testimonial.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="cs-author-name">{p.testimonial.author}</div>
                        <div className="cs-author-role">{p.testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
