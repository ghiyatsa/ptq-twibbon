"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { FilterButton } from "./filter-button";
import { PhotoState, FilterType } from "./twibbon-editor";

const FILTERS: { id: FilterType; name: string }[] = [
  { id: "none", name: "Normal" },
  { id: "grayscale", name: "Grayscale" },
  { id: "sepia", name: "Sepia" },
  { id: "saturate", name: "Saturate" },
  { id: "contrast", name: "Contrast" },
  { id: "brightness", name: "Brightness" },
  { id: "invert", name: "Invert" },
];

interface FilterCarouselProps {
  photoUrl: string | null;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export function FilterCarousel({
  photoUrl,
  filter,
  setFilter,
}: FilterCarouselProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Filter</label>
      <div className="relative flex items-center group">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {FILTERS.map((f, index) => (
              <CarouselItem key={index} className="md:basis-1/5 basis-1/4">
                <FilterButton
                  photoUrl={photoUrl}
                  filter={f}
                  isActive={filter === f.id}
                  onClick={() => setFilter(f.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </div>
  );
}
