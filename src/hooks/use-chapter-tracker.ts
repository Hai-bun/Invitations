import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks which chapter is centred in the viewport so a progress rail can follow
 * along, and exposes a scroll helper for jumping between them. The symmetric
 * rootMargin means a chapter only becomes "active" once it owns the middle of
 * the screen.
 */
export const useChapterTracker = (count: number) => {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      refs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const elements = refs.current
      .slice(0, count)
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const scrollTo = useCallback((index: number) => {
    refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { active, setRef, scrollTo };
};
