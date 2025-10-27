import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { ArrowLeft, ArrowRight, Linkedin } from 'lucide-react';
import Link from 'next/link';

export interface TeamMemberSlide {
  id: string;
  name: string;
  title: string;
  bio?: string;
  image: {
    src: string;
    alt: string;
  };
  linkedinUrl?: string;
}

interface TeamCarouselProps {
  slides: TeamMemberSlide[];
}

export function TeamCarousel({ slides }: TeamCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6CE269]">
            Who we are
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
            Meet the Alphamed leadership
          </h2>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={scrollPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
            aria-label="Previous team member"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
            aria-label="Next team member"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="-mx-1" ref={emblaRef}>
        <div className="flex gap-6">
          {slides.map((member) => (
            <article
              key={member.id}
              className="min-w-[260px] max-w-[320px] flex-1 rounded-[28px] bg-white p-6 shadow-[0px_16px_35px_rgba(13,37,70,0.06)]"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-[#EEF4FF]">
                <Image
                  src={member.image.src}
                  alt={member.image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 80vw"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#0B0B0F]">{member.name}</h3>
                  <p className="text-sm text-[#55B948]">{member.title}</p>
                </div>
                {member.bio ? (
                  <p className="text-sm text-[#5B5F72]">{member.bio}</p>
                ) : null}
                {member.linkedinUrl ? (
                  <Link
                    href={member.linkedinUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#55B948]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Connect
                    <Linkedin className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 md:hidden">
        <button
          type="button"
          onClick={scrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
          aria-label="Previous team member"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
          aria-label="Next team member"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
