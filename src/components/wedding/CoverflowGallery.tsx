import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Camera } from "lucide-react";
import { getTranslations, type Language, getStoredLanguage } from "@/lib/i18n";

interface CoverflowGalleryProps {
  photos: string[];
  language?: Language;
}

// A swipeable "coverflow" gallery: the centred photo is full size while the
// neighbours shrink and fade, giving a 3D depth feel. Built on embla-carousel.
export const CoverflowGallery = ({ photos, language }: CoverflowGalleryProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: photos.length > 2,
    containScroll: false,
  });

  // Cache the slide inner nodes so the scroll handler never queries the DOM.
  const nodes = useRef<HTMLElement[]>([]);
  const raf = useRef(0);

  const cacheNodes = useCallback(
    (api: NonNullable<typeof emblaApi>) => {
      nodes.current = api
        .slideNodes()
        .map((s) => s.querySelector<HTMLElement>(".coverflow-inner"))
        .filter((n): n is HTMLElement => n !== null);
    },
    [],
  );

  // Writes only transform/opacity (compositor-friendly — no layout reads).
  const tween = useCallback(
    (api: NonNullable<typeof emblaApi>) => {
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      nodes.current.forEach((node, i) => {
        let diff = Math.abs(snaps[i] - progress);
        diff = Math.min(diff, Math.abs(diff - 1)); // handle loop wrap
        const scale = Math.max(0.74, 1 - diff * 1.5);
        node.style.transform = `scale(${scale})`;
        node.style.opacity = String(Math.max(0.4, scale));
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;
    cacheNodes(emblaApi);
    tween(emblaApi);

    // Coalesce many scroll events into a single update per animation frame.
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        tween(emblaApi);
      });
    };
    const onReInit = () => {
      cacheNodes(emblaApi);
      tween(emblaApi);
    };

    emblaApi.on("scroll", onScroll).on("reInit", onReInit);
    return () => {
      emblaApi.off("scroll", onScroll).off("reInit", onReInit);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [emblaApi, cacheNodes, tween]);

  if (!photos.length) return null;

  return (
    <section className="coverflow-section scroll-reveal py-16 px-2 bg-romantic-gradient">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 px-4">
          <Camera className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            {t.photoGallery}
          </h2>
        </div>
        <div className="coverflow-viewport" ref={emblaRef}>
          <div className="coverflow-container">
            {photos.map((photo, i) => (
              <div className="coverflow-slide" key={i}>
                <div className="coverflow-inner">
                  <img
                    src={photo}
                    alt={`Wedding photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
