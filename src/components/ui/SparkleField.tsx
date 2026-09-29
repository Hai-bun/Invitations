import type { CSSProperties } from "react";

// Fixed set of ambient sparkles — deterministic positions/timing so there's no
// randomness on each render. Purely decorative twinkling lights.
const SPARKLES: Array<{
  left: string;
  top: string;
  size: string;
  delay: string;
  dur: string;
}> = [
  { left: "6%", top: "18%", size: "7px", delay: "0s", dur: "3.4s" },
  { left: "14%", top: "62%", size: "5px", delay: "1.1s", dur: "4.2s" },
  { left: "22%", top: "34%", size: "6px", delay: "2.3s", dur: "3.8s" },
  { left: "31%", top: "78%", size: "4px", delay: "0.6s", dur: "4.6s" },
  { left: "39%", top: "12%", size: "8px", delay: "1.8s", dur: "3.2s" },
  { left: "47%", top: "52%", size: "5px", delay: "3.0s", dur: "4.0s" },
  { left: "55%", top: "26%", size: "6px", delay: "0.3s", dur: "3.6s" },
  { left: "63%", top: "70%", size: "7px", delay: "2.0s", dur: "4.4s" },
  { left: "71%", top: "16%", size: "4px", delay: "1.4s", dur: "3.9s" },
  { left: "78%", top: "44%", size: "6px", delay: "2.7s", dur: "3.3s" },
  { left: "85%", top: "66%", size: "5px", delay: "0.9s", dur: "4.5s" },
  { left: "92%", top: "30%", size: "7px", delay: "1.6s", dur: "3.7s" },
  { left: "10%", top: "88%", size: "5px", delay: "2.5s", dur: "4.1s" },
  { left: "50%", top: "84%", size: "6px", delay: "0.2s", dur: "3.5s" },
  { left: "88%", top: "10%", size: "4px", delay: "3.3s", dur: "4.3s" },
  { left: "34%", top: "48%", size: "5px", delay: "1.9s", dur: "3.1s" },
];

export const SparkleField = () => (
  <div className="sparkle-field" aria-hidden="true">
    {SPARKLES.map((s, i) => (
      <span
        key={i}
        className="sparkle"
        style={
          {
            left: s.left,
            top: s.top,
            "--s": s.size,
            "--delay": s.delay,
            "--dur": s.dur,
          } as CSSProperties
        }
      />
    ))}
  </div>
);
