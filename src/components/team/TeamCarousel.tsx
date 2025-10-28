import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight, Linkedin } from "lucide-react";
import Link from "next/link";

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
  viewAllHref?: string;
}

const cardStyles =
  "flex flex-col items-center gap-4 rounded-[28px] bg-white p-8 text-center shadow-[0px_16px_35px_rgba(13,37,70,0.06)]";

const renderAvatar = (member: TeamMemberSlide) => {
  if (member.image?.src) {
    return (
      <Image
        src={member.image.src}
        alt={member.image.alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 200px, 50vw"
      />
    );
  }

  return (
    <span className="text-lg font-semibold text-[#55B948]">
      {member.name.charAt(0)}
    </span>
  );
};

const TeamCard = ({ member }: { member: TeamMemberSlide }) => (
  <article className={cardStyles}>
    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#EEF4FF]">
      {renderAvatar(member)}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-[#0B0B0F]">{member.name}</h3>
      <p className="text-sm text-[#55B948]">{member.title}</p>
    </div>
    {member.bio ? (
      <p className="text-sm leading-relaxed text-[#5B5F72]">{member.bio}</p>
    ) : null}
    {member.linkedinUrl ? (
      <div className="flex items-center justify-center gap-3 text-[#0B0B0F]">
        <Link
          href={member.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] transition hover:border-[#55B948] hover:text-[#55B948]"
        >
          <Linkedin className="h-4 w-4" />
        </Link>
      </div>
    ) : null}
  </article>
);

const chunkSlides = (entries: TeamMemberSlide[], chunkSize: number) => {
  const chunks: TeamMemberSlide[][] = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  return chunks;
};

export function TeamCarousel({
  slides,
  viewAllHref = "/team",
}: TeamCarouselProps) {
  const [mobileRef, mobileApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  const [desktopRef, desktopApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });

  const scrollMobilePrev = useCallback(() => mobileApi?.scrollPrev(), [mobileApi]);
  const scrollMobileNext = useCallback(() => mobileApi?.scrollNext(), [mobileApi]);

  const scrollDesktopPrev = useCallback(
    () => desktopApi?.scrollPrev(),
    [desktopApi],
  );
  const scrollDesktopNext = useCallback(
    () => desktopApi?.scrollNext(),
    [desktopApi],
  );

  const desktopChunks = useMemo(() => chunkSlides(slides, 6), [slides]);
  const showDesktopCarousel = desktopChunks.length > 1;
  const showViewAll = slides.length >= 7;
  const teamHasMembers = slides.length > 0;

  if (!teamHasMembers) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Mobile Carousel */}
      <div className="block md:hidden">
        <div className="-mx-1" ref={mobileRef}>
          <div className="flex gap-4">
            {slides.map((member) => (
              <div key={member.id} className="min-w-[260px] flex-1">
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={scrollMobilePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
              aria-label="Previous team member"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollMobileNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
              aria-label="Next team member"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        {showDesktopCarousel ? (
          <div className="space-y-6">
            <div className="-mx-2" ref={desktopRef}>
              <div className="flex">
                {desktopChunks.map((chunk, index) => (
                  <div key={`team-page-${index}`} className="min-w-full px-2">
                    <div className="grid gap-8 lg:grid-cols-3">
                      {chunk.map((member) => (
                        <TeamCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {showViewAll ? (
                <Link
                  href={viewAllHref}
                  className="text-sm font-medium text-[#55B948] hover:underline"
                >
                  View all
                </Link>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollDesktopPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
                  aria-label="Previous team members"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollDesktopNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D7E1] text-[#0B0B0F] transition hover:bg-[#F3F4F8]"
                  aria-label="Next team members"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {desktopChunks[0]?.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {showViewAll && showDesktopCarousel && (
        <div className="block text-end md:hidden">
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[#55B948] hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
