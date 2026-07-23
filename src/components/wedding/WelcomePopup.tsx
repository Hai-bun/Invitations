import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface WelcomePopupProps {
  guestName?: string;
  groomName: string;
  brideName: string;
  message: string;
  enabled: boolean;
  language?: Language;
}

export const WelcomePopup = ({ 
  guestName, 
  groomName, 
  brideName, 
  message, 
  enabled,
  language 
}: WelcomePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  useEffect(() => {
    if (enabled) {
      // Small delay before showing popup for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center bg-gradient-to-b from-background to-secondary/20 border-primary/20">
        {/* Decorative header */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>

        <DialogHeader className="pt-4">
          <DialogTitle className="font-script text-3xl text-foreground text-center">
            {guestName ? `${t.dearGuest} ${guestName}` : t.welcomeGuest}
          </DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <Heart className="w-5 h-5 text-primary animate-heartbeat" fill="currentColor" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            
            <p className="font-serif text-lg text-foreground">
              {t.welcomeTitle}
            </p>
            
            <div className="py-2">
              <p className="font-script text-2xl text-primary">{groomName}</p>
              <p className="text-muted-foreground">&</p>
              <p className="font-script text-2xl text-primary">{brideName}</p>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {message}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Heart className="w-4 h-4 mr-2" fill="currentColor" />
            {t.openInvitation}
          </Button>
        </div>

        {/* Decorative footer */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-1 h-1 rounded-full bg-primary/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <div className="w-1 h-1 rounded-full bg-primary/30" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
