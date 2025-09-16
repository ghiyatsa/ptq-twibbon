import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MAX_DIMENSION = 2000; // Max width/height for the image

export async function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;

        if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
          // No resizing needed
          return resolve(file);
        }

        let newWidth, newHeight;
        if (width > height) {
          newWidth = MAX_DIMENSION;
          newHeight = (height * MAX_DIMENSION) / width;
        } else {
          newHeight = MAX_DIMENSION;
          newWidth = (width * MAX_DIMENSION) / height;
        }

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas to Blob conversion failed"));
            }
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          0.9 // 90% quality
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
