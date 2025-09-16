"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CaptionProps {
  text: string;
}

export function Caption({ text }: CaptionProps) {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      <div
        className="flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Salin Caption & Bagikan
        </h2>
        <ChevronDown
          className={`h-5 w-5 transform transition-transform ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Collapsible content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed
            ? "max-h-46 overflow-hidden"
            : "overflow-y-auto max-h-[500px]"
        )}
      >
        <pre className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground font-mono relative">
          <code className="whitespace-pre-wrap break-words block">{text}</code>
        </pre>
      </div>

      <Button variant="outline" onClick={handleCopyCaption}>
        <Copy className="h-4 w-4" />
        Salin Caption
      </Button>
    </div>
  );
}
