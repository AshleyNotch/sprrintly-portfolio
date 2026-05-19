// Images auto-loaded from src/assets/ticker/ — just drop files in and rebuild
const tickerModules = import.meta.glob("../assets/ticker/*.{jpg,jpeg,png,avif,webp,gif}", {
  eager: true,
  import: "default",
});

const TICKER_IMAGES = Object.values(tickerModules) as string[];

// Split images across 3 rows (cycle if fewer than needed)
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

function TickerRow({ images, direction, speed = 35 }: TickerRowProps) {
  if (images.length === 0) return null;
  // Duplicate 4× for seamless loop
  const items = [...images, ...images, ...images, ...images];

  return (
    <div className="ticker-wrap">
      <div
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
      <TickerRow images={getRow(0)} direction="to-right" speed={38} />
      <TickerRow images={getRow(1)} direction="to-left"  speed={32} />
      <TickerRow images={getRow(2)} direction="to-right" speed={36} />
    </section>
  );
}
