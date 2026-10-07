import { useEffect } from "react";

// Warms the browser cache with every gallery photo once the page is idle, so
// photos further down are already downloaded and decoded when scrolled to,
// instead of loading (and fading in) late. Hero photo loads first on its own.
export function usePreloadImages(urls: string[] | undefined) {
  const key = (urls ?? []).join("|");
  useEffect(() => {
    const list = key ? key.split("|").filter((u) => u && !/\.(mp4|webm|ogg)(\?|$)/i.test(u)) : [];
    if (!list.length) return;
    // Respect Data Saver.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    let cancelled = false;
    const held: HTMLImageElement[] = [];
    let i = 0;
    const next = () => {
      if (cancelled || i >= list.length) return;
      const img = new Image();
      img.decoding = "async";
      img.src = list[i++];
      held.push(img);
      // One at a time, so it never competes with what the guest is looking at.
      const done = () => next();
      img.onload = done;
      img.onerror = done;
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => {
      next();
      next();
    };
    const id = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (w.requestIdleCallback && (window as Window & { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback) {
        (window as Window & { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, [key]);
}
