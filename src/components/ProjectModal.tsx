import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: Props) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto rounded-2xl [&>button.absolute]:hidden"
      >
        <VisuallyHidden>
          <DialogTitle>{project.title}</DialogTitle>
        </VisuallyHidden>

        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {project.title}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {project.client} · {project.category}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" className="rounded-full">
              <a href={project.livePreview} target="_blank" rel="noreferrer">
                Live preview <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={project.banner}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="px-6 md:px-10 py-8 space-y-10">
          <div className="grid gap-8 md:grid-cols-3">
            <Section label="Problem" body={project.problem} />
            <Section label="Solution" body={project.solution} />
            <Section label="Challenge" body={project.challenge} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Tool stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-sm font-medium"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <figure className="rounded-2xl bg-muted/60 p-6 md:p-8">
            <blockquote className="text-lg md:text-xl leading-relaxed text-foreground">
              “{project.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {project.testimonial.avatar ? (
                <img
                  src={project.testimonial.avatar}
                  alt={project.testimonial.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-accent" />
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {project.testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.testimonial.role}
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </p>
      <p className="text-foreground leading-relaxed">{body}</p>
    </div>
  );
}
