import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { Heart } from "lucide-react";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface CoupleSectionProps {
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  language?: Language;
}

export const CoupleSection = ({ groomName, brideName, groomParents, brideParents, language }: CoupleSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  return (
    <section className="py-16 px-4 text-center bg-romantic-gradient">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-in-up">
          {t.theCouple}
        </p>
        
        <OrnamentDivider className="mb-8" />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Groom */}
          <div className="animate-fade-in-up delay-200">
            <h3 className="font-script text-4xl sm:text-5xl text-foreground mb-3">
              {groomName}
            </h3>
            <p className="text-sm text-muted-foreground tracking-wide">
              {t.sonOf}
            </p>
            <p className="text-base text-foreground/80 font-serif italic">
              {groomParents}
            </p>
          </div>
          
          {/* Heart Divider - visible on mobile */}
          <div className="md:hidden flex justify-center">
            <Heart className="w-8 h-8 text-primary animate-heartbeat" fill="currentColor" />
          </div>
          
          {/* Bride */}
          <div className="animate-fade-in-up delay-300">
            <h3 className="font-script text-4xl sm:text-5xl text-foreground mb-3">
              {brideName}
            </h3>
            <p className="text-sm text-muted-foreground tracking-wide">
              {t.daughterOf}
            </p>
            <p className="text-base text-foreground/80 font-serif italic">
              {brideParents}
            </p>
          </div>
        </div>
        
        {/* Heart Divider - visible on desktop */}
        <div className="hidden md:flex justify-center mt-8">
          <Heart className="w-10 h-10 text-primary animate-heartbeat" fill="currentColor" />
        </div>
        
        <OrnamentDivider className="mt-8" />
      </div>
    </section>
  );
};
