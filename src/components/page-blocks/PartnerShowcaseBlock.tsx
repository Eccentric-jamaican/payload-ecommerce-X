import { ClientExperiences } from "@/components/home/ClientExperiences";
import type { Page } from "@/payload-types";
import type { FC } from "react";
import { defaultPartnerSection } from "./defaults";
import type { PageLayout } from "./index";
import { resolveMedia, stringOr } from "./utils";

type PartnerShowcaseBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "partnerShowcase" }>;
  index: number;
  layout: PageLayout;
};

export const PartnerShowcaseBlock: FC<PartnerShowcaseBlockProps> = ({ block, layout: _layout }) => {
  const title = stringOr(block.heading, defaultPartnerSection.heading);
  const description = block.description?.trim() || "";

  const testimonials =
    block.testimonials?.length
      ? block.testimonials.map((testimonial, index) => {
          const fallback =
            defaultPartnerSection.testimonials[index % defaultPartnerSection.testimonials.length] ||
            defaultPartnerSection.testimonials[0];
          const avatarMedia = resolveMedia(testimonial.avatar);
          return {
            quote: stringOr(testimonial.quote, fallback.quote),
            name: stringOr(testimonial.name, fallback.name),
            title: stringOr(testimonial.title, fallback.title),
            rating:
              typeof testimonial.rating === "number"
                ? Math.min(5, Math.max(1, testimonial.rating))
                : fallback.rating,
            avatar: avatarMedia
              ? {
                  src: avatarMedia.url,
                  alt: avatarMedia.alt || fallback.avatar?.alt || fallback.name,
                }
              : fallback.avatar,
          };
        })
      : defaultPartnerSection.testimonials;

  const logos =
    block.logos?.length
      ? block.logos.map((logo, index) => {
          const fallback =
            defaultPartnerSection.logos[index % defaultPartnerSection.logos.length] ||
            defaultPartnerSection.logos[0];
          const logoMedia = resolveMedia(logo.logo);
          return {
            name: stringOr(logo.name, fallback.name),
            logo: logoMedia
              ? {
                  src: logoMedia.url,
                  alt: logoMedia.alt || fallback.logo.alt,
                  width: logoMedia.width ?? fallback.logo.width,
                  height: logoMedia.height ?? fallback.logo.height,
                }
              : fallback.logo,
          };
        })
      : defaultPartnerSection.logos;

  const ctaLabel = block.cta?.label?.trim() || "";
  const ctaUrl = block.cta?.url?.trim() || "";

  return (
    <ClientExperiences
      title={title}
      description={description}
      ctaLabel={ctaLabel}
      ctaUrl={ctaUrl}
      logos={logos}
      testimonials={testimonials}
    />
  );
};
