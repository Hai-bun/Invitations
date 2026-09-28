// Wedding invitation template configurations

import { TemplateType } from "./weddingStore";

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  heroLayout: "centered" | "split" | "minimal" | "overlay";
  sectionOrder: string[];
  features: {
    showOrnaments: boolean;
    showPetals: boolean;
    parallaxHero: boolean;
    animatedEntrance: boolean;
  };
}

export const TEMPLATES: Record<TemplateType, TemplateConfig> = {
  classic: {
    id: "classic",
    name: "Classic Elegance",
    description:
      "Timeless design with ornate decorations and traditional layout",
    preview: "🏛️",
    heroLayout: "centered",
    sectionOrder: [
      "hero",
      "couple",
      "location",
      "gallery",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: true,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  modern: {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean lines with bold typography and minimal ornamentation",
    preview: "◻️",
    heroLayout: "minimal",
    sectionOrder: [
      "hero",
      "couple",
      "location",
      "gallery",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: false,
      showPetals: false,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  elegant: {
    id: "elegant",
    name: "Elegant Split",
    description: "Sophisticated split-screen layout with photo emphasis",
    preview: "✨",
    heroLayout: "split",
    sectionOrder: [
      "hero",
      "couple",
      "gallery",
      "location",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: false,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
  romantic: {
    id: "romantic",
    name: "Romantic Dream",
    description: "Dreamy design with floating elements and soft transitions",
    preview: "💕",
    heroLayout: "overlay",
    sectionOrder: [
      "hero",
      "couple",
      "location",
      "gallery",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: true,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
  video: {
    id: "video",
    name: "Video Cinematic",
    description: "Cinematic hero style with a dramatic, motion-inspired layout",
    preview: "🎬",
    heroLayout: "overlay",
    sectionOrder: [
      "hero",
      "couple",
      "gallery",
      "location",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: false,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
  reel: {
    id: "reel",
    name: "Film Reel Story",
    description:
      "Scroll-snapping film chapters with letterbox framing, grain and sound",
    preview: "🎞️",
    heroLayout: "overlay",
    sectionOrder: [
      "hero",
      "couple",
      "gallery",
      "location",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: false,
      showPetals: false,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
  royal: {
    id: "royal",
    name: "Royal Khmer",
    description:
      "Ornate gold framing and temple-inspired motifs on deep royal tones",
    preview: "👑",
    heroLayout: "centered",
    sectionOrder: [
      "hero",
      "couple",
      "location",
      "gallery",
      "gift",
      "rsvp",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: false,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  editorial: {
    id: "editorial",
    name: "Editorial Magazine",
    description:
      "Bold oversized serif, asymmetric layout and numbered magazine sections",
    preview: "📰",
    heroLayout: "split",
    sectionOrder: [
      "hero",
      "couple",
      "gallery",
      "location",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: false,
      showPetals: false,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  botanical: {
    id: "botanical",
    name: "Botanical Garden",
    description:
      "Soft watercolor tones with leafy floral frames around every section",
    preview: "🌿",
    heroLayout: "centered",
    sectionOrder: [
      "hero",
      "couple",
      "gallery",
      "location",
      "gift",
      "rsvp",
      "footer",
    ],
    features: {
      showOrnaments: true,
      showPetals: true,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  split: {
    id: "split",
    name: "Split-Screen Elegant",
    description:
      "Full-height photo beside the couple details in a true split layout",
    preview: "🖼️",
    heroLayout: "split",
    sectionOrder: [
      "hero",
      "couple",
      "location",
      "gallery",
      "rsvp",
      "gift",
      "footer",
    ],
    features: {
      showOrnaments: false,
      showPetals: false,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
};

export const getTemplate = (templateId: TemplateType): TemplateConfig => {
  return TEMPLATES[templateId] || TEMPLATES.classic;
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(TEMPLATES);
};
