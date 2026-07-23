// Theme configuration for wedding invitation
export type ThemeType = "luxury" | "minimal" | "traditional" | "floral";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
    script: string;
  };
  style: {
    borderRadius: string;
    shadowIntensity: "subtle" | "medium" | "dramatic";
    decorativeElements: boolean;
    gradientStyle: string;
  };
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  luxury: {
    id: "luxury",
    name: "Luxury Rose Gold",
    description: "Elegant rose gold with champagne accents",
    preview: "linear-gradient(135deg, #f5e6d3 0%, #c9a87c 50%, #d4a574 100%)",
    colors: {
      primary: "15 45% 65%", // Rose gold
      secondary: "35 35% 90%", // Champagne
      accent: "38 70% 55%", // Gold
      background: "30 25% 98%", // Ivory
      foreground: "20 20% 15%", // Dark brown
      muted: "20 25% 95%", // Soft blush
      card: "30 30% 99%", // Warm white
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0.75rem",
      shadowIntensity: "medium",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(350 35% 92%) 0%, hsl(30 25% 98%) 50%, hsl(38 45% 85%) 100%)",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal Elegance",
    description: "Clean, modern black and white aesthetic",
    preview: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #e0e0e0 100%)",
    colors: {
      primary: "0 0% 15%", // Near black
      secondary: "0 0% 96%", // Off white
      accent: "0 0% 40%", // Dark gray
      background: "0 0% 100%", // Pure white
      foreground: "0 0% 10%", // Black
      muted: "0 0% 95%", // Light gray
      card: "0 0% 99%", // White
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0",
      shadowIntensity: "subtle",
      decorativeElements: false,
      gradientStyle:
        "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 96%) 100%)",
    },
  },
  traditional: {
    id: "traditional",
    name: "Traditional Khmer",
    description: "Rich burgundy and gold inspired by Cambodian tradition",
    preview: "linear-gradient(135deg, #8B0000 0%, #DAA520 50%, #FFD700 100%)",
    colors: {
      primary: "0 70% 35%", // Deep burgundy/red
      secondary: "43 75% 50%", // Royal gold
      accent: "48 95% 55%", // Bright gold
      background: "40 40% 97%", // Warm cream
      foreground: "0 50% 15%", // Dark burgundy
      muted: "40 30% 92%", // Warm beige
      card: "45 50% 98%", // Cream
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0.5rem",
      shadowIntensity: "dramatic",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(40 40% 97%) 0%, hsl(43 60% 90%) 50%, hsl(40 40% 97%) 100%)",
    },
  },
  floral: {
    id: "floral",
    name: "Garden Floral",
    description: "Soft sage green with blush pink florals",
    preview: "linear-gradient(135deg, #E8F5E9 0%, #F8BBD9 50%, #FFF3E0 100%)",
    colors: {
      primary: "340 55% 65%", // Dusty pink
      secondary: "140 30% 85%", // Soft sage
      accent: "340 70% 70%", // Rose pink
      background: "85 30% 97%", // Soft cream green
      foreground: "150 25% 20%", // Deep forest
      muted: "100 20% 93%", // Light sage
      card: "80 40% 98%", // Warm white green
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "1rem",
      shadowIntensity: "subtle",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(140 30% 95%) 0%, hsl(340 40% 95%) 50%, hsl(85 30% 97%) 100%)",
    },
  },
};

export const getTheme = (themeId: ThemeType): ThemeConfig => {
  return THEMES[themeId] || THEMES.luxury;
};

export const applyTheme = (themeId: ThemeType): void => {
  const theme = getTheme(themeId);
  const root = document.documentElement;

  // Apply colors
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--secondary", theme.colors.secondary);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--background", theme.colors.background);
  root.style.setProperty("--foreground", theme.colors.foreground);
  root.style.setProperty("--muted", theme.colors.muted);
  root.style.setProperty("--card", theme.colors.card);
  root.style.setProperty("--card-foreground", theme.colors.foreground);
  root.style.setProperty("--popover", theme.colors.card);
  root.style.setProperty("--popover-foreground", theme.colors.foreground);

  // Apply ring color (for focus states)
  root.style.setProperty("--ring", theme.colors.primary);
  root.style.setProperty("--hero-gradient", theme.style.gradientStyle);

  // Store theme-specific classes
  root.setAttribute("data-theme", themeId);
  root.style.setProperty("--radius", theme.style.borderRadius);
};

export const getThemeClasses = (themeId: ThemeType): string => {
  const classes: string[] = [];

  switch (themeId) {
    case "minimal":
      classes.push("theme-minimal");
      break;
    case "traditional":
      classes.push("theme-traditional");
      break;
    case "floral":
      classes.push("theme-floral");
      break;
    default:
      classes.push("theme-luxury");
  }

  return classes.join(" ");
};
