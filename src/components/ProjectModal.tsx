import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { parseVideoUrl } from "@/lib/video";

/* Simple markdown renderer — handles bullets, bold, italic, line breaks */
function MarkdownText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={blocks.length} className="list-disc pl-5 space-y-1">
        {listItems.map((item, i) => <li key={i}>{inlineMarkdown(item)}</li>)}
      </ul>
    );
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const isBullet = /^(\s*[-•*]\s+)/.test(line);
    if (isBullet) {
      listItems.push(line.replace(/^\s*[-•*]\s+/, ""));
    } else {
      flushList();
      if (line.trim()) blocks.push(<p key={blocks.length}>{inlineMarkdown(line)}</p>);
      else if (blocks.length > 0) blocks.push(<br key={blocks.length} />);
    }
  }
  flushList();

  return <div className={className}>{blocks}</div>;
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

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
                {p.livePreview && (
                  <a
                    className="cs-btn cs-btn-ghost"
                    href={p.livePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share
                  </a>
                )}
                {p.livePreview && (
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
                )}
              </div>
            </div>

            <div className="cs-body" ref={scrollRef}>
              {/* Hero */}
              <header className="cs-hero">
                <div className="cs-hero-eyebrow">
                  {p.clientType === "retainer" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "#22c55e", color: "#fff", fontSize: 12, fontWeight: 500 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 2s infinite" }} />
                      Active Retainer
                    </span>
                  ) : (
                    <span className="cs-tag">One-Off</span>
                  )}
                  {p.categories.map((c) => (
                    <span key={c} className="cs-tag">{c}</span>
                  ))}
                  <span className="cs-dot" />
                  <span>{p.client}</span>
                </div>
                <h1 className="cs-title">{p.title}</h1>
                <MarkdownText text={p.problem} className="cs-subtitle" />
              </header>

              {/* Hero carousel */}
              <HeroCarousel project={p} />

              {/* Meta strip */}
              <div className="cs-meta-strip">
                <div>
                  <div className="cs-meta-label">Client</div>
                  <div className="cs-meta-value">{p.client}</div>
                </div>
                <div>
                  <div className="cs-meta-label">Category</div>
                  <div className="cs-meta-value">{p.categories.join(", ")}</div>
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
                    <MarkdownText text={p.solution} className="cs-lede" />
                  </div>
                </div>
              </section>

              {/* Challenge */}
              <section className="cs-section">
                <div className="cs-section-grid">
                  <div className="cs-section-label">The challenge</div>
                  <div>
                    <h3 className="cs-section-h3">What the project had to solve.</h3>
                    <MarkdownText text={p.challenge} className="cs-body-text" />
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

/* ---- Hero carousel ---- */
function HeroCarousel({ project: p }: { project: Project }) {
  const video = p.videoUrl ? parseVideoUrl(p.videoUrl) : null;

  // Build slides: video first (if any), then banner, then extra images
  type Slide = { type: "video"; embedUrl: string } | { type: "image"; src: string };
  const slides: Slide[] = [];
  if (video) slides.push({ type: "video", embedUrl: video.embedUrl });
  if (p.banner) slides.push({ type: "image", src: p.banner });
  if (p.images) p.images.forEach((src) => { if (src) slides.push({ type: "image", src }); });

  const [idx, setIdx] = useState(0);
  const current = slides[idx] ?? slides[0];
  const total = slides.length;

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  // Reset to first slide when project changes
  useEffect(() => { setIdx(0); }, [p.id]);

  if (!current) return null;

  return (
    <div className="cs-hero-img" style={{ position: "relative" }}>
      {/* Current slide */}
      {current.type === "video" ? (
        <iframe
          src={current.embedUrl}
          title={p.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      ) : (
        <img src={current.src} alt={`${p.title} ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}

      {/* Navigation — only show if more than 1 slide */}
      {total > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 999, background: i === idx ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }}
              />
            ))}
          </div>

          {/* Counter */}
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 999, backdropFilter: "blur(4px)" }}>
            {idx + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}
