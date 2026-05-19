interface MockProps {
  type: string;
  color: string;
  accent: string;
  title: string;
}

export function Mock({ type, color, accent, title }: MockProps) {
  switch (type) {
    case "logo":
      return (
        <div className="mock" style={{ background: color }}>
          <div className="mock-logo-plate">
            <LogoMark title={title} accent={accent} />
          </div>
          <div style={{ position: "absolute", top: 18, left: 22, fontSize: 11, color: accent, opacity: 0.55, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {title} / 01
          </div>
          <div style={{ position: "absolute", bottom: 18, right: 22, fontSize: 11, color: accent, opacity: 0.55, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            brand mark
          </div>
        </div>
      );

    case "browser-bold":
      return (
        <div className="mock" style={{ background: color }}>
          <BrowserMock accent={accent} title={title} variant="bold" />
        </div>
      );

    case "browser-soft":
      return (
        <div className="mock" style={{ background: color }}>
          <BrowserMock accent={accent} title={title} variant="soft" />
        </div>
      );

    case "browser-dark":
      return (
        <div className="mock" style={{ background: color }}>
          <BrowserMock accent={accent} title={title} variant="dark" />
        </div>
      );

    case "app-dark":
      return (
        <div className="mock" style={{ background: color }}>
          <AppDarkMock accent={accent} title={title} />
        </div>
      );

    case "dashboard":
      return (
        <div className="mock" style={{ background: color }}>
          <DashboardMock accent={accent} title={title} />
        </div>
      );

    case "deck":
      return (
        <div className="mock" style={{ background: color }}>
          <DeckMock accent={accent} title={title} />
        </div>
      );

    case "motion":
      return (
        <div className="mock" style={{ background: color }}>
          <MotionMock accent={accent} title={title} />
        </div>
      );

    default:
      return <div className="mock" style={{ background: color }} />;
  }
}

function LogoMark({ title, accent }: { title: string; accent: string }) {
  const letter = (title || "").charAt(0);
  return (
    <div
      style={{
        width: "60%",
        height: "60%",
        borderRadius: "50%",
        background: accent,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(48px, 7vw, 96px)",
        fontWeight: 400,
        letterSpacing: "-0.02em",
      }}
    >
      {letter}
    </div>
  );
}

function BrowserMock({ accent, title, variant }: { accent: string; title: string; variant: "bold" | "soft" | "dark" }) {
  const bg = variant === "dark" ? "#15161A" : "#fff";
  const ink = variant === "dark" ? "#fff" : "#0a0a0a";
  const muted = variant === "dark" ? "#3a3a3e" : "#ececec";

  return (
    <div className="mock-browser" style={{ background: bg }}>
      <div
        className="mock-browser-bar"
        style={{
          background: variant === "dark" ? "#0e0e10" : "#f3f3f3",
          borderBottomColor: variant === "dark" ? "#222" : "#eee",
        }}
      >
        <div className="mock-dot" />
        <div className="mock-dot" />
        <div className="mock-dot" />
      </div>
      <div className="mock-browser-body" style={{ color: ink }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.02em" }}>{title.toLowerCase()}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 14, height: 4, borderRadius: 2, background: muted }} />
            <span style={{ width: 14, height: 4, borderRadius: 2, background: muted }} />
            <span style={{ width: 14, height: 4, borderRadius: 2, background: muted }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 10, marginTop: 4 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            <div style={{ height: 12, borderRadius: 2, background: ink, width: "70%" }} />
            <div style={{ height: 12, borderRadius: 2, background: ink, width: "90%" }} />
            <div style={{ height: 12, borderRadius: 2, background: ink, width: "55%" }} />
            <div style={{ height: 4, borderRadius: 2, background: muted, width: "80%", marginTop: 6 }} />
            <div style={{ height: 4, borderRadius: 2, background: muted, width: "70%" }} />
            <div style={{ display: "inline-block", width: 36, height: 10, borderRadius: 999, background: accent, marginTop: 6 }} />
          </div>
          <div style={{ flex: 1, borderRadius: 6, background: accent, opacity: variant === "bold" ? 1 : 0.85 }} />
        </div>
      </div>
    </div>
  );
}

function AppDarkMock({ accent, title }: { accent: string; title: string }) {
  return (
    <div style={{ width: "78%", aspectRatio: "16/10", background: "#0F0F11", borderRadius: 12, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", display: "flex", overflow: "hidden" }}>
      <div style={{ width: "22%", borderRight: "1px solid #1f1f22", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, background: accent }} />
        <div style={{ height: 5, background: "#26262a", borderRadius: 2, width: "80%", marginTop: 6 }} />
        <div style={{ height: 5, background: "#26262a", borderRadius: 2, width: "60%" }} />
        <div style={{ height: 5, background: "#26262a", borderRadius: 2, width: "70%" }} />
        <div style={{ height: 5, background: "#26262a", borderRadius: 2, width: "40%" }} />
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 8, background: "#fff", borderRadius: 2, width: "40%" }} />
        <div style={{ height: 4, background: "#3a3a3e", borderRadius: 2, width: "70%" }} />
        <div style={{ flex: 1, marginTop: 6, border: "1px solid #1f1f22", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent }} />
            <div style={{ height: 4, background: "#26262a", borderRadius: 2, flex: 1 }} />
          </div>
          <div style={{ height: 4, background: "#26262a", borderRadius: 2, width: "90%" }} />
          <div style={{ height: 4, background: "#26262a", borderRadius: 2, width: "80%" }} />
          <div style={{ marginTop: "auto", display: "inline-block", alignSelf: "flex-start", padding: "3px 8px", background: accent, color: "#0a0a0a", borderRadius: 999, fontSize: 8, fontWeight: 600 }}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMock({ accent, title }: { accent: string; title: string }) {
  const bars = [40, 65, 30, 80, 55, 90, 70, 60];
  return (
    <div style={{ width: "78%", aspectRatio: "16/10", background: "#fff", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.12)", display: "flex", overflow: "hidden" }}>
      <div style={{ width: "18%", background: "#FAFAF6", padding: 10, display: "flex", flexDirection: "column", gap: 6, borderRight: "1px solid #ececec" }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: accent }} />
        <div style={{ height: 4, background: "#ddd", borderRadius: 2, width: "70%", marginTop: 4 }} />
        <div style={{ height: 4, background: "#ddd", borderRadius: 2, width: "60%" }} />
        <div style={{ height: 4, background: "#222", borderRadius: 2, width: "80%" }} />
        <div style={{ height: 4, background: "#ddd", borderRadius: 2, width: "50%" }} />
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ height: 8, background: "#0a0a0a", borderRadius: 2, width: "30%" }} />
          <div style={{ height: 16, padding: "0 8px", display: "flex", alignItems: "center", background: accent, color: "#fff", borderRadius: 4, fontSize: 7, fontWeight: 600 }}>
            {title.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            { bg: "#0a0a0a" },
            { bg: accent },
            { bg: "#0a0a0a" },
          ].map((item, i) => (
            <div key={i} style={{ aspectRatio: "4/3", background: "#F4F4EF", borderRadius: 6, padding: 6 }}>
              <div style={{ height: 3, background: "#aaa", borderRadius: 2, width: "50%" }} />
              <div style={{ height: 8, background: item.bg, borderRadius: 2, width: i === 1 ? "80%" : "70%", marginTop: 4 }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: "#F4F4EF", borderRadius: 6, padding: 8, display: "flex", alignItems: "flex-end", gap: 4 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i % 2 ? accent : "#0a0a0a", borderRadius: 2, opacity: i === 5 ? 1 : 0.85 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeckMock({ accent, title }: { accent: string; title: string }) {
  return (
    <div style={{ position: "relative", width: "70%", aspectRatio: "16/9" }}>
      <div style={{ position: "absolute", inset: "4px 16px 16px 4px", background: "#2A2C32", borderRadius: 8, transform: "rotate(-2deg)", opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: "2px 8px 8px 2px", background: "#1f2025", borderRadius: 8, transform: "rotate(-1deg)", opacity: 0.75 }} />
      <div style={{ position: "absolute", inset: 0, background: "#15161A", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", padding: 22, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>{title + " · Series A"}</span>
          <span>04 / 24</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ color: "#fff", fontFamily: "'Instrument Serif', serif", fontSize: "clamp(20px, 3.5vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: "70%" }}>
            We build autonomous systems for environments humans shouldn't enter.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ width: 50, height: 1, background: accent }} />
          <div style={{ fontSize: 9, color: "#888" }}>Confidential</div>
        </div>
      </div>
    </div>
  );
}

function MotionMock({ accent, title }: { accent: string; title: string }) {
  return (
    <div style={{ width: "75%", aspectRatio: "16/9", background: "#0a0a0a", borderRadius: 10, position: "relative", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", width: "60%", height: "60%", borderRadius: "50%", background: accent, top: "10%", left: "-10%", filter: "blur(2px)", opacity: 0.95 }} />
      <div style={{ position: "absolute", width: "40%", height: "40%", borderRadius: "50%", background: "#FF5C2E", top: "30%", right: "8%", mixBlendMode: "screen", opacity: 0.85 }} />
      <div style={{ position: "absolute", width: "30%", height: "30%", borderRadius: "8px", background: "#F3EFE7", bottom: "15%", left: "25%", transform: "rotate(15deg)", opacity: 0.85 }} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 0, height: 0, borderLeft: "14px solid #0a0a0a", borderTop: "9px solid transparent", borderBottom: "9px solid transparent", marginLeft: 4 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
        <div style={{ width: "38%", height: "100%", background: "#fff", borderRadius: 2 }} />
      </div>
      <div style={{ position: "absolute", top: 14, left: 16, color: "#fff", fontSize: 10, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {title + " — brand film"}
      </div>
    </div>
  );
}
