export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sprrintly. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:ashley@sprrintly.io" className="hover:text-foreground transition">
            ashley@sprrintly.io
          </a>
          <a href="https://sprrintly.io/terms" target="_blank" rel="noreferrer" className="hover:text-foreground transition">
            Terms
          </a>
          <a href="https://sprrintly.io/privacy-policy" target="_blank" rel="noreferrer" className="hover:text-foreground transition">
            Privacy
          </a>
          <a href="https://sprrintly.io/" target="_blank" rel="noreferrer" className="hover:text-foreground transition">
            sprrintly.io ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
