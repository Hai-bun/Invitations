import { Check, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageSlotPickerProps {
  label: string;
  description: string;
  /** Currently chosen image URL; empty = automatic. */
  value: string;
  /** Images the admin can choose from (gallery photos, background, monogram). */
  options: string[];
  onChange: (url: string) => void;
  /** Text on the "no photo chosen" tile (default "Auto"). */
  autoLabel?: string;
}

/**
 * Lets the admin choose which uploaded image fills one spot in a template.
 * "Auto" keeps the template's own automatic choice.
 */
export const ImageSlotPicker = ({
  label,
  description,
  value,
  options,
  onChange,
  autoLabel = "Auto",
}: ImageSlotPickerProps) => {
  const choices = Array.from(new Set(options.filter(Boolean)));

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      {choices.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Upload photos in the Photos tab first, then choose one here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange("")}
            aria-pressed={!value}
            className={cn(
              "w-20 h-20 rounded-md border flex flex-col items-center justify-center gap-1 text-xs transition-all",
              !value
                ? "border-primary ring-2 ring-primary text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}>
            <Wand2 className="w-4 h-4" />
            {autoLabel}
          </button>

          {choices.map((url) => {
            const selected = value === url;
            return (
              <button
                key={url}
                type="button"
                onClick={() => onChange(url)}
                aria-pressed={selected}
                className={cn(
                  "relative w-20 h-20 rounded-md overflow-hidden border transition-all",
                  selected
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50",
                )}>
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
                {selected && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
