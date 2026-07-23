// Wedding invitation template configurations

import { TemplateType } from './weddingStore';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  heroLayout: 'centered' | 'split' | 'minimal' | 'overlay';
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
    id: 'classic',
    name: 'Classic Elegance',
    description: 'Timeless design with ornate decorations and traditional layout',
    preview: '🏛️',
    heroLayout: 'centered',
    sectionOrder: ['hero', 'couple', 'location', 'gallery', 'rsvp', 'gift', 'footer'],
    features: {
      showOrnaments: true,
      showPetals: true,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean lines with bold typography and minimal ornamentation',
    preview: '◻️',
    heroLayout: 'minimal',
    sectionOrder: ['hero', 'couple', 'location', 'gallery', 'rsvp', 'gift', 'footer'],
    features: {
      showOrnaments: false,
      showPetals: false,
      parallaxHero: false,
      animatedEntrance: true,
    },
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant Split',
    description: 'Sophisticated split-screen layout with photo emphasis',
    preview: '✨',
    heroLayout: 'split',
    sectionOrder: ['hero', 'couple', 'gallery', 'location', 'rsvp', 'gift', 'footer'],
    features: {
      showOrnaments: true,
      showPetals: false,
      parallaxHero: true,
      animatedEntrance: true,
    },
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic Dream',
    description: 'Dreamy design with floating elements and soft transitions',
    preview: '💕',
    heroLayout: 'overlay',
    sectionOrder: ['hero', 'couple', 'location', 'gallery', 'rsvp', 'gift', 'footer'],
    features: {
      showOrnaments: true,
      showPetals: true,
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
