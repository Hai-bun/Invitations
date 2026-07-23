import { Gift, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface GiftSectionProps {
  khqrImage: string;
  enabled: boolean;
  language?: Language;
}

export const GiftSection = ({ khqrImage, enabled, language }: GiftSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  if (!enabled) return null;

  const handleDownload = () => {
    if (!khqrImage) {
      toast.error("No KHQR image available");
      return;
    }
    
    const link = document.createElement('a');
    link.href = khqrImage;
    link.download = 'wedding-gift-khqr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("KHQR image downloaded!");
  };

  const handleShare = async () => {
    if (!khqrImage) {
      toast.error("No KHQR image available");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.weddingGift,
          text: t.scanQR,
          url: window.location.href,
        });
      } catch {
        toast.info("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <section className="py-16 px-4 bg-romantic-gradient">
      <div className="max-w-md mx-auto text-center">
        <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
        
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-2">
          {t.weddingGift}
        </h2>
        
        <p className="text-muted-foreground mb-8">
          {t.giftMessage}
        </p>

        {khqrImage ? (
          <div className="bg-card p-4 rounded-xl shadow-card mb-6 inline-block">
            <div className="bg-background rounded-lg p-2 overflow-hidden">
              <img
                src={khqrImage}
                alt="KHQR Code"
                className="w-56 h-auto mx-auto object-contain rounded"
                style={{ maxHeight: '280px' }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-xl shadow-card mb-6">
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">KHQR Code</p>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.save}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t.share}
          </Button>
        </div>
      </div>
    </section>
  );
};
