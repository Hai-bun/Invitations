import { useEffect, useRef, type CSSProperties } from "react";
import { Calendar, ChevronDown } from "lucide-react";
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

// Splits a name into letters that blur/rise in one after another.
const SplitName = ({ text, start, on }: { text: string; start: number; on: boolean }) => (
  <span className="aurora-split" aria-label={text}>
    {Array.from(text).map((ch, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={cn("aurora-char", on && "aurora-char-in")}
        style={{ "--i": start + i } as CSSProperties}>
        {ch === " " ? " " : ch}
      </span>
    ))}
  </span>
);

export const AuroraInvitation = ({ weddingData, guest, language }: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("aurora").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll progress + cursor spotlight + hero parallax, written as CSS vars in
  // a single rAF so React never re-renders on scroll or pointer move.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !animOn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--scroll", String(max > 0 ? window.scrollY / max : 0));
      el.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animOn]);

  const ticker = `${groom} ${amp} ${bride} · ${formatWeddingDate(weddingData.weddingDate, language)} · `;

  return (
    <div ref={rootRef} className="aurora-shell">
      <div className="aurora-progress" aria-hidden="true" />
      <div className="aurora-bg" aria-hidden="true">
        <span className="aurora-blob aurora-blob-1" />
        <span className="aurora-blob aurora-blob-2" />
        <span className="aurora-blob aurora-blob-3" />
        <span className="aurora-grid" />
        <span className="aurora-spotlight" />
      </div>

      <section className="aurora-hero relative flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center overflow-hidden">
        <div className="aurora-hero-inner">
          {guest && (
            <p className={cn("aurora-pill mb-6", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p className={cn("aurora-kicker mb-6", fade("animate-fade-in-up delay-100"))}>
            {t.weInviteYou}
          </p>

          <h1 className="aurora-name">
            <SplitName text={groom} start={0} on={animOn} />
            <span className={cn("aurora-amp", fade("animate-fade-in-up delay-500"))}>{amp}</span>
            <SplitName text={bride} start={groom.length + 4} on={animOn} />
          </h1>

          <div className={cn("aurora-date mt-8", fade("animate-fade-in-up delay-700"))}>
            <Calendar className="w-4 h-4" />
            <span>
              {formatWeddingDate(weddingData.weddingDate, language)}
              {" · "}
              {formatWeddingTime(weddingData.weddingTime)}
            </span>
          </div>

          {weddingData.showCountdown && (
            <div className={cn("mt-10", fade("animate-fade-in-up delay-1000"))}>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>

        <ChevronDown className="aurora-scroll-cue w-6 h-6" aria-hidden="true" />
      </section>

      {/* Endless marquee ribbon */}
      <div className="aurora-marquee" aria-hidden="true">
        <div className="aurora-marquee-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>{ticker.repeat(2)}</span>
          ))}
        </div>
      </div>

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order}
      />
    </div>
  );
};
