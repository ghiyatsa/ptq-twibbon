"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function DownloadButton({ onClick, disabled }: DownloadButtonProps) {
  return (
    <div className="border-t pt-6">
      <Button
        onClick={onClick}
        className="w-full gap-2 cursor-pointer"
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
        Download Twibbon
      </Button>
    </div>
  );
}
