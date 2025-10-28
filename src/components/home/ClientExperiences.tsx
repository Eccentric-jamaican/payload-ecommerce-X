import { FC } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type PartnerLogo = {
  name: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type PartnerTestimonial = {
  quote: string;
  name: string;
  title: string;
  rating: number;
  avatar?: {
    src: string;
    alt: string;
  };
};

type ClientCard =
  | {
      type: "logo";
      data: PartnerLogo;
    }
  | {
      type: "testimonial";
      data: PartnerTestimonial;
    };

interface ClientExperiencesProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  logos: PartnerLogo[];
  testimonials: PartnerTestimonial[];
}

export const ClientExperiences: FC<ClientExperiencesProps> = ({
  title,
  description,
  ctaLabel,
  ctaUrl,
  logos,
  testimonials,
}) => {
  const testimonialCard: ClientCard | null = testimonials[0]
    ? { type: "testimonial", data: testimonials[0] }
    : null;

  const logoCards: ClientCard[] = logos.map((logo) => ({
    type: "logo",
    data: logo,
  }));

  const cards: ClientCard[] = (() => {
    const base = [...logoCards];

    if (testimonialCard) {
      base.splice(Math.min(1, base.length), 0, testimonialCard);
    }

    if (base.length < 6 && logoCards.length > 0) {
      let i = 0;
      while (base.length < 6) {
        base.push(logoCards[i % logoCards.length]);
        i += 1;
      }
    }

    return base.slice(0, 6);
  })();

  const hasCta = Boolean(ctaLabel && ctaUrl);

  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-base text-[#5B5F72]">{description}</p>
          ) : null}
          {hasCta ? (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#0B0B0F] px-5 py-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25]"
            >
              <Link href={ctaUrl!}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            if (card.type === "testimonial") {
              const { data } = card;
              return (
                <div
                  key={`testimonial-${index}`}
                  className="flex h-full flex-col justify-between rounded-[28px] border border-[#E4E7EE] bg-white p-8 shadow-[0px_16px_35px_rgba(13,37,70,0.05)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-[#0B0B0F]">
                      {Array.from({ length: data.rating }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-[#F3B500] text-[#F3B500]"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed text-[#0B0B0F]">
                      "{data.quote}"
                    </blockquote>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#EEF4FF]">
                      {data.avatar?.src ? (
                        <Image
                          src={data.avatar.src}
                          alt={data.avatar.alt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#55B948]">
                          {data.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-[#0B0B0F]">
                        {data.name}
                      </div>
                      <div className="text-xs text-[#5B5F72]">{data.title}</div>
                    </div>
                  </div>
                </div>
              );
            }

            const { data } = card;
            return (
              <div
                key={`logo-${data.name}-${index}`}
                className="flex h-32 items-center justify-center rounded-[28px] border border-[#E4E7EE] bg-white shadow-[0px_12px_28px_rgba(11,17,43,0.05)]"
              >
                <Image
                  src={data.logo.src}
                  alt={data.logo.alt}
                  width={data.logo.width}
                  height={data.logo.height}
                  className="h-10 w-auto object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
