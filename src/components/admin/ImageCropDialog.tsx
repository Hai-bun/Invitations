import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ASPECTS: Array<{ label: string; value: number }> = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "9:16", value: 9 / 16 },
  { label: "4:3", value: 4 / 3 },
];

const MAX_SIDE = 1600;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });

async function cropToFile(
  src: string,
  area: Area,
  fileName: string,
  type: string,
): Promise<File> {
  const img = await loadImage(src);
  const scale = Math.min(1, MAX_SIDE / Math.max(area.width, area.height));
  const w = Math.round(area.width * scale);
  const h = Math.round(area.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);
  // PNG keeps QR codes lossless; everything else is saved as JPEG.
  const outType = type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, outType, 0.92),
  );
  if (!blob) throw new Error("Could not export image");
  const ext = outType === "image/png" ? "png" : "jpg";
  const base = fileName.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.${ext}`, { type: outType });
}

interface ImageCropDialogProps {
  /** Object/remote URL of the image to crop; null closes the dialog. */
  src: string | null;
  fileName?: string;
  fileType?: string;
  title?: string;
  defaultAspect?: number;
  onCancel: () => void;
  /** Called with the cropped file. */
  onConfirm: (file: File) => void | Promise<void>;
  /** Optional: upload the original, uncropped file instead. */
  onUseOriginal?: () => void | Promise<void>;
}

export const ImageCropDialog = ({
  src,
  fileName = "image.png",
  fileType = "image/png",
  title = "Crop image",
  defaultAspect = 1,
  onCancel,
  onConfirm,
  onUseOriginal,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(defaultAspect);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (src) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAspect(defaultAspect);
      setArea(null);
      setError("");
    }
  }, [src, defaultAspect]);

  const onComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  const confirm = async () => {
    if (!src || !area) return;
    setBusy(true);
    setError("");
    try {
      await onConfirm(await cropToFile(src, area, fileName, fileType));
    } catch (e) {
      setError(
        e instanceof Error && /load/i.test(e.message)
          ? "This image can't be edited here (blocked by the browser). Upload it again from your device to crop it."
          : "Crop failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!src} onOpenChange={(o) => !o && !busy && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Drag to move, pinch or use the slider to zoom.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-72 sm:h-80 bg-black rounded-lg overflow-hidden">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onComplete}
              objectFit="contain"
              showGrid
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {ASPECTS.map((a) => (
            <Button
              key={a.label}
              type="button"
              size="sm"
              variant={Math.abs(aspect - a.value) < 0.001 ? "default" : "outline"}
              className={cn("h-8 px-3")}
              onClick={() => setAspect(a.value)}>
              {a.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10">Zoom</span>
          <Slider
            min={1}
            max={4}
            step={0.01}
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          {onUseOriginal && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onUseOriginal()}>
              Use original
            </Button>
          )}
          <Button type="button" onClick={confirm} disabled={busy || !area}>
            {busy ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Crop &amp; save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
