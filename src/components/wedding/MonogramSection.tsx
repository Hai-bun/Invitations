import { FadeInImage } from "@/components/ui/FadeInImage";
import type { Language } from "@/lib/i18n";

interface MonogramSectionProps {
  image: string;
  language?: Language;
}

// Shows the couple's uploaded monogram / crest, centred at the top of the
// content. Renders nothing until an image is set (opt-in by presence).
export const MonogramSection = ({ image }: MonogramSectionProps) => {
  if (!image) return null;

  return (
    <section className="monogram-section scroll-reveal py-12 px-4">
      <div className="max-w-md mx-auto flex justify-center">
        <FadeInImage
          src={image}
          alt="Wedding monogram"
          className="w-full max-w-[300px] object-contain"
        />
      </div>
    </section>
  );
};
