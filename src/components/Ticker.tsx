import { useEffect, useRef } from "react";
import type { TickerConfig, TickerRowConfig } from "@/lib/supabase";
import { DEFAULT_TICKER_CONFIG } from "@/lib/supabase";

const tickerModules = import.meta.glob("../assets/ticker/*.{jpg,jpeg,png,avif,webp,gif}", {
  eager: true,
  import: "default",
});
const STATIC_IMAGES = Object.values(tickerModules) as string[];

function speedToDuration(speed: number): number {
  return Math.round(6000 / Math.max(speed, 1));
}

function TickerRow({ config }: { config: TickerRowConfig }) {
  const { images, speed, direction, align, gap, padding, itemWidth, itemHeight, clipping, hoverFactor } = config;
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const activeImages = images.length > 0 ? images : STATIC_IMAGES;
  const isVertical = direction === "up" || direction === "down";
  const duration = speedToDuration(speed);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const rate = hoverFactor > 0 ? 1 / hoverFactor : 0;
    const slow = () => track.getAnimations().forEach((a) => a.updatePlaybackRate(rate));
    const restore = () => track.getAnimations().forEach((a) => a.updatePlaybackRate(1));
    wrap.addEventListener("mouseenter", slow);
    wrap.addEventListener("mouseleave", restore);
    return () => {
      wrap.removeEventListener("mouseenter", slow);
      wrap.removeEventListener("mouseleave", restore);
    };
  }, [hoverFactor]);

  if (activeImages.length === 0) return null;
  const items = [...activeImages, ...activeImages, ...activeImages, ...activeImages];

  const maskDir = isVertical ? "to bottom" : "to right";
  const maskImg = clipping
    ? `linear-gradient(${maskDir}, transparent 0%, black 6%, black 94%, transparent 100%)`
    : "none";

  const alignItems = { start: "flex-start", center: "center", end: "flex-end" }[align];

  return (
    <div
      ref={wrapRef}
      className="ticker-wrap"
      style={{
        overflow: "hidden",
        maskImage: maskImg,
        WebkitMaskImage: maskImg,
        ...(isVertical ? { height: itemHeight * 2 + gap } : {}),
      }}
    >
      <div
        ref={trackRef}
        className={`ticker-track to-${direction}`}
        style={{
          animationDuration: `${duration}s`,
          gap: `${gap}px`,
          padding: `${padding}px`,
          alignItems,
          ...(isVertical ? { height: "max-content", width: undefined } : { width: "max-content" }),
        }}
      >
        {items.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden bg-muted"
            style={{ width: itemWidth, height: itemHeight }}
          >
            <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TickerSection({ config }: { config?: TickerConfig }) {
  const active = config ?? DEFAULT_TICKER_CONFIG;
  const hasContent = active.rows.some((r) => r.images.length > 0) || STATIC_IMAGES.length > 0;
  if (!hasContent) return null;

  return (
    <section className="py-12 space-y-3 overflow-hidden">
      {active.rows.map((row, i) => (
        <TickerRow key={i} config={row} />
      ))}
    </section>
  );
}