"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CaptionProps {
  text: string;
}

export function Caption({ text }: CaptionProps) {
  const { toast } = useToast();

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Berhasil!",
        description: "Caption telah disalin ke clipboard.",
      });
    });
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        Salin Caption & Bagikan
      </h2>
      <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap font-mono">
        {text}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleCopyCaption}
          className="w-full gap-2"
        >
          <Copy className="h-4 w-4" />
          Salin Caption
        </Button>
      </div>
    </div>
  );
}
