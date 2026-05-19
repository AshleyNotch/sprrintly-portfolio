import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import logoUrl from "@/assets/logo.avif";
import { supabase, dbToProject, projectToDb, fetchSettings, saveSettings } from "@/lib/supabase";
import type { DbProject, SiteSettings } from "@/lib/supabase";
import { projects as fallbackProjects, CATEGORIES } from "@/data/projects";
import type { Project } from "@/data/projects";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const FONTS = [
  "Inter", "Onest", "DM Sans", "Plus Jakarta Sans",
  "Manrope", "Nunito", "Poppins", "Sora",
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"projects" | "settings">("projects");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/admin/login" });
      else setChecking(false);
    }).catch(() => navigate({ to: "/admin/login" }));
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Sprrintly" className="h-7 w-7 rounded-full object-cover" />
            <span className="font-semibold tracking-tight text-sm">Sprrintly CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground transition flex items-center gap-1"
            >
              View site ↗
            </a>
            <button
              onClick={logout}
              className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-muted transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 flex gap-1 pt-2">
          {(["projects", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition ${
                tab === t
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "projects" ? "Projects" : "Site Settings"}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "projects" ? <ProjectsTab /> : <SettingsTab />}
      </main>
    </div>
  );
}

/* ============================================================
   PROJECTS TAB
   ============================================================ */

function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("sort_order");

    if (!data || data.length === 0) {
      // First run — seed all fallback projects once
      const rows = fallbackProjects.map((p, i) =>
        ({ ...projectToDb(p, i), updated_at: new Date().toISOString() })
      );
      await supabase.from("projects").upsert(rows);
      const { data: seeded } = await supabase.from("projects").select("*").order("sort_order");
      setProjects(seeded ? (seeded as DbProject[]).map(dbToProject) : fallbackProjects);
    } else {
      // Use exactly what's in Supabase — respect deletions
      setProjects((data as DbProject[]).map(dbToProject));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditTarget({
      id: "",
      title: "",
      client: "",
      categories: [],
      banner: "",
      images: [],
      livePreview: "",
      problem: "",
      solution: "",
      challenge: "",
      tools: [],
      testimonial: { quote: "", author: "", role: "" },
      clientType: "oneoff",
    });
    setIsNew(true);
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditTarget({ ...p });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { alert("Delete failed: " + error.message); return; }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  };

  const handleDuplicate = (p: Project) => {
    const copy: Project = {
      ...p,
      id: "",
      title: p.title + " (Copy)",
    };
    setEditTarget(copy);
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleSave = async (p: Project) => {
    const id = isNew ? slugify(p.title) || `project-${Date.now()}` : p.id;
    const row = projectToDb({ ...p, id }, isNew ? projects.length : projects.findIndex((x) => x.id === p.id));
    const { error } = await supabase.from("projects").upsert({ ...row, updated_at: new Date().toISOString() });
    if (error) { alert("Save failed: " + error.message); return; }
    setDialogOpen(false);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          + New project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-foreground/20 transition"
            >
              <div className="h-14 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {p.banner && (
                  <img src={p.banner} alt={p.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-xs text-muted-foreground">{p.client} · {p.categories.join(", ")}</p>
                  {p.clientType === "retainer" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-[11px] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active Retainer
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(p)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
                  title="Duplicate project"
                >
                  Duplicate
                </button>
                {confirmDeleteId === p.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Sure?</span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded-full bg-destructive text-white px-3 py-1.5 text-xs font-medium hover:opacity-90 transition"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    className="rounded-full border border-destructive/30 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/10 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogOpen && editTarget && (
        <ProjectDialog
          project={editTarget}
          isNew={isNew}
          onSave={handleSave}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

/* ============================================================
   PROJECT EDIT DIALOG
   ============================================================ */

interface ProjectDialogProps {
  project: Project;
  isNew: boolean;
  onSave: (p: Project) => void;
  onClose: () => void;
}

function ProjectDialog({ project, isNew, onSave, onClose }: ProjectDialogProps) {
  const [p, setP] = useState<Project>(project);
  const [saving, setSaving] = useState(false);
  const [toolsInput, setToolsInput] = useState(project.tools.join(", "));

  const set = (key: keyof Project, value: unknown) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const setTestimonial = (key: string, value: string) =>
    setP((prev) => ({ ...prev, testimonial: { ...prev.testimonial, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...p, tools: toolsInput.split(",").map((t) => t.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-2xl bg-background shadow-2xl flex flex-col">
        {/* Dialog header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold">{isNew ? "New project" : "Edit project"}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Basic info */}
          <Section title="Basic info">
            <Field label="Title">
              <Input value={p.title} onChange={(v) => set("title", v)} placeholder="Harmonic — Brand Identity" />
            </Field>
            <Field label="Client">
              <Input value={p.client} onChange={(v) => set("client", v)} placeholder="Harmonic" />
            </Field>
            <Field label="Client type">
              <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
                <div>
                  <p className="text-sm font-medium">
                    {p.clientType === "retainer" ? "Active Retainer" : "One-Off Project"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.clientType === "retainer"
                      ? "Ongoing client — shown first in portfolio"
                      : "Single engagement"}
                  </p>
                </div>
                <ToggleSwitch
                  checked={p.clientType === "retainer"}
                  onChange={(v) => set("clientType", v ? "retainer" : "oneoff")}
                />
              </div>
            </Field>
            <Field label="Categories">
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIES.filter((c) => c !== "All").map((c) => {
                  const selected = p.categories.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        set(
                          "categories",
                          selected
                            ? p.categories.filter((x) => x !== c)
                            : [...p.categories, c],
                        )
                      }
                      style={{
                        border: `1.5px solid ${selected ? "rgba(10,10,10,1)" : "rgba(10,10,10,0.18)"}`,
                        background: selected ? "rgba(10,10,10,1)" : "transparent",
                        color: selected ? "#fff" : "rgba(10,10,10,0.7)",
                        borderRadius: 999,
                        padding: "6px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              {p.categories.length === 0 && (
                <p className="text-xs text-destructive mt-1">Select at least one category</p>
              )}
            </Field>
          </Section>

          {/* Media & links */}
          <Section title="Media & links">
            <Field label="Banner image (shown on portfolio grid)">
              <ImageField value={p.banner} onChange={(v) => set("banner", v)} />
            </Field>
            <Field label="Case study gallery images (1–3)">
              <ImagesField images={p.images} onChange={(imgs) => set("images", imgs)} />
            </Field>
            <Field label="Live preview URL">
              <Input value={p.livePreview} onChange={(v) => set("livePreview", v)} placeholder="https://..." />
            </Field>
          </Section>

          {/* Case study content */}
          <Section title="Case study content">
            <Field label="Problem / Brief">
              <Textarea value={p.problem} onChange={(v) => set("problem", v)} placeholder="What the client needed..." rows={3} />
            </Field>
            <Field label="Solution / Outcome">
              <Textarea value={p.solution} onChange={(v) => set("solution", v)} placeholder="What we built and the result..." rows={3} />
            </Field>
            <Field label="Challenge">
              <Textarea value={p.challenge} onChange={(v) => set("challenge", v)} placeholder="What made this project hard..." rows={3} />
            </Field>
          </Section>

          {/* Tools */}
          <Section title="Tools">
            <Field label="Tools used (comma separated)">
              <Input
                value={toolsInput}
                onChange={setToolsInput}
                placeholder="Figma, Framer, After Effects"
              />
            </Field>
          </Section>

          {/* Testimonial */}
          <Section title="Client testimonial">
            <Field label="Quote">
              <Textarea value={p.testimonial.quote} onChange={(v) => setTestimonial("quote", v)} placeholder="What the client said..." rows={3} />
            </Field>
            <Field label="Author name">
              <Input value={p.testimonial.author} onChange={(v) => setTestimonial("author", v)} placeholder="Siyara E." />
            </Field>
            <Field label="Author role">
              <Input value={p.testimonial.role} onChange={(v) => setTestimonial("role", v)} placeholder="Founder of Harmonic" />
            </Field>
            <Field label="Author avatar (optional)">
              <ImageField value={p.testimonial.avatar ?? ""} onChange={(v) => setTestimonial("avatar", v)} compact />
            </Field>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS TAB
   ============================================================ */

function SettingsTab() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const set = (key: keyof SiteSettings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await saveSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Site Settings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Controls the live portfolio at portfolio.sprrintly.io
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="space-y-6">
        <Section title="Hero copy">
          <Field label="Headline">
            <Input
              value={settings.hero_title ?? "Portfolio."}
              onChange={(v) => set("hero_title", v)}
              placeholder="Portfolio."
            />
          </Field>
          <Field label="Sub-headline">
            <Input
              value={settings.hero_subtitle ?? "Real design for ANZ startups."}
              onChange={(v) => set("hero_subtitle", v)}
              placeholder="Real design for ANZ startups."
            />
          </Field>
          <Field label="Body text">
            <Textarea
              value={settings.hero_body ?? ""}
              onChange={(v) => set("hero_body", v)}
              placeholder="A handpicked selection of websites, branding, pitch decks and product UI delivered unlimited and async for early-stage ANZ founders."
              rows={3}
            />
          </Field>
        </Section>

        <Section title="Appearance">
          <Field label="Brand accent color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.brand_accent ?? "#0a0a0a"}
                onChange={(e) => set("brand_accent", e.target.value)}
                className="h-10 w-16 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={settings.brand_accent ?? "#0a0a0a"}
                onChange={(v) => set("brand_accent", v)}
                placeholder="#0a0a0a"
              />
            </div>
          </Field>
          <Field label="Body font">
            <select
              value={settings.font_body ?? "Inter"}
              onChange={(e) => set("font_body" as keyof SiteSettings, e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {FONTS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Heading font">
            <select
              value={settings.font_heading ?? "Inter"}
              onChange={(e) => set("font_heading" as keyof SiteSettings, e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {FONTS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="Footer">
          <Field label="Footer text">
            <Input
              value={settings.footer_text ?? "Built for ANZ startups."}
              onChange={(v) => set("footer_text", v)}
              placeholder="Built for ANZ startups."
            />
          </Field>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none"
      style={{ background: checked ? "#22c55e" : "#e5e7eb" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
    />
  );
}

/* ---- Single image field (URL + upload + drop zone) ---- */

async function uploadToStorage(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null;
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("Portfolio").upload(path, file, { upsert: true });
  if (error) { alert("Upload failed: " + error.message); return null; }
  return supabase.storage.from("Portfolio").getPublicUrl(path).data.publicUrl;
}

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  compact?: boolean;
}

function ImageField({ value, onChange, compact = false }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  // local display state — fixes stale value on duplicate
  const [display, setDisplay] = useState(value);
  useEffect(() => { setDisplay(value); }, [value]);

  const handleUrl = (url: string) => { setDisplay(url); onChange(url); };

  const doUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToStorage(file);
    if (url) handleUrl(url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={display}
          onChange={(e) => handleUrl(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex-shrink-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }} />
      </div>

      {!compact && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) doUpload(f); }}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition overflow-hidden ${dragOver ? "border-foreground bg-muted" : "border-border hover:border-foreground/40"}`}
        >
          {display ? (
            <div className="relative">
              <img src={display} alt="preview" className="h-36 w-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="text-white text-xs font-medium bg-black/60 rounded-full px-3 py-1.5">Replace image</span>
              </div>
            </div>
          ) : (
            <div className="h-28 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs">{uploading ? "Uploading…" : "Drop image here or click to upload"}</span>
            </div>
          )}
        </div>
      )}

      {compact && display && (
        <img src={display} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
      )}
    </div>
  );
}

/* ---- Multi-image field (1–3 gallery images) ---- */

function ImagesField({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const slots = Math.min(3, Math.max(1, images.length + (images.length < 3 ? 1 : 0)));
  const arr = [...images, ...Array(3).fill("")].slice(0, 3);

  const update = (i: number, url: string) => {
    const next = [...arr]; next[i] = url;
    onChange(next.filter(Boolean));
  };

  const doUpload = async (i: number, file: File) => {
    setUploading(i);
    const url = await uploadToStorage(file);
    if (url) update(i, url);
    setUploading(null);
  };

  const remove = (i: number) => {
    const next = arr.filter((_, idx) => idx !== i).filter(Boolean);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: slots }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Image {i + 1}{i === 0 ? " (required)" : " (optional)"}</span>
            {arr[i] && i > 0 && (
              <button type="button" onClick={() => remove(i)} className="text-xs text-destructive hover:underline">Remove</button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={arr[i] ?? ""}
              onChange={(e) => update(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => fileRefs[i].current?.click()}
              disabled={uploading === i}
              className="flex-shrink-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50 whitespace-nowrap"
            >
              {uploading === i ? "Uploading…" : "Upload"}
            </button>
            <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(i, f); e.target.value = ""; }} />
          </div>
          {arr[i] && (
            <div className="rounded-xl overflow-hidden h-28 bg-muted">
              <img src={arr[i]} alt={`gallery ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      ))}
      <p className="text-xs text-muted-foreground">These images appear in the case study gallery (max 3). First image is always required.</p>
    </div>
  );
}
