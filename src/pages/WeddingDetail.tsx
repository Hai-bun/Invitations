import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getWeddingData,
  getGuestById,
  WeddingData,
  Guest,
} from "@/lib/weddingStore";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { CountdownTimer } from "@/components/wedding/CountdownTimer";
import { CoupleSection } from "@/components/wedding/CoupleSection";
import { LocationSection } from "@/components/wedding/LocationSection";
import { PhotoGallery } from "@/components/wedding/PhotoGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { GiftSection } from "@/components/wedding/GiftSection";
import { Footer } from "@/components/wedding/Footer";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Heart, Calendar } from "lucide-react";
import { applyTheme, getTheme, ThemeType } from "@/lib/themeConfig";
import { getTemplate } from "@/lib/templateConfig";
import { cn } from "@/lib/utils";
import { Language, getStoredLanguage, getTranslations } from "@/lib/i18n";

const WeddingDetail = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  useEffect(() => {
    const loadWeddingData = async () => {
      const data = await getWeddingData();
      setWeddingData(data);
      applyTheme(data.theme as ThemeType);

      if (guestId) {
        const foundGuest = await getGuestById(guestId);
        setGuest(foundGuest);
      }
    };

    loadWeddingData();
  }, [guestId]);

  // Set animation speed CSS variable whenever speedMultiplier changes
  const speedMultiplier =
    weddingData?.animations?.speed === "slow"
      ? 1.6
      : weddingData?.animations?.speed === "fast"
        ? 0.6
        : 1;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--anim-speed",
      String(speedMultiplier),
    );
  }, [speedMultiplier]);

  if (!weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Loading wedding invitation...
        </div>
      </div>
    );
  }

  const t = getTranslations(language);
  const theme = getTheme(weddingData.theme as ThemeType);
  const template = getTemplate(weddingData.template);
  const anim = weddingData.animations ?? {
    enabled: true,
    floatingPetals: true,
    heartbeat: true,
    fadeInOnScroll: true,
    photoHoverZoom: true,
    heroFloatIndicator: true,
    speed: "normal" as const,
  };
  const animOn = anim.enabled;
  const showDecorations = template.features.showOrnaments;
  const showPetals =
    animOn && anim.floatingPetals && template.features.showPetals;
  const fadeCls = (base: string) => (animOn && anim.fadeInOnScroll ? base : "");

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (language === "km") {
      try {
        return new Intl.DateTimeFormat("km-KH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date);
      } catch (e) {
        // Fallback: manual Khmer month/weekday names
        const weekdays = [
          "អាទិត្យ",
          "ច័ន្ទ",
          "អង្គារ",
          "ពុធ",
          "ព្រហស្បតិ៍",
          "សុក្រ",
          "សៅរ៍",
        ];
        const months = [
          "មករា",
          "កុម្ភៈ",
          "មីនា",
          "មេសា",
          "ឧសភា",
          "មិថុនា",
          "កក្កដា",
          "សីហា",
          "កញ្ញា",
          "តុលា",
          "វិច្ឆិកា",
          "ធ្នូ",
        ];
        const w = weekdays[date.getDay()];
        const d = date.getDate();
        const m = months[date.getMonth()];
        const y = date.getFullYear();
        return `${w} ${d} ${m} ${y}`;
      }
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background wedding-root",
        `theme-${weddingData.theme}`,
        `template-${weddingData.template}`,
        !animOn && "animations-off",
        (!animOn || !anim.photoHoverZoom) && "no-photo-zoom",
      )}>
      {/* Language Switcher */}
      <LanguageSwitcher
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />

      {showPetals && <FloatingPetals />}

      {/* Hero Section */}
      <section
        className={cn(
          "relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--hero-gradient)]",
          template.heroLayout === "minimal" && "min-h-[80vh]",
        )}>
        <div className="relative z-10 text-center px-4 py-12">
          {/* Welcome Text */}
          {guest && (
            <p
              className={cn(
                "text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4",
                fadeCls("animate-fade-in-up"),
              )}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <p
            className={cn(
              "font-serif text-lg text-muted-foreground mb-6",
              fadeCls("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          {/* Couple Names */}
          <div className="mb-8">
            {/** choose names per language */}
            {(() => {
              const displayGroom =
                language === "km" && weddingData.groomNameKh
                  ? weddingData.groomNameKh
                  : weddingData.groomName;
              const displayBride =
                language === "km" && weddingData.brideNameKh
                  ? weddingData.brideNameKh
                  : weddingData.brideName;
              return (
                <>
                  <h1
                    className={cn(
                      "font-script text-5xl sm:text-7xl text-foreground mb-4",
                      fadeCls("animate-fade-in-up delay-200"),
                    )}>
                    {displayGroom}
                  </h1>
                  <div
                    className={cn(
                      "flex items-center justify-center gap-4",
                      fadeCls("animate-fade-in-up delay-300"),
                    )}>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
                    <Heart
                      className={cn(
                        "w-6 h-6 text-primary",
                        animOn && anim.heartbeat && "animate-heartbeat",
                      )}
                      fill="currentColor"
                    />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
                  </div>
                  <h1
                    className={cn(
                      "font-script text-5xl sm:text-7xl text-foreground mt-4",
                      fadeCls("animate-fade-in-up delay-300"),
                    )}>
                    {displayBride}
                  </h1>
                </>
              );
            })()}
          </div>

          {showDecorations && (
            <OrnamentDivider
              className={fadeCls("animate-fade-in-up delay-500")}
            />
          )}

          {/* Date */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 text-muted-foreground mb-4",
              fadeCls("animate-fade-in-up delay-500"),
            )}>
            <Calendar className="w-5 h-5" />
            <p className="font-serif text-lg">
              {formatDate(weddingData.weddingDate)} at{" "}
              {formatTime(weddingData.weddingTime)}
            </p>
          </div>

          {/* Countdown */}
          {weddingData.showCountdown && (
            <div
              className={cn("mt-12", fadeCls("animate-fade-in-up delay-700"))}>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
                {t.countingDown}
              </p>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {animOn && anim.heroFloatIndicator && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-fade-in" />
            </div>
          </div>
        )}
      </section>

      {/* Couple & Family Section */}
      <CoupleSection
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        groomParents={weddingData.groomParents}
        brideParents={weddingData.brideParents}
        groomNameKh={weddingData.groomNameKh}
        brideNameKh={weddingData.brideNameKh}
        groomParentsKh={weddingData.groomParentsKh}
        brideParentsKh={weddingData.brideParentsKh}
        language={language}
      />

      {/* Location Section */}
      <LocationSection
        eventTitle={weddingData.eventTitle}
        eventAddress={weddingData.eventAddress}
        eventMapUrl={weddingData.eventMapUrl}
        language={language}
      />

      {/* Photo Gallery */}
      <PhotoGallery photos={weddingData.photos} language={language} />

      {/* Gift Section */}
      <GiftSection
        khqrImage={weddingData.khqrImage}
        enabled={weddingData.giftEnabled}
        language={language}
      />

      {/* RSVP Section */}
      <RSVPSection
        guestId={guest?.id}
        guestName={guest?.name}
        language={language}
      />

      {/* Footer with Social Links */}
      <Footer
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        socialLinks={weddingData.socialLinks}
        language={language}
      />
    </div>
  );
};

export default WeddingDetail;
