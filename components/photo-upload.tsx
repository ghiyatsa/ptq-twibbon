"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { cn, resizeImage } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void;
}

export function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        // Use a more specific message if possible
        const message =
          rejection.errors[0].code === "file-too-large"
            ? `Ukuran file maksimal 10MB.`
            : rejection.errors[0].message;
        toast({
          variant: "destructive",
          title: "Gagal Upload Foto",
          description: message,
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        try {
          const originalFile = acceptedFiles[0];
          const resizedFile = await resizeImage(originalFile);
          onPhotoUpload(resizedFile);
        } catch (error) {
          console.error("Image resizing failed:", error);
          toast({
            variant: "destructive",
            title: "Gagal Memproses Gambar",
            description: "Terjadi kesalahan saat mengubah ukuran gambar.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onPhotoUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50",
        isDragActive && "border-primary bg-primary/5",
        isLoading && "cursor-wait"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-primary font-medium">Memproses foto...</p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary animate-bounce" />
            <p className="text-primary font-medium">Lepaskan foto di sini...</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Klik atau drag foto ke sini
              </p>
              <p className="text-sm text-muted-foreground">
                Mendukung JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
