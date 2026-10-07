import { useEffect, useRef, type CSSProperties } from "react";
import { Calendar, ChevronDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { TemplateSections, getCoupleDisplay, type SectionKey } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

// Khmer letters stack into clusters (base + vowel/sign marks), so splitting by
// code point tears them apart. Khmer words animate whole; other scripts split
// by grapheme cluster.
const KHMER = /[\u1780-\u17FF]/;
type Segmenter = { segment: (s: string) => Iterable<{ segment: string }> };
const segmenter: Segmenter | null =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new (Intl as unknown as { Segmenter: new (l?: string, o?: object) => Segmenter }).Segmenter(undefined, { granularity: "grapheme" })
    : null;
const splitUnits = (word: string): string[] => {
  if (KHMER.test(word)) return [word];
  return segmenter
    ? Array.from(segmenter.segment(word), (s) => s.segment)
    : Array.from(word);
};

// Words stay unbroken (so names wrap only at spaces); letters blur/rise in.
const SplitName = ({ text, start, on }: { text: string; start: number; on: boolean }) => {
  let n = start;
  return (
    <span className="mo-split" aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="mo-word" aria-hidden="true">
          {splitUnits(word).map((ch, i) => (
            <span
              key={i}
              className={cn("mo-char", on && "mo-char-in")}
              style={{ "--i": n++ } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

// Circular rotating badge — text runs around a circle and slowly spins.
const SpinBadge = ({ text }: { text: string }) => (
  <div className="mo-badge" aria-hidden="true">
    <svg viewBox="0 0 120 120" className="mo-badge-ring">
      <defs>
        <path id="mo-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text>
        <textPath href="#mo-circle" textLength="285">
          {text}
        </textPath>
      </text>
    </svg>
    <Heart className="mo-badge-heart w-5 h-5" fill="currentColor" />
  </div>
);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const AuroraInvitation = ({ weddingData, guest, language }: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("aurora").sectionOrder.filter(
    (k) => k !== "hero" && k !== "gallery",
  ) as SectionKey[];
  const photos = weddingData.photos ?? [];
  const heroImg = weddingData.backgroundImage || photos[0] || "";
  const heroIsVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(heroImg);
  const dateText = formatWeddingDate(weddingData.weddingDate, language);

  const shellRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // One rAF loop writes CSS vars / transforms directly: hero parallax, scroll
  // progress bar, and the pinned horizontal photo gallery with per-photo
  // parallax. React never re-renders on scroll.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animOn || reduced) {
      shell.classList.add("mo-static");
      shell.querySelectorAll(".mo-reveal").forEach((n) => n.classList.add("is-in"));
      return;
    }
    shell.classList.remove("mo-static");

    const gallery = galleryRef.current;
    const track = trackRef.current;
    const cards = track ? Array.from(track.querySelectorAll<HTMLElement>(".mo-card")) : [];
    let shift = 0;
    let raf = 0;

    const measure = () => {
      if (!gallery || !track) return;
      shift = Math.max(0, track.scrollWidth - window.innerWidth);
      gallery.style.height = `${shift + window.innerHeight}px`;
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      shell.style.setProperty("--scroll", String(max > 0 ? y / max : 0));
      shell.style.setProperty("--scroll-y", `${y}px`);

      if (gallery && track) {
        const top = gallery.getBoundingClientRect().top + y;
        const p = shift > 0 ? clamp01((y - top) / shift) : 0;
        track.style.transform = `translate3d(${-p * shift}px,0,0)`;
        shell.style.setProperty("--gp", String(p));
        const vw = window.innerWidth;
        for (const c of cards) {
          const r = c.getBoundingClientRect();
          const off = (r.left + r.width / 2 - vw / 2) / vw; // -1..1 around centre
          c.style.setProperty("--off", off.toFixed(3));
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Images change the track width as they load.
    track?.querySelectorAll("img").forEach((img) => img.addEventListener("load", onResize));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    shell.querySelectorAll(".mo-reveal").forEach((n) => io.observe(n));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (gallery) gallery.style.height = "";
    };
  }, [animOn, photos.length]);

  const rowA = photos.length ? [...photos, ...photos, ...photos].slice(0, Math.max(8, photos.length * 2)) : [];
  const rowB = [...rowA].reverse();

  return (
    <div ref={shellRef} className={cn("mo-shell", language === "km" && "mo-km")}>
      <div className="mo-progress" aria-hidden="true" />

      {/* ---------- Hero: full-bleed photo, Ken Burns, curtain reveal ---------- */}
      <section className="mo-hero">
        <div className="mo-hero-media" aria-hidden="true">
          {heroImg ? (
            heroIsVideo ? (
              <video className="mo-hero-img" src={heroImg} autoPlay loop muted playsInline />
            ) : (
              <img className="mo-hero-img" src={heroImg} alt="" />
            )
          ) : (
            <div className="mo-hero-fallback" />
          )}
          <div className="mo-hero-shade" />
          <span className={cn("mo-curtain mo-curtain-l", animOn && "mo-curtain-open")} />
          <span className={cn("mo-curtain mo-curtain-r", animOn && "mo-curtain-open")} />
        </div>

        <div className="mo-hero-inner">
          {guest && (
            <p className={cn("mo-pill", fade("animate-fade-in-up delay-700"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p className={cn("mo-kicker", fade("animate-fade-in-up delay-700"))}>{t.weInviteYou}</p>

          <h1 className="mo-name">
            <SplitName text={groom} start={4} on={animOn} />
            <span className={cn("mo-amp", fade("animate-fade-in-up delay-1000"))}>{amp}</span>
            <SplitName text={bride} start={groom.length + 10} on={animOn} />
          </h1>

          <div className={cn("mo-date", fade("animate-fade-in-up delay-1000"))}>
            <Calendar className="w-4 h-4" />
            <span>
              {dateText}
              {" · "}
              {formatWeddingTime(weddingData.weddingTime)}
            </span>
          </div>

          {weddingData.showCountdown && (
            <div className={cn("mo-countdown", fade("animate-fade-in-up delay-1000"))}>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>

        <SpinBadge text={`${dateText} • ${dateText} • `} />
        <ChevronDown className="mo-scroll-cue w-6 h-6" aria-hidden="true" />
      </section>

      {/* ---------- Two photo ribbons drifting in opposite directions ---------- */}
      {photos.length > 0 && (
        <div className="mo-ribbons" aria-hidden="true">
          {[rowA, rowB].map((row, r) => (
            <div key={r} className={cn("mo-ribbon", r === 1 && "mo-ribbon-rev")}>
              <div className="mo-ribbon-track">
                {[0, 1].map((dup) =>
                  row.map((src, i) => (
                    <img key={`${dup}-${i}`} src={src} alt="" loading="lazy" draggable={false} />
                  )),
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Content sections (flat editorial cards, no glass) ---------- */}
      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order.filter((k) => ["couple", "story", "location", "schedule"].includes(k))}
      />

      {/* ---------- Pinned horizontal gallery with per-photo parallax ---------- */}
      {photos.length > 0 && (
        <section ref={galleryRef} className="mo-gallery" aria-label={t.photoGallery}>
          <div className="mo-gallery-pin">
            <h2 className="mo-gallery-title">{t.photoGallery}</h2>
            <div ref={trackRef} className="mo-track">
              {photos.map((src, i) => (
                <figure
                  key={i}
                  className={cn("mo-card mo-reveal", i % 2 ? "mo-card-b" : "mo-card-a")}>
                  <div className="mo-card-frame">
                    <img src={src} alt="" loading="lazy" draggable={false} />
                  </div>
                  <figcaption>{String(i + 1).padStart(2, "0")}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mo-gallery-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>
      )}

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        showMonogram={false}
        order={order.filter((k) => !["couple", "story", "location", "schedule"].includes(k))}
      />
    </div>
  );
};
