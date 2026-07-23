import { THEMES, ThemeType, ThemeConfig } from "@/lib/themeConfig";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Palette, Sparkles, Flower2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  selectedTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const themeIcons: Record<ThemeType, React.ReactNode> = {
  luxury: <Crown className="w-5 h-5" />,
  minimal: <Palette className="w-5 h-5" />,
  traditional: <Sparkles className="w-5 h-5" />,
  floral: <Flower2 className="w-5 h-5" />,
};

export const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {Object.values(THEMES).map((theme: ThemeConfig) => (
        <Card
          key={theme.id}
          className={cn(
            "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
            selectedTheme === theme.id
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onThemeChange(theme.id)}
        >
          <CardContent className="p-4">
            {/* Theme Preview */}
            <div 
              className="h-24 rounded-lg mb-4 relative overflow-hidden"
              style={{ background: theme.preview }}
            >
              {/* Decorative elements based on theme */}
              {theme.style.decorativeElements && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {theme.id === 'luxury' && (
                    <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border border-white/60 rounded-full" />
                    </div>
                  )}
                  {theme.id === 'traditional' && (
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-yellow-400/60 rounded-full" />
                      <div className="w-4 h-4 bg-red-700/60 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400/60 rounded-full" />
                    </div>
                  )}
                  {theme.id === 'floral' && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-3 h-3 bg-pink-300/60 rounded-full"
                          style={{ 
                            transform: `rotate(${i * 72}deg) translateY(-8px)`,
                            transformOrigin: 'center 12px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Minimal theme line decoration */}
              {theme.id === 'minimal' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-px bg-black/30" />
                </div>
              )}

              {/* Selected indicator */}
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Theme Info */}
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                selectedTheme === theme.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {themeIcons[theme.id]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold text-foreground truncate">
                  {theme.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {theme.description}
                </p>
              </div>
            </div>

            {/* Color Palette Preview */}
            <div className="flex gap-1 mt-3">
              <div 
                className="h-4 flex-1 rounded-l-full"
                style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                title="Primary"
              />
              <div 
                className="h-4 flex-1"
                style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                title="Secondary"
              />
              <div 
                className="h-4 flex-1"
                style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                title="Accent"
              />
              <div 
                className="h-4 flex-1 rounded-r-full"
                style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                title="Background"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
