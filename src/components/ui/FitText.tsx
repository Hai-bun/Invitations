import { useEffect, useRef, type ReactNode } from "react";

/**
 * Keeps its text on a single line: the text is never wrapped and, if it is
 * wider than the available space, it is scaled down just enough to fit.
 * Re-measures on resize and after web fonts finish loading.
 */
export const FitText = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const fit = () => {
      el.style.fontSize = "1em";
      const avail = box.clientWidth;
      const need = el.scrollWidth;
      if (avail > 0 && need > avail) {
        el.style.fontSize = `${Math.floor((avail / need) * 100) / 100}em`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener?.("loadingdone", fit);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", fit);
    };
  });

  return (
    <span ref={ref} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
      {children}
    </span>
  );
};
