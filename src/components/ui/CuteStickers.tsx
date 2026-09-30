import type { CSSProperties } from "react";

// Deterministic set of cute stickers gently floating across the page.
const STICKERS: Array<{
  e: string;
  left: string;
  top: string;
  size: string;
  delay: string;
  dur: string;
}> = [
  { e: "🌸", left: "6%", top: "16%", size: "1.6rem", delay: "0s", dur: "6s" },
  { e: "🎀", left: "90%", top: "22%", size: "1.5rem", delay: "1.2s", dur: "7s" },
  { e: "💕", left: "16%", top: "70%", size: "1.4rem", delay: "0.6s", dur: "6.5s" },
  { e: "⭐", left: "82%", top: "64%", size: "1.3rem", delay: "2.1s", dur: "7.5s" },
  { e: "🧸", left: "8%", top: "44%", size: "1.6rem", delay: "1.6s", dur: "6.8s" },
  { e: "🌈", left: "72%", top: "10%", size: "1.5rem", delay: "0.3s", dur: "7.2s" },
  { e: "🍓", left: "28%", top: "30%", size: "1.3rem", delay: "2.6s", dur: "6.2s" },
  { e: "🦋", left: "60%", top: "82%", size: "1.5rem", delay: "1.0s", dur: "7.8s" },
  { e: "🌷", left: "44%", top: "12%", size: "1.4rem", delay: "3.0s", dur: "6.6s" },
  { e: "☁️", left: "92%", top: "86%", size: "1.5rem", delay: "0.9s", dur: "8s" },
  { e: "💗", left: "4%", top: "88%", size: "1.3rem", delay: "2.3s", dur: "6.4s" },
  { e: "🍰", left: "50%", top: "60%", size: "1.4rem", delay: "1.8s", dur: "7.1s" },
];

export const CuteStickers = () => (
  <div className="cute-sticker-field" aria-hidden="true">
    {STICKERS.map((s, i) => (
      <span
        key={i}
        className="cute-sticker"
        style={
          {
            left: s.left,
            top: s.top,
            fontSize: s.size,
            "--delay": s.delay,
            "--dur": s.dur,
          } as CSSProperties
        }>
        {s.e}
      </span>
    ))}
  </div>
);
