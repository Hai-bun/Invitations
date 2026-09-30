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
      <div className="text-xs font-bold text-slate-900 tracking-widest">
        A + B
      </div>
      <div className="text-[8px] text-slate-500 mt-1 tracking-wider">
        02.14.2026
      </div>
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
  video: (
    <div className="h-full bg-gradient-to-br from-slate-950 via-slate-800 to-rose-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.25),_transparent_55%)]" />
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[8px] text-white">
        ▶
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/80">
        Film
      </div>
      <div className="text-xs font-serif text-white mt-1">A & B</div>
      <div className="mt-2 w-10 h-0.5 bg-white/70" />
    </div>
  ),
  reel: (
    <div className="h-full bg-[#0a0a0c] flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-black" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black" />
      <div className="absolute top-0 bottom-0 left-0 w-1.5 flex flex-col justify-around items-center">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-1 h-1 rounded-[1px] bg-white/35" />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(233,196,141,0.22),_transparent_60%)]" />
      <div className="text-[6px] uppercase tracking-[0.35em] text-amber-200/70">
        Ch. 01
      </div>
      <div className="text-[11px] font-serif tracking-[0.18em] text-amber-50 mt-0.5">
        A &amp; B
      </div>
      <div className="mt-1 w-8 h-px bg-amber-200/60" />
    </div>
  ),
  royal: (
    <div className="h-full bg-gradient-to-br from-[#4a1118] via-[#2c0a10] to-[#1a0508] flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute inset-1.5 border border-[#c8a24c]/60 rounded-[2px]" />
      <div className="absolute inset-[7px] border border-[#c8a24c]/25 rounded-[2px]" />
      <div className="text-[6px] uppercase tracking-[0.3em] text-[#e7ce90]">
        Royal
      </div>
      <div className="text-[11px] font-script text-[#f7e6bf] mt-0.5">
        A &amp; B
      </div>
      <div className="mt-1 text-[8px] text-[#c8a24c]">✦</div>
    </div>
  ),
  editorial: (
    <div className="h-full bg-[#fcfbf9] flex flex-col justify-center p-2 relative overflow-hidden">
      <div className="text-[5px] uppercase tracking-[0.25em] text-neutral-800 flex justify-between">
        <span>Invited</span>
        <span>02·14</span>
      </div>
      <div className="h-0.5 bg-neutral-900 my-1" />
      <div className="text-[15px] leading-none font-serif font-medium text-neutral-900">
        Anna
      </div>
      <div className="text-[7px] italic font-serif text-neutral-400 leading-none">
        &amp;
      </div>
      <div className="text-[15px] leading-none font-serif font-medium text-neutral-900">
        Ben
      </div>
    </div>
  ),
  botanical: (
    <div className="h-full bg-gradient-to-b from-[#f2f6ec] to-[#f8eef0] flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-[#7d9b6a]">
        🌿
      </div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-[#7d9b6a] scale-x-[-1]">
        🌿
      </div>
      <div className="text-[5px] uppercase tracking-[0.25em] text-[#7d9b6a]">
        Invited
      </div>
      <div className="text-[12px] font-script text-[#3f4a38] mt-0.5">
        A &amp; B
      </div>
      <div className="text-[7px] italic font-serif text-[#d98c9c]">forever</div>
    </div>
  ),
  split: (
    <div className="h-full flex overflow-hidden">
      <div className="w-1/2 bg-gradient-to-br from-[#d9cbbb] to-[#b8a48d]" />
      <div className="w-1/2 bg-[#f7f5f2] flex flex-col items-center justify-center p-1">
        <div className="text-[9px] font-script text-neutral-800 leading-tight">
          Anna
        </div>
        <div className="flex items-center gap-0.5 my-0.5 text-[#b8865a]">
          <span className="w-2 h-px bg-current" />
          <span className="text-[6px] italic font-serif">&amp;</span>
          <span className="w-2 h-px bg-current" />
        </div>
        <div className="text-[9px] font-script text-neutral-800 leading-tight">
          Ben
        </div>
      </div>
    </div>
  ),
  artdeco: (
    <div className="h-full bg-[#0e0e13] flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute inset-1.5 border border-[#d4af50]/60" />
      <div className="w-8 h-0.5 bg-[repeating-linear-gradient(90deg,#d4af50_0_1px,transparent_1px_4px)]" />
      <div className="text-[10px] font-serif uppercase tracking-[0.15em] text-[#f2e4bf] mt-1">
        A & B
      </div>
      <div className="flex items-center gap-1 mt-1 text-[#d4af50]">
        <span className="w-3 h-px bg-current" />
        <span className="text-[7px]">&amp;</span>
        <span className="w-3 h-px bg-current" />
      </div>
    </div>
  ),
  polaroid: (
    <div className="h-full bg-[#f5eee1] flex items-center justify-center p-2 relative overflow-hidden">
      <div className="bg-white p-1 pb-3 shadow-md rotate-[-6deg]">
        <div className="w-10 h-10 bg-gradient-to-br from-[#d9c3a5] to-[#b89b78]" />
        <div className="text-[6px] text-center font-script text-[#6a5c4c] mt-0.5">
          A & B
        </div>
      </div>
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#b4c8be]/60 rotate-[-4deg]" />
    </div>
  ),
  mono: (
    <div className="h-full bg-white flex flex-col justify-center p-3 relative overflow-hidden">
      <div className="h-px bg-black" />
      <div className="text-[14px] leading-none font-serif font-light text-neutral-900 mt-1">
        Anna
      </div>
      <div className="text-[14px] leading-none font-serif font-light text-neutral-900">
        Ben
      </div>
      <div className="h-px bg-black mt-1" />
    </div>
  ),
  tropical: (
    <div className="h-full bg-gradient-to-br from-[#157a6e] via-[#5bbfae] to-[#f3d9b5] flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute -top-1 -left-1 text-[14px] rotate-[-20deg]">🌴</div>
      <div className="absolute -top-1 -right-1 text-[14px] scale-x-[-1] rotate-[-20deg]">🌴</div>
      <div className="text-[11px] font-script text-white drop-shadow mt-1">
        A &amp; B
      </div>
      <div className="text-[6px] uppercase tracking-[0.2em] text-white/90 mt-0.5">
        Paradise
      </div>
    </div>
  ),
  glassgarden: (
    <div className="h-full flex items-center justify-center p-2 relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#b4d4b4,transparent_45%),radial-gradient(circle_at_85%_80%,#f0c6cd,transparent_45%),linear-gradient(180deg,#eef5ec,#e4efe4)]">
      <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-t-[28px] rounded-b-md px-3 py-3 flex flex-col items-center shadow-sm">
        <div className="w-4 h-4 rounded-full bg-[#3a7a52] flex items-center justify-center mb-1">
          <span className="text-white text-[7px]">♥</span>
        </div>
        <div className="text-[10px] font-script text-[#2e5438] leading-tight">
          A &amp; B
        </div>
      </div>
    </div>
  ),
};

export const TemplateSelector = ({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(TEMPLATES).map((template: TemplateConfig) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-lg",
            selectedTemplate === template.id
              ? "ring-2 ring-primary shadow-md"
              : "hover:ring-1 hover:ring-primary/50",
          )}
          onClick={() => onTemplateChange(template.id)}>
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
                <h3 className="font-medium text-sm text-foreground">
                  {template.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {template.features.showPetals && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0">
                    Petals
                  </Badge>
                )}
                {template.features.parallaxHero && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0">
                    Parallax
                  </Badge>
                )}
                {template.features.showOrnaments && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0">
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
