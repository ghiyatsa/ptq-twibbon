"use client";

import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PhotoState } from "./twibbon-editor";
import { Skeleton } from "./ui/skeleton";

interface FrameState {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface PhotoEditorProps {
  photo: PhotoState;
  selectedFrame: FrameState | null;
  onPhotoUpdate: (updates: Partial<PhotoState>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isPhotoUploaded: boolean;
}

export function PhotoEditor({
  photo,
  selectedFrame,
  onPhotoUpdate,
  canvasRef,
  isPhotoUploaded,
}: PhotoEditorProps) {
  const { toast } = useToast();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const photoImageRef = useRef<HTMLImageElement | null>(null);

  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Effect to load the frame image
  useEffect(() => {
    if (!selectedFrame) {
      frameImageRef.current = null;
      setIsFrameLoading(false);
      return;
    }
    // Avoid reloading if the image is already loaded
    if (
      frameImageRef.current &&
      frameImageRef.current.src ===
        new URL(selectedFrame.url, window.location.origin).href
    ) {
      setIsFrameLoading(false);
      return;
    }
    setIsFrameLoading(true);
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.onload = () => {
      frameImageRef.current = frameImg;
      setIsFrameLoading(false);
    };
    frameImg.onerror = () => {
      console.error("Failed to load frame image:", selectedFrame.url);
      setIsFrameLoading(false);
      toast({
        variant: "destructive",
        title: "Gagal Memuat Bingkai",
        description: "Tidak dapat memuat file gambar untuk bingkai twibbon.",
      });
    };
    frameImg.src = selectedFrame.url;
  }, [selectedFrame, toast]);

  // Effect to load the user's photo
  useEffect(() => {
    if (!photo.url) {
      photoImageRef.current = null;
      setIsPhotoLoading(false);
      return;
    }
    // Avoid reloading if the image is already loaded
    if (
      photoImageRef.current &&
      photoImageRef.current.src ===
        new URL(photo.url, window.location.origin).href
    ) {
      setIsPhotoLoading(false);
      return;
    }
    setIsPhotoLoading(true);
    const photoImg = new Image();
    photoImg.crossOrigin = "anonymous";
    photoImg.onload = () => {
      photoImageRef.current = photoImg;
      setIsPhotoLoading(false);
    };
    photoImg.onerror = () => {
      console.error("Failed to load photo image:", photo.url);
      setIsPhotoLoading(false);
      toast({
        variant: "destructive",
        title: "Gagal Memuat Foto",
        description: "Tidak dapat memuat file gambar yang Anda unggah.",
      });
    };
    photoImg.src = photo.url;
  }, [photo.url, toast]);

  // Main effect for drawing photo and frame
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1350;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawPhoto = () => {
      if (photoImageRef.current) {
        ctx.save();
        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((photo.rotation * Math.PI) / 180);
        ctx.scale(photo.scale, photo.scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        const photoImg = photoImageRef.current;
        const photoAspect = photoImg.width / photoImg.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;

        if (photoAspect > 1) {
          // Landscape
          drawHeight = drawWidth / photoAspect;
        } else {
          // Portrait or square
          drawWidth = drawHeight * photoAspect;
        }

        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        if (isDraggingState) {
          ctx.globalAlpha = 0.7; // Set opacity when dragging
        }

        ctx.drawImage(
          photoImg,
          photo.x + offsetX,
          photo.y + offsetY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      }
    };

    const drawFrame = () => {
      if (frameImageRef.current) {
        ctx.drawImage(frameImageRef.current, 0, 0, canvas.width, canvas.height);
      }
    };

    if (isDraggingState) {
      // When dragging, draw frame first, then photo on top with opacity
      drawFrame();
      drawPhoto();
    } else {
      // Default: draw photo first, then frame on top
      drawPhoto();
      drawFrame();
    }
  }, [
    photo,
    selectedFrame,
    isFrameLoading,
    isPhotoLoading,
    isDraggingState,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPhotoUploaded || !photo.url) return;
    isDragging.current = true;
    setIsDraggingState(true);
    const rect = previewCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !previewCanvasRef.current) return;

    const rect = previewCanvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - lastPosition.current.x;
    const deltaY = currentY - lastPosition.current.y;

    const scaleX = previewCanvasRef.current.width / rect.width;
    const scaleY = previewCanvasRef.current.height / rect.height;

    const angle = (photo.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const newDeltaX = (deltaX * cos + deltaY * sin) * scaleX;
    const newDeltaY = (-deltaX * sin + deltaY * cos) * scaleY;

    onPhotoUpdate({
      x: photo.x + newDeltaX,
      y: photo.y + newDeltaY,
    });

    lastPosition.current = { x: currentX, y: currentY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsDraggingState(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPhotoUploaded || !photo.url) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = previewCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      isDragging.current = true;
      setIsDraggingState(true);
      lastPosition.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging.current || !previewCanvasRef.current) return;

    const touch = e.touches[0];
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    const deltaX = currentX - lastPosition.current.x;
    const deltaY = currentY - lastPosition.current.y;

    const scaleX = previewCanvasRef.current.width / rect.width;
    const scaleY = previewCanvasRef.current.height / rect.height;

    const angle = (photo.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const newDeltaX = (deltaX * cos + deltaY * sin) * scaleX;
    const newDeltaY = (-deltaX * sin + deltaY * cos) * scaleY;

    onPhotoUpdate({
      x: photo.x + newDeltaX,
      y: photo.y + newDeltaY,
    });

    lastPosition.current = { x: currentX, y: currentY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = false;
    setIsDraggingState(false);
  };

  if (!photo.url && selectedFrame) {
    return (
      <div className="space-y-4">
        <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden relative">
          <canvas
            ref={previewCanvasRef}
            className="w-full h-full"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Upload foto untuk mulai mengedit twibbon Anda
        </p>
      </div>
    );
  }

  if (!photo.url) {
    return (
      <div className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          Upload foto untuk mulai mengedit
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden relative">
        {isFrameLoading && <Skeleton className="w-full h-full absolute" />}
        <canvas
          ref={previewCanvasRef}
          className="w-full h-full cursor-move select-none"
          style={{ imageRendering: "crisp-edges", touchAction: isPhotoUploaded ? "none" : "auto" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
