import { Heart } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import type { StoryConfig } from "@/lib/weddingStore";
import { getTranslations, type Language, getStoredLanguage } from "@/lib/i18n";

interface StorySectionProps {
  story: StoryConfig;
  language?: Language;
}

export const StorySection = ({ story, language }: StorySectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  if (!story?.enabled || !story.text?.trim()) return null;

  return (
    <section id="story" className="scroll-reveal py-16 px-4 bg-card">
      <div className="max-w-2xl mx-auto text-center">
        <Heart className="w-10 h-10 text-primary mx-auto mb-4" fill="currentColor" />
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {story.title?.trim() || t.ourStory}
        </h2>
        <OrnamentDivider className="mb-6" />
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-serif text-lg">
          {story.text}
        </p>
      </div>
    </section>
  );
};
