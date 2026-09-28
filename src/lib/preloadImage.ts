// Warms the browser cache for images so they're already decoded by the time
// the guest reaches the full invitation — they then fade in instantly instead
// of popping in. Videos are skipped (they stream on their own).
const VIDEO_RE = /\.(mp4|webm|ogg)(\?|$)/i;

export const preloadImages = (urls: (string | undefined | null)[]): void => {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (!url || VIDEO_RE.test(url)) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
};
