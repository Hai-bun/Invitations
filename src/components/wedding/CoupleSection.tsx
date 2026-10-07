import { FitText } from "@/components/ui/FitText";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { Heart } from "lucide-react";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface CoupleSectionProps {
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  groomNameKh?: string;
  brideNameKh?: string;
  groomParentsKh?: string;
  brideParentsKh?: string;
  language?: Language;
}

export const CoupleSection = ({
  groomName,
  brideName,
  groomParents,
  brideParents,
  groomNameKh,
  brideNameKh,
  groomParentsKh,
  brideParentsKh,
  language,
}: CoupleSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  const displayGroomName =
    lang === "km" && groomNameKh ? groomNameKh : groomName;
  const displayBrideName =
    lang === "km" && brideNameKh ? brideNameKh : brideName;
  // Tidy hand-typed Latin names: "Mr.HEANG VANNA& Mrs." -> "Mr. HEANG VANNA & Mrs."
  const tidy = (s: string) =>
    s
      .replace(/\s*&\s*/g, " & ")
      .replace(/\b(Mr|Mrs|Ms|Dr)\.(?=\S)/g, "$1. ")
      .trim();
  const displayGroomParents = tidy(
    lang === "km" && groomParentsKh ? groomParentsKh : groomParents,
  );
  const displayBrideParents = tidy(
    lang === "km" && brideParentsKh ? brideParentsKh : brideParents,
  );

  return (
    <section className="couple-section scroll-reveal py-16 px-4 text-center bg-romantic-gradient">
      <div className="max-w-4xl mx-auto">
        <p className="couple-eyebrow text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-in-up">
          {t.theCouple}
        </p>

        <OrnamentDivider className="mb-8" />

        <div className="couple-grid grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Groom */}
          <div className="couple-person couple-groom min-w-0 animate-fade-in-up delay-200">
            <h3 className="couple-name font-script text-4xl sm:text-5xl text-foreground mb-3">
              <FitText>{displayGroomName}</FitText>
            </h3>
            <p className="couple-role text-sm text-muted-foreground tracking-wide">
              {t.sonOf}
            </p>
            <p className="couple-parents text-base text-foreground/80 font-serif italic">
              {displayGroomParents}
            </p>
          </div>

          {/* Heart Divider - visible on mobile */}
          <div className="couple-heart-mobile md:hidden flex justify-center">
            <Heart
              className="w-8 h-8 text-primary animate-heartbeat"
              fill="currentColor"
            />
          </div>

          {/* Bride */}
          <div className="couple-person couple-bride min-w-0 animate-fade-in-up delay-300">
            <h3 className="couple-name font-script text-4xl sm:text-5xl text-foreground mb-3">
              <FitText>{displayBrideName}</FitText>
            </h3>
            <p className="couple-role text-sm text-muted-foreground tracking-wide">
              {t.daughterOf}
            </p>
            <p className="couple-parents text-base text-foreground/80 font-serif italic">
              {displayBrideParents}
            </p>
          </div>
        </div>

        {/* Heart Divider - visible on desktop */}
        <div className="couple-heart hidden md:flex justify-center mt-8">
          <Heart
            className="w-10 h-10 text-primary animate-heartbeat"
            fill="currentColor"
          />
        </div>

        <OrnamentDivider className="mt-8" />
      </div>
    </section>
  );
};
