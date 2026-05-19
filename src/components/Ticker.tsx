import { useEffect, useRef } from "react";

const tickerModules = import.meta.glob("../assets/ticker/*.{jpg,jpeg,png,avif,webp,gif}", {
  eager: true,
  import: "default",
});

const TICKER_IMAGES = Object.values(tickerModules) as string[];

function getRow(rowIndex: number): string[] {
  if (TICKER_IMAGES.length === 0) return [];
  const row: string[] = [];
  for (let i = 0; i < Math.max(TICKER_IMAGES.length, 6); i++) {
    row.push(TICKER_IMAGES[(i + rowIndex * 3) % TICKER_IMAGES.length]);
  }
  return row;
}

interface TickerRowProps {
  images: string[];
  direction: "to-right" | "to-left";
  speed?: number;
}

function TickerRow({ images, direction, speed = 70 }: TickerRowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const slow = () => {
      track.getAnimations().forEach((a) => a.updatePlaybackRate(0.2));
    };
    const restore = () => {
      track.getAnimations().forEach((a) => a.updatePlaybackRate(1));
    };

    wrap.addEventListener("mouseenter", slow);
    wrap.addEventListener("mouseleave", restore);
    return () => {
      wrap.removeEventListener("mouseenter", slow);
      wrap.removeEventListener("mouseleave", restore);
    };
  }, []);

  if (images.length === 0) return null;
  const items = [...images, ...images, ...images, ...images];

  return (
    <div ref={wrapRef} className="ticker-wrap">
      <div
        ref={trackRef}
        className={`ticker-track ${direction}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden bg-muted"
            style={{ width: 280, height: 180 }}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TickerSection() {
  if (TICKER_IMAGES.length === 0) return null;

  return (
    <section className="py-12 space-y-3 overflow-hidden">
      <TickerRow images={getRow(0)} direction="to-right" speed={70} />
      <TickerRow images={getRow(1)} direction="to-left"  speed={65} />
      <TickerRow images={getRow(2)} direction="to-right" speed={75} />
    </section>
  );
}
