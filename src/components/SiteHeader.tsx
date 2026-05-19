import logoUrl from "@/assets/logo.avif";

export function SiteHeader() {
  return (
    <header className="w-full flex justify-center pt-5 pb-2 sticky top-0 z-50">
      {/* Outer wrapper for the frosted bg that spans full width on scroll */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" style={{ zIndex: -1 }} />
      <nav className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-border bg-background shadow-sm">
        {/* Logo */}
        <a
          href="https://sprrintly.io/"
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-muted transition"
        >
          <img src={logoUrl} alt="Sprrintly" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-semibold text-[15px] tracking-tight">Sprrintly</span>
        </a>

        {/* Nav links */}
        <a href="https://sprrintly.io/#work" className="nav-pill-link">Work</a>
        <a href="https://sprrintly.io/#services" className="nav-pill-link">Services</a>
        <a href="https://sprrintly.io/#pricing" className="nav-pill-link">Pricing</a>

        {/* CTA */}
        <a
          href="https://cal.com/sprrintly-ash/30min"
          target="_blank"
          rel="noreferrer"
          className="ml-1 rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-muted transition"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
