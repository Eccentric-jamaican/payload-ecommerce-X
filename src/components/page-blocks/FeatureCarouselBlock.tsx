import { FeatureCarousel } from "@/components/home/FeatureCarousel";
import type { Page } from "@/payload-types";
import type { FC } from "react";
import { defaultFeatureSection } from "./defaults";
import type { PageLayout } from "./index";
import { resolveMedia, stringOr } from "./utils";

type FeatureCarouselBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "featureCarousel" }>;
  index: number;
  layout: PageLayout;
};

export const FeatureCarouselBlock: FC<FeatureCarouselBlockProps> = ({ block, layout: _layout }) => {
  const heading = stringOr(block.heading, defaultFeatureSection.heading);
  const description = block.description?.trim() || "";

  const slides = block.slides?.length
    ? block.slides.map((slide, index) => {
        const fallback =
          defaultFeatureSection.slides[index % defaultFeatureSection.slides.length] ||
          defaultFeatureSection.slides[0];
        const media = resolveMedia(slide.image);
        return {
          id: slide.id ?? `feature-${index}`,
          title: stringOr(slide.title, fallback.title),
          description: slide.description?.trim() || fallback.description,
          ctaLabel: stringOr(slide.cta?.label, fallback.ctaLabel),
          href: stringOr(slide.cta?.url, fallback.href),
          image: media
            ? {
                src: media.url,
                alt: media.alt || fallback.image.alt,
              }
            : fallback.image,
        };
      })
    : defaultFeatureSection.slides;

  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
            {heading}
          </h2>
          {description ? (
            <p className="max-w-2xl text-base text-[#5B5F72]">{description}</p>
          ) : null}
        </div>
        <FeatureCarousel slides={slides} />
      </div>
    </section>
  );
};
