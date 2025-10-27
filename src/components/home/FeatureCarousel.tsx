import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
}

interface FeatureCarouselProps {
  slides: FeatureCard[];
}

export function FeatureCarousel({ slides }: FeatureCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.3em] text-[#6CE269]">
          <span className="h-2 w-2 rounded-full bg-[#6CE269]" />
          <span>Our Features</span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border border-[#D5D7E1] text-[#0B0B0F] hover:bg-[#F3F4F8]"
            onClick={scrollPrev}
            aria-label="Previous feature"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border border-[#D5D7E1] text-[#0B0B0F] hover:bg-[#F3F4F8]"
            onClick={scrollNext}
            aria-label="Next feature"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="-mx-1" ref={emblaRef}>
        <div className="flex gap-6">
          {slides.map((slide) => (
            <article
              key={slide.id}
              className="relative min-w-[280px] max-w-[360px] flex-1 overflow-hidden rounded-[28px] bg-white shadow-[0px_12px_40px_rgba(16,24,64,0.08)] transition hover:-translate-y-1"
            >
              <Link href={slide.href} className="flex h-full flex-col">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 90vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/30 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B0B0F]">{slide.title}</h3>
                    <p className="mt-2 text-sm text-[#5B5F72]">{slide.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[#55B948]">
                    {slide.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border border-[#D5D7E1] text-[#0B0B0F] hover:bg-[#F3F4F8]"
          onClick={scrollPrev}
          aria-label="Previous feature"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border border-[#D5D7E1] text-[#0B0B0F] hover:bg-[#F3F4F8]"
          onClick={scrollNext}
          aria-label="Next feature"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
