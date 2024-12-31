"use client";

import { cn } from "@/lib/utils";
import { Product } from "@/payload-types";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";

const ProductImageCarousel: FC<{ product: Product }> = ({ product }) => {
  const [mainCarouselRef, mainEmbla] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
  });
  const [thumbCarouselRef, thumbEmbla] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(true);

  const images =
    product.previewImages
      ?.map((img) =>
        typeof img.image === "string" ? img.image : img.image?.url,
      )
      .filter(Boolean) || [];

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmbla || !thumbEmbla) return;
      mainEmbla.scrollTo(index);
    },
    [mainEmbla, thumbEmbla],
  );

  const onSelect = useCallback(() => {
    if (!mainEmbla || !thumbEmbla) return;
    setSelectedIndex(mainEmbla.selectedScrollSnap());
    thumbEmbla.scrollTo(mainEmbla.selectedScrollSnap());
  }, [mainEmbla, thumbEmbla]);

  const scrollPrev = useCallback(() => mainEmbla?.scrollPrev(), [mainEmbla]);
  const scrollNext = useCallback(() => mainEmbla?.scrollNext(), [mainEmbla]);

  // Autoplay functionality
  useEffect(() => {
    if (!mainEmbla || !isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      mainEmbla.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [mainEmbla, isPlaying, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!mainEmbla) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mainEmbla, scrollPrev, scrollNext]);

  useEffect(() => {
    if (mainEmbla) {
      mainEmbla.on("select", onSelect);
      onSelect();
    }
  }, [mainEmbla, onSelect]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="relative">
        <div
          className="overflow-hidden rounded-lg bg-gray-100"
          ref={mainCarouselRef}
        >
          <div className="flex touch-pan-y">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="group relative min-w-0 flex-[0_0_100%]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {isLoading[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  )}
                  <Image
                    src={imageUrl || ""}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    onLoadingComplete={() =>
                      setIsLoading((prev) => ({ ...prev, [index]: false }))
                    }
                    onLoadStart={() =>
                      setIsLoading((prev) => ({ ...prev, [index]: true }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden" ref={thumbCarouselRef}>
            <div className="flex gap-2 p-1">
              {images.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative aspect-square w-20 flex-[0_0_auto] overflow-hidden rounded-md transition-all hover:opacity-90",
                    selectedIndex === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={selectedIndex === index}
                >
                  <Image
                    src={imageUrl || ""}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
