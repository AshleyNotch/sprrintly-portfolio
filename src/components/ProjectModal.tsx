import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Mock } from "@/components/Mocks";

interface OnNext {
  nextTitle: string;
  go: () => void;
}

interface Props {
  project: Project | null;
  onClose: () => void;
  onNext: OnNext;
}

export function ProjectModal({ project, onClose, onNext }: Props) {
  const open = !!project;
  const [lastProject, setLastProject] = useState<Project | null>(project);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) setLastProject(project);
  }, [project]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [project?.id, open]);

  const p = lastProject;

  return (
    <>
      <div
        className={"modal-backdrop" + (open ? " open" : "")}
        onClick={onClose}
      />
      <aside
        className={"modal" + (open ? " open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={p ? `${p.title} case study` : "Case study"}
      >
        {p && (
          <>
            <div className="modal-top">
              <div className="modal-top-left">
                <button className="btn-icon" onClick={onClose} aria-label="Close case study">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9 4L5 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span>Case study</span>
                <span style={{ color: "#d0d0d0" }}>/</span>
                <span style={{ color: "#0a0a0a", fontWeight: 500 }}>{p.title}</span>
              </div>
              <div className="modal-actions">
                <a className="btn btn-ghost" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                  Share
                </a>
                <a className="btn btn-primary" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Preview
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="modal-scroll" ref={scrollRef}>
              {/* HERO */}
              <header className="cs-hero">
                <div className="cs-hero-meta">
                  <span className="cs-tag">{p.category}</span>
                  <span className="dot" />
                  <span>{p.client}</span>
                  <span className="dot" />
                  <span>{p.year}</span>
                </div>
                <h1 className="cs-title">
                  {p.title} — <em>{p.summary}</em>
                </h1>
              </header>

              {/* HERO MEDIA */}
              <div className="cs-hero-media">
                <Mock type={p.mockType} color={p.color} accent={p.accent} title={p.title} />
              </div>

              {/* META STRIP */}
              <div className="cs-meta-strip">
                <div>
                  <div className="cs-meta-label">Client</div>
                  <div className="cs-meta-value">{p.client}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Role</div>
                  <div className="cs-meta-value">{p.role}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Duration</div>
                  <div className="cs-meta-value">{p.duration}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Deliverables</div>
                  <div className="cs-meta-value">{p.deliverables}</div>
                </div>
              </div>

              {/* OVERVIEW */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Overview</div>
                  <div>
                    <p className="lede">{p.overview}</p>
                  </div>
                </div>
              </section>

              {/* CHALLENGE */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">The challenge</div>
                  <div>
                    <h3>What the project had to solve.</h3>
                    <p>{p.challenge}</p>
                  </div>
                </div>
              </section>

              {/* PROCESS GALLERY */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Process</div>
                  <div>
                    <h3>From sketch to ship.</h3>
                    <p style={{ marginBottom: 32 }}>
                      A small selection of work-in-progress frames, system explorations, and the surfaces that made it into the final build.
                    </p>
                    <div className="cs-gallery">
                      <div className="cs-gallery-full">
                        <Mock type={p.mockType} color={p.color} accent={p.accent} title={p.title} />
                      </div>
                      <div className="cs-gallery-item">
                        <ProcessThumb tone="light" color={p.color} accent={p.accent} title={p.title} />
                      </div>
                      <div className="cs-gallery-item">
                        <ProcessThumb tone="dark" color={p.color} accent={p.accent} title={p.title} />
                      </div>
                      <div className="cs-gallery-item" style={{ gridColumn: "1 / -1", aspectRatio: "21/9" }}>
                        <ProcessThumb tone="wide" color={p.color} accent={p.accent} title={p.title} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* TOOLS */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">Tools</div>
                  <div>
                    <h3>What we used.</h3>
                    <p style={{ marginBottom: 8 }}>The tools that supported the work, end to end.</p>
                    <div className="cs-stack">
                      {p.stack.map((s) => (
                        <div className="cs-stack-item" key={s.name}>
                          <span className="swatch" style={{ background: s.color }} />
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* TESTIMONIAL */}
              <section className="cs-section" style={{ background: "#FAFAF6" }}>
                <div className="cs-section-grid">
                  <div className="cs-section-label">Words</div>
                  <div>
                    <div className="cs-quote">{p.quote}</div>
                    <div className="cs-quote-by">
                      <div className="cs-avatar">{p.author.charAt(0)}</div>
                      <div>
                        <div className="cs-author">{p.author}</div>
                        <div className="cs-author-role">{p.role_author}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FOOTER / NEXT */}
              <div className="cs-footer">
                <div>
                  <div className="label">Up next</div>
                  <h4>{onNext.nextTitle}</h4>
                </div>
                <button className="btn btn-primary" onClick={onNext.go}>
                  View next project
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

interface ProcessThumbProps {
  tone: "light" | "dark" | "wide";
  color: string;
  accent: string;
  title: string;
}

function ProcessThumb({ tone, color, accent, title }: ProcessThumbProps) {
  if (tone === "wide") {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#FAFAF6", padding: 28, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: color, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: accent }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Color system / {title}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, height: 48, borderRadius: 8, background: color }} />
            <div style={{ flex: 1, height: 48, borderRadius: 8, background: accent }} />
            <div style={{ flex: 1, height: 48, borderRadius: 8, background: "#0a0a0a" }} />
            <div style={{ flex: 1, height: 48, borderRadius: 8, background: "#FAFAF6", border: "1px solid #ececec" }} />
            <div style={{ flex: 1, height: 48, borderRadius: 8, background: "#fff", border: "1px solid #ececec" }} />
          </div>
        </div>
      </div>
    );
  }

  const bg = tone === "dark" ? "#0F0F11" : "#FAFAF6";
  const ink = tone === "dark" ? "#fff" : "#0a0a0a";
  const muted = tone === "dark" ? "#26262a" : "#ececec";

  return (
    <div style={{ position: "absolute", inset: 0, background: bg, padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: tone === "dark" ? "#888" : "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {tone === "dark" ? "Component / Card" : "Component / Hero"}
        </div>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: accent }} />
      </div>
      <div style={{ flex: 1, marginTop: 6, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        <div style={{ height: 18, borderRadius: 3, background: ink, width: "60%" }} />
        <div style={{ height: 18, borderRadius: 3, background: ink, width: "80%" }} />
        <div style={{ height: 6, borderRadius: 2, background: muted, width: "70%", marginTop: 6 }} />
        <div style={{ height: 6, borderRadius: 2, background: muted, width: "60%" }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ padding: "6px 12px", borderRadius: 999, background: accent, color: tone === "dark" ? "#0a0a0a" : "#fff", fontSize: 10, fontWeight: 600 }}>
          Primary
        </div>
        <div style={{ padding: "6px 12px", borderRadius: 999, background: "transparent", color: ink, fontSize: 10, fontWeight: 600, border: `1px solid ${muted}` }}>
          Secondary
        </div>
      </div>
    </div>
  );
}
