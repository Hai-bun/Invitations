import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageProvider";

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: Language) => void;
  currentLanguage?: Language;
}

export const LanguageSwitcher = ({
  onLanguageChange,
  currentLanguage,
}: LanguageSwitcherProps) => {
  const { language: lang, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10">
          <Globe className="w-4 h-4 mr-2" />
          {lang === "en" ? "EN" : "ខ្មែរ"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={lang === "en" ? "bg-primary/10" : ""}>
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("km")}
          className={lang === "km" ? "bg-primary/10" : ""}>
          <span className="mr-2">🇰🇭</span>
          ភាសាខ្មែរ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
