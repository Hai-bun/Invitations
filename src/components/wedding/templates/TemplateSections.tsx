import { Fragment, type ReactNode } from "react";
import type { WeddingData, Guest } from "@/lib/weddingStore";
import type { Language } from "@/lib/i18n";
import { CoupleSection } from "../CoupleSection";
import { LocationSection } from "../LocationSection";
import { PhotoGallery } from "../PhotoGallery";
import { GiftSection } from "../GiftSection";
import { RSVPSection } from "../RSVPSection";
import { Footer } from "../Footer";

export type SectionKey =
  | "couple"
  | "location"
  | "gallery"
  | "gift"
  | "rsvp"
  | "footer";

const DEFAULT_ORDER: SectionKey[] = [
  "couple",
  "location",
  "gallery",
  "gift",
  "rsvp",
  "footer",
];

interface TemplateSectionsProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
  order?: SectionKey[];
}

/**
 * Renders the shared invitation sections (couple, location, gallery, gift,
 * rsvp, footer) in a given order. Each template supplies its own hero and
 * visual chrome, then drops this in for the repeating content — the per-template
 * look comes from the `template-*` CSS scope on the page root.
 */
export const TemplateSections = ({
  weddingData,
  guest,
  language,
  order = DEFAULT_ORDER,
}: TemplateSectionsProps) => {
  const nodes: Record<SectionKey, ReactNode> = {
    couple: (
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
    ),
    location: (
      <LocationSection
        eventTitle={weddingData.eventTitle}
        eventAddress={weddingData.eventAddress}
        eventMapUrl={weddingData.eventMapUrl}
        language={language}
      />
    ),
    gallery: <PhotoGallery photos={weddingData.photos} language={language} />,
    gift: (
      <GiftSection
        khqrImage={weddingData.khqrImage}
        enabled={weddingData.giftEnabled}
        language={language}
      />
    ),
    rsvp: (
      <RSVPSection
        guestId={guest?.id}
        guestName={guest?.name}
        language={language}
      />
    ),
    footer: (
      <Footer
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        socialLinks={weddingData.socialLinks}
        language={language}
      />
    ),
  };

  return (
    <>
      {order.map((key) => (
        <Fragment key={key}>{nodes[key]}</Fragment>
      ))}
    </>
  );
};

/** Language-aware display names for the couple, shared by template heroes. */
export const getCoupleDisplay = (
  weddingData: WeddingData,
  language: Language,
) => ({
  groom:
    language === "km" && weddingData.groomNameKh
      ? weddingData.groomNameKh
      : weddingData.groomName,
  bride:
    language === "km" && weddingData.brideNameKh
      ? weddingData.brideNameKh
      : weddingData.brideName,
});
