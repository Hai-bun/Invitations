import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Heart, Calendar } from "lucide-react";
import { getTemplate } from "@/lib/templateConfig";
import { applyTheme, ThemeType } from "@/lib/themeConfig";
import { WelcomePopup } from "@/components/wedding/WelcomePopup";
import { useWeddingData, useGuest } from "@/hooks/use-wedding-data";
import { preloadImages } from "@/lib/preloadImage";
import {
  Language,
  getStoredLanguage,
  getTranslations,
} from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";

const GuestInvite = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  const { data: weddingData, isLoading } = useWeddingData();
  const { data: guest } = useGuest(guestId);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  // Match the couple's chosen theme + custom fonts on this cover too.
  useEffect(() => {
    if (!weddingData) return;
    applyTheme(weddingData.theme as ThemeType, {
      headingFont: weddingData.headingFont,
      bodyFont: weddingData.bodyFont,
      nameFont: weddingData.nameFont,
    });
  }, [weddingData]);

  // Warm the cache for the heavy media on the full invitation while the guest
  // is still looking at the envelope, so it's ready the moment they open it.
  useEffect(() => {
    if (!weddingData) return;
    preloadImages([
      weddingData.backgroundImage,
      weddingData.khqrImage,
      ...weddingData.photos.slice(0, 6),
    ]);
  }, [weddingData]);

  if (isLoading || !weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-primary animate-heartbeat" />
        </div>
      </div>
    );
  }

  const t = getTranslations(language);
  const template = getTemplate(weddingData.template);

  const displayGroom =
    language === "km" && weddingData.groomNameKh
      ? weddingData.groomNameKh
      : weddingData.groomName;
  const displayBride =
    language === "km" && weddingData.brideNameKh
      ? weddingData.brideNameKh
      : weddingData.brideName;
  const amp = language === "km" ? "និង" : "&";

  const bgMedia = weddingData.backgroundImage || weddingData.photos[0] || "";
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(bgMedia);

  return (
    <div className="guest-invite min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background media */}
      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={bgMedia}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : bgMedia ? (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${bgMedia})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
      )}
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />

      {template.features.showPetals && <FloatingPetals />}

      <LanguageSwitcher
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />

      <WelcomePopup
        guestName={guest?.name}
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        message={weddingData.welcomePopupMessage}
        enabled={weddingData.welcomePopupEnabled}
        language={language}
      />

      {/* Glass envelope card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="rounded-[2rem] border border-white/25 bg-white/10 backdrop-blur-xl shadow-2xl px-7 py-12 sm:px-10 text-center text-white">
          {/* Seal */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary shadow-elevated flex items-center justify-center ring-4 ring-white/30">
              <Heart
                className="w-9 h-9 text-primary-foreground animate-heartbeat"
                fill="currentColor"
              />
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-white/80 mb-4 animate-fade-in-up delay-100">
            {t.welcomeTitle}
          </p>

          {guest && (
            <h1 className="font-script text-4xl sm:text-5xl mb-5 animate-fade-in-up delay-200">
              {t.dearGuest} {guest.name}
            </h1>
          )}

          <p className="font-serif text-base text-white/85 mb-7 animate-fade-in-up delay-300">
            {t.weInviteYou}
          </p>

          {/* Couple names */}
          <div className="mb-7 animate-fade-in-up delay-500">
            <h2 className="font-script text-4xl sm:text-5xl leading-tight">
              {displayGroom}
            </h2>
            <p className="font-serif text-2xl my-1 text-white/90">{amp}</p>
            <h2 className="font-script text-4xl sm:text-5xl leading-tight">
              {displayBride}
            </h2>
          </div>

          {/* Date */}
          <div className="inline-flex items-center gap-2 text-sm text-white/85 font-serif mb-9 animate-fade-in-up delay-700">
            <Calendar className="w-4 h-4" />
            <span>
              {formatWeddingDate(weddingData.weddingDate, language)}
              {" · "}
              {formatWeddingTime(weddingData.weddingTime)}
            </span>
          </div>

          {/* Open button */}
          <div>
            <Button
              onClick={() => navigate(`/wedding/${guestId || ""}`)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-6 text-base shadow-elevated animate-fade-in-up delay-700">
              <Heart className="w-4 h-4 mr-2" fill="currentColor" />
              {t.openInvitation}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs tracking-[0.2em] uppercase text-white/70 mt-6">
          {t.madeWithLove}
        </p>
      </div>
    </div>
  );
};

export default GuestInvite;
