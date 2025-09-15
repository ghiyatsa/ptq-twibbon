"use client";

import { Slider } from "@/components/ui/slider";
import { RotateCw, Move, ZoomIn, ZoomOut } from "lucide-react";
import { PhotoState, EditorSliderState } from "./twibbon-editor";

interface EditorControlsProps {
  sliderState: EditorSliderState;
  setSliderState: (value: EditorSliderState) => void;
  updatePhoto: (updates: Partial<PhotoState>) => void;
}

export function EditorControls({
  sliderState,
  setSliderState,
  updatePhoto,
}: EditorControlsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-2">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Zoom</label>
          <span className="text-sm text-muted-foreground">
            {sliderState.scale.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ZoomOut className="h-4 w-4" />
          <Slider
            value={[sliderState.scale]}
            onValueChange={([value]) =>
              setSliderState({ ...sliderState, scale: value })
            }
            onValueCommit={([value]) => updatePhoto({ scale: value })}
            min={0.5}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Rotasi</label>
          <span className="text-sm text-muted-foreground">
            {sliderState.rotation}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCw className="h-4 w-4" />
          <Slider
            value={[sliderState.rotation]}
            onValueChange={([value]) =>
              setSliderState({ ...sliderState, rotation: value })
            }
            onValueCommit={([value]) => updatePhoto({ rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Posisi X</label>
        </div>
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <Slider
            value={[sliderState.x]}
            onValueChange={([value]) =>
              setSliderState({ ...sliderState, x: value })
            }
            onValueCommit={([value]) => updatePhoto({ x: value })}
            min={-1080}
            max={1080}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Posisi Y</label>
        </div>
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <Slider
            value={[sliderState.y]}
            onValueChange={([value]) =>
              setSliderState({ ...sliderState, y: value })
            }
            onValueCommit={([value]) => updatePhoto({ y: value })}
            min={-1350}
            max={1350}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
