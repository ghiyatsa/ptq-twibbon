"use client";

import { cn, getCssFilter } from "@/lib/utils";

interface FilterButtonProps {
  photoUrl: string | null;
  filter: {
    id: string;
    name: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({
  photoUrl,
  filter,
  isActive,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border-2 p-1 transition-all scroll-snap-align-start flex-shrink-0",
        isActive
          ? "border-primary"
          : "border-transparent hover:border-muted-foreground/50"
      )}
    >
      <img
        src={photoUrl || "/placeholder.jpg"}
        alt={filter.name}
        style={{ filter: getCssFilter(filter.id) }}
        className="w-16 h-20 bg-muted rounded-md object-cover aspect-[4/5]"
      />
      <span className="text-xs font-medium">{filter.name}</span>
    </button>
  );
}
