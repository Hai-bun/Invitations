import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { TemplateType } from "@/lib/weddingStore";
import { TEMPLATES, TemplateConfig } from "@/lib/templateConfig";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templatePreviews: Record<TemplateType, React.ReactNode> = {
  classic: (
    <div className="h-full bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-2">
      <div className="w-8 h-0.5 bg-amber-400 mb-1" />
      <div className="text-xs font-serif text-amber-800">A & B</div>
      <div className="w-8 h-0.5 bg-amber-400 mt-1" />
      <div className="mt-2 space-y-0.5">
        <div className="w-10 h-1 bg-amber-200 rounded" />
        <div className="w-8 h-1 bg-amber-200 rounded mx-auto" />
      </div>
    </div>
  ),
  modern: (
    <div className="h-full bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-2">
      <div className="text-xs font-bold text-slate-900 tracking-widest">A + B</div>
      <div className="text-[8px] text-slate-500 mt-1 tracking-wider">02.14.2026</div>
      <div className="mt-2 w-8 h-px bg-slate-300" />
    </div>
  ),
  elegant: (
    <div className="h-full bg-gradient-to-br from-rose-50 via-white to-rose-100 flex">
      <div className="w-1/2 bg-rose-200/30" />
      <div className="w-1/2 flex flex-col items-center justify-center p-1">
        <div className="text-[8px] font-serif text-rose-800">Anna</div>
        <div className="text-[6px] text-rose-400">&</div>
        <div className="text-[8px] font-serif text-rose-800">Ben</div>
      </div>
    </div>
  ),
  romantic: (
    <div className="h-full bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-pink-300 animate-pulse" />
      <div className="absolute bottom-2 right-1 w-1.5 h-1.5 rounded-full bg-pink-200 animate-pulse" />
      <div className="text-xs font-script text-pink-700">A & B</div>
      <div className="text-[6px] text-pink-400 mt-0.5">Forever</div>
    </div>
  ),
};

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(TEMPLATES).map((template: TemplateConfig) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-lg",
            selectedTemplate === template.id
              ? "ring-2 ring-primary shadow-md"
              : "hover:ring-1 hover:ring-primary/50"
          )}
          onClick={() => onTemplateChange(template.id)}
        >
          <CardContent className="p-0">
            {/* Preview */}
            <div className="h-24 relative">
              {templatePreviews[template.id]}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{template.preview}</span>
                <h3 className="font-medium text-sm text-foreground">{template.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {template.features.showPetals && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Petals
                  </Badge>
                )}
                {template.features.parallaxHero && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Parallax
                  </Badge>
                )}
                {template.features.showOrnaments && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Ornate
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
