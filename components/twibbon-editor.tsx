"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/photo-upload";
import { PhotoEditor } from "@/components/photo-editor";
import { Upload, RefreshCcw } from "lucide-react";
import { Caption } from "./caption";
import { SocialShareButtons } from "./social-share-buttons";
import { DownloadButton } from "./download-button";
import { EditorControls } from "./editor-controls";
import { useToast } from "@/hooks/use-toast";
import { FIXED_FRAME, SOCIAL_CAPTION } from "@/lib/constants";

export interface PhotoState {
  file: File | null;
  url: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface EditorSliderState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const INITIAL_PHOTO_STATE: EditorSliderState = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export function TwibbonEditor() {
  const [photo, setPhoto] = useState<PhotoState>({
    file: null,
    url: "/placeholder.jpg",
    ...INITIAL_PHOTO_STATE,
  });
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(
    "/placeholder.jpg"
  );
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  // Local state for sliders to provide instant visual feedback
  const [sliderState, setSliderState] =
    useState<EditorSliderState>(INITIAL_PHOTO_STATE);

  // Sync slider state when the main photo state changes (e.g., on reset or upload)
  useEffect(() => {
    setSliderState({
      scale: photo.scale,
      rotation: photo.rotation,
      x: photo.x,
      y: photo.y,
    });
  }, [photo.scale, photo.rotation, photo.x, photo.y]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPhoto({
        file,
        url,
        ...INITIAL_PHOTO_STATE,
      });
      setOriginalPhotoUrl(url);
      setIsPhotoUploaded(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const updatePhoto = useCallback((updates: Partial<PhotoState>) => {
    setPhoto((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetPhoto = useCallback(() => {
    updatePhoto(INITIAL_PHOTO_STATE);
  }, [updatePhoto]);

  const downloadTwibbon = useCallback(async () => {
    if (!photo.url || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use same dimensions as preview but scaled up for high quality
    canvas.width = 2160; // 400 * 3 for high quality
    canvas.height = 2700; // 500 * 3 for high quality

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Load and draw photo
    const photoImg = new Image();
    photoImg.crossOrigin = "anonymous";

    photoImg.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Apply same transformations as preview but scaled up
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((photo.rotation * Math.PI) / 180);
      ctx.scale(photo.scale, photo.scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const photoAspect = photoImg.width / photoImg.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (photoAspect > 1) {
        drawHeight = drawWidth / photoAspect;
      } else {
        drawWidth = drawHeight * photoAspect;
      }

      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      const scaleFactor = canvas.width / 1080; // Preview canvas is 1080px wide
      const scaledX = photo.x * scaleFactor;
      const scaledY = photo.y * scaleFactor;

      ctx.drawImage(
        photoImg,
        scaledX + offsetX,
        scaledY + offsetY,
        drawWidth,
        drawHeight
      );

      // Restore context
      ctx.restore();

      // Load and draw frame
      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.onload = () => {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

        // Download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `twibbon-milad-16-${Date.now()}.jpeg`;
              a.type = "image/jpeg";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          },
          "image/jpeg",
          0.9
        );
      };
      frameImg.src = FIXED_FRAME.url;
    };

    photoImg.src = photo.url;
  }, [photo]);

  return (
    <div className="md:max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-center md:text-start">
            Twibbon Milad Ke-16 UKM PTQ
          </h1>
          <SocialShareButtons text={SOCIAL_CAPTION} />
        </div>
        <div className="space-y-8">
          {/* Edit & Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Edit & Preview</h2>
              <PhotoEditor
                photo={photo}
                selectedFrame={FIXED_FRAME}
                onPhotoUpdate={updatePhoto}
                canvasRef={canvasRef}
                isPhotoUploaded={isPhotoUploaded}
              />
              {isPhotoUploaded && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Tips:</strong> Drag foto langsung di preview
                    untuk mengatur posisi dengan mudah!
                  </p>
                </div>
              )}
              <Caption text={SOCIAL_CAPTION} />
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Foto Anda
                </h2>
                <PhotoUpload onPhotoUpload={handlePhotoUpload} />
              </div>

              {isPhotoUploaded ? (
                <div className="space-y-4 border-t pt-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Kontrol Editor</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPhoto}
                      className="gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>

                  <EditorControls
                    sliderState={sliderState}
                    setSliderState={setSliderState}
                    updatePhoto={updatePhoto}
                  />
                </div>
              ) : null}
              <DownloadButton
                onClick={downloadTwibbon}
                disabled={!isPhotoUploaded}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
