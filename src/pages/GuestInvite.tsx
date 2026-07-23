import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWeddingData,
  getGuestById,
  Guest,
  WeddingData,
} from "@/lib/weddingStore";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getTemplate } from "@/lib/templateConfig";
import { WelcomePopup } from "@/components/wedding/WelcomePopup";

const GuestInvite = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWeddingData = async () => {
      const data = await getWeddingData();
      setWeddingData(data);

      if (guestId) {
        const foundGuest = await getGuestById(guestId);
        setGuest(foundGuest);
      }

      setIsLoading(false);
    };

    loadWeddingData();
  }, [guestId]);

  if (isLoading || !weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-primary animate-heartbeat" />
        </div>
      </div>
    );
  }

  const template = getTemplate(weddingData.template);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <WelcomePopup
        guestName={guest?.name}
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        message={weddingData.welcomePopupMessage}
        enabled={weddingData.welcomePopupEnabled}
      />
      {template.features.showPetals && <FloatingPetals />}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Invitation Envelope Effect */}
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Seal */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gold-gradient shadow-elevated flex items-center justify-center">
              <Heart
                className="w-10 h-10 text-primary-foreground"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Greeting */}
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            You Are Invited
          </p>

          {guest && (
            <h1 className="font-script text-3xl sm:text-4xl text-foreground mb-6 animate-fade-in-up delay-200">
              Dear {guest.name}
            </h1>
          )}

          <p className="font-serif text-lg text-foreground/80 mb-8 animate-fade-in-up delay-300">
            You are warmly invited to celebrate the wedding of
          </p>

          {/* Couple Names */}
          <div className="mb-8 animate-fade-in-up delay-500">
            <h2 className="font-script text-4xl sm:text-5xl text-foreground mb-2">
              {weddingData.groomName}
            </h2>
            <p className="font-serif text-2xl text-primary">&</p>
            <h2 className="font-script text-4xl sm:text-5xl text-foreground mt-2">
              {weddingData.brideName}
            </h2>
          </div>

          {/* Date */}
          <p className="font-serif text-lg text-muted-foreground mb-12 animate-fade-in-up delay-700">
            {formatDate(weddingData.weddingDate)}
          </p>

          {/* Open Button */}
          <Button
            onClick={() => navigate(`/wedding/${guestId || ""}`)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg shadow-elevated animate-fade-in-up delay-700 animate-heartbeat">
            Open Invitation
          </Button>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 text-xs text-muted-foreground/60">
          With Love & Joy
        </p>
      </div>
    </div>
  );
};

export default GuestInvite;
