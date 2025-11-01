"use client";

import { AnimatedHeading } from "@/components/animations/AnimatedWords";
import { ClientExperiences } from "@/components/home/ClientExperiences";
import { FeatureCarousel } from "@/components/home/FeatureCarousel";
import { TeamCarousel } from "@/components/team/TeamCarousel";
import { Button } from "@/components/ui/button";
import type { Page } from "@/payload-types";
import { ArrowRight, Package, ShieldCheck, Stethoscope } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import {
  defaultFeatureSection,
  defaultHeroContent,
  defaultPartnerSection,
  defaultProductSection,
  defaultTeamSection,
} from "@/components/page-blocks/defaults";

interface HomePageClientProps {
  sections?: Page["sections"] | null;
}

type PageSection = NonNullable<Page["sections"]>[number];
type HeroBlock = Extract<PageSection, { blockType: "hero" }>;
type FeatureCarouselBlock = Extract<PageSection, { blockType: "featureCarousel" }>;
type PartnerShowcaseBlock = Extract<PageSection, { blockType: "partnerShowcase" }>;
type ProductHighlightsBlock = Extract<PageSection, { blockType: "productHighlights" }>;
type TeamShowcaseBlock = Extract<PageSection, { blockType: "teamShowcase" }>;

const HomePageClient: FC<HomePageClientProps> = ({ sections }) => {
  const sectionEntries = (sections ?? []) as PageSection[];

  const heroBlock = sectionEntries.find(
    (block): block is HeroBlock => block.blockType === "hero",
  );
  const featureCarouselBlock = sectionEntries.find(
    (block): block is FeatureCarouselBlock => block.blockType === "featureCarousel",
  );
  const partnerShowcaseBlock = sectionEntries.find(
    (block): block is PartnerShowcaseBlock => block.blockType === "partnerShowcase",
  );
  const productHighlightsBlock = sectionEntries.find(
    (block): block is ProductHighlightsBlock => block.blockType === "productHighlights",
  );
  const teamShowcaseBlock = sectionEntries.find(
    (block): block is TeamShowcaseBlock => block.blockType === "teamShowcase",
  );

  const heroHeadingSource = heroBlock?.heading?.trim();
  const heroHeadingLinesRaw: string[] =
    heroHeadingSource && heroHeadingSource.length > 0
      ? heroHeadingSource
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter(Boolean)
      : defaultHeroContent.heading
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter(Boolean);

  const headingLines =
    heroHeadingLinesRaw.length > 0
      ? heroHeadingLinesRaw.map((text: string, index: number) => ({
          text,
          className: index === 1 ? "text-[#5B5F72]" : undefined,
        }))
      : [{ text: defaultHeroContent.heading }];

  const heroSubheading = heroBlock ? heroBlock.subheading?.trim() ?? "" : defaultHeroContent.subheading;
  const showHeroSubheading = heroSubheading.length > 0;

  const heroHasCustomBlock = Boolean(heroBlock);
  const heroCtaLabel = heroHasCustomBlock
    ? heroBlock?.cta?.label?.trim() ?? ""
    : defaultHeroContent.ctaLabel;
  const heroCtaUrl = heroHasCustomBlock
    ? heroBlock?.cta?.url?.trim() ?? ""
    : defaultHeroContent.ctaUrl;
  const showHeroCta = heroCtaLabel.length > 0;
  const heroCtaHref = heroCtaUrl.length > 0 ? heroCtaUrl : "#";

  const backgroundImage = heroBlock?.backgroundImage;
  let heroBackgroundUrl = defaultHeroContent.backgroundImageUrl;
  let heroBackgroundAlt =
    heroBlock?.heading?.trim() ?? defaultHeroContent.backgroundImageAlt;

  if (backgroundImage && typeof backgroundImage === "object") {
    const mediaWithUrl = backgroundImage as { url?: string | null; alt?: string | null };
    if (mediaWithUrl.url) {
      heroBackgroundUrl = mediaWithUrl.url;
    }
    if (mediaWithUrl.alt) {
      heroBackgroundAlt = mediaWithUrl.alt;
    }
  }

  const asMedia = (
    value: unknown,
  ): { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | null => {
    if (value && typeof value === "object") {
      const media = value as {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      };
      if (typeof media.url === "string" && media.url.length > 0) {
        return media;
      }
    }
    return null;
  };

  const featureDefaults = defaultFeatureSection;
  const hasFeatureBlock = Boolean(featureCarouselBlock);
  const featureHeading = featureCarouselBlock?.heading?.trim() || featureDefaults.heading;
  const featureDescription = hasFeatureBlock
    ? featureCarouselBlock?.description?.trim() ?? ""
    : featureDefaults.description;
  const featureSlides =
    featureCarouselBlock?.slides?.length
      ? featureCarouselBlock.slides.map((slide, index) => {
          const fallback =
            featureDefaults.slides[index % featureDefaults.slides.length] ||
            featureDefaults.slides[0];
          const title = slide.title?.trim() || fallback.title;
          const description = slide.description?.trim() || fallback.description;
          const ctaLabel = slide.cta?.label?.trim() || fallback.ctaLabel;
          const ctaUrlRaw = slide.cta?.url?.trim() || fallback.href;
          const ctaUrl = ctaUrlRaw && ctaUrlRaw.length > 0 ? ctaUrlRaw : "#";
          const media = asMedia(slide.image);
          const image = media
            ? {
                src: media.url!,
                alt: media.alt?.trim() || title,
              }
            : fallback.image;

          return {
            id: slide.id ?? `feature-${index}`,
            title,
            description,
            ctaLabel,
            href: ctaUrl,
            image,
          };
        })
      : featureDefaults.slides;

  const partnerDefaults = defaultPartnerSection;
  const hasPartnerBlock = Boolean(partnerShowcaseBlock);
  const partnerHeading = partnerShowcaseBlock?.heading?.trim() || partnerDefaults.heading;
  const partnerDescription = hasPartnerBlock
    ? partnerShowcaseBlock?.description?.trim() ?? ""
    : partnerDefaults.description;
  const partnerCtaLabel = partnerShowcaseBlock?.cta?.label?.trim() ?? "";
  const partnerCtaUrl = partnerShowcaseBlock?.cta?.url?.trim() ?? "";
  const partnerTestimonialsData =
    partnerShowcaseBlock?.testimonials?.length
      ? partnerShowcaseBlock.testimonials.map((testimonial, index) => {
          const fallback =
            partnerDefaults.testimonials[index % partnerDefaults.testimonials.length] ||
            partnerDefaults.testimonials[0];
          const name = testimonial.name?.trim() || fallback.name;
          const title = testimonial.title?.trim() || fallback.title;
          const quote = testimonial.quote?.trim() || fallback.quote;
          const ratingValue =
            typeof testimonial.rating === "number" ? testimonial.rating : fallback.rating;
          const rating = Math.min(5, Math.max(1, ratingValue));
          const avatarMedia = asMedia(testimonial.avatar);
          const avatar = avatarMedia
            ? {
                src: avatarMedia.url!,
                alt: avatarMedia.alt?.trim() || name,
              }
            : fallback.avatar;

          return {
            quote,
            name,
            title,
            rating,
            avatar,
          };
        })
      : partnerDefaults.testimonials;
  const partnerLogosData =
    partnerShowcaseBlock?.logos?.length
      ? partnerShowcaseBlock.logos.map((logo, index) => {
          const fallback =
            partnerDefaults.logos[index % partnerDefaults.logos.length] ||
            partnerDefaults.logos[0];
          const name = logo.name?.trim() || fallback.name;
          const logoMedia = asMedia(logo.logo);
          const image = logoMedia
            ? {
                src: logoMedia.url!,
                alt: logoMedia.alt?.trim() || name,
                width: logoMedia.width ?? fallback.logo.width,
                height: logoMedia.height ?? fallback.logo.height,
              }
            : fallback.logo;

          return {
            name,
            logo: image,
          };
        })
      : partnerDefaults.logos;

  const productDefaults = defaultProductSection;
  const hasProductBlock = Boolean(productHighlightsBlock);
  const productHeading =
    productHighlightsBlock?.heading?.trim() || productDefaults.heading;
  const productDescription = hasProductBlock
    ? productHighlightsBlock?.description?.trim() ?? ""
    : productDefaults.description;
  const productCtaLabel = hasProductBlock
    ? productHighlightsBlock?.cta?.label?.trim() ?? ""
    : productDefaults.ctaLabel;
  const productCtaUrlRaw = hasProductBlock
    ? productHighlightsBlock?.cta?.url?.trim() ?? ""
    : productDefaults.ctaUrl;
  const productCtaUrl = productCtaUrlRaw && productCtaUrlRaw.length > 0 ? productCtaUrlRaw : "#";
  const showProductCta = productCtaLabel.length > 0;

  const getHighlightIcon = (iconKey?: string | null) => {
    switch (iconKey) {
      case "shield-check":
        return <ShieldCheck className="h-5 w-5" />;
      case "package":
        return <Package className="h-5 w-5" />;
      case "stethoscope":
      default:
        return <Stethoscope className="h-5 w-5" />;
    }
  };

  const highlightCards =
    hasProductBlock && productHighlightsBlock?.highlights?.length
      ? productHighlightsBlock.highlights.map((highlight, index) => {
          const fallback =
            productDefaults.highlights[index % productDefaults.highlights.length] ||
            productDefaults.highlights[0];
          const title = highlight.title?.trim() || fallback.title;
          const description = highlight.description?.trim() || fallback.description;
          const cardCtaLabel = hasProductBlock
            ? highlight.cta?.label?.trim() ?? ""
            : fallback.ctaLabel;
          const cardHrefRaw = hasProductBlock
            ? highlight.cta?.url?.trim() ?? ""
            : fallback.href;
          const cardHref = cardHrefRaw && cardHrefRaw.length > 0 ? cardHrefRaw : "#";
          const icon = getHighlightIcon(highlight.icon || fallback.icon);

          return {
            id: highlight.id ?? `highlight-${index}`,
            title,
            description,
            ctaLabel: cardCtaLabel,
            href: cardHref,
            icon,
          };
        })
      : productDefaults.highlights.map((highlight) => ({
          id: highlight.id,
          title: highlight.title,
          description: highlight.description,
          ctaLabel: highlight.ctaLabel,
          href: highlight.href,
          icon: getHighlightIcon(highlight.icon),
        }));

  const teamDefaults = defaultTeamSection;
  const hasTeamBlock = Boolean(teamShowcaseBlock);
  const teamEyebrow = hasTeamBlock
    ? teamShowcaseBlock?.eyebrow?.trim() ?? ""
    : teamDefaults.eyebrow;
  const teamHeading = teamShowcaseBlock?.heading?.trim() || teamDefaults.heading;
  const teamDescription = hasTeamBlock
    ? teamShowcaseBlock?.description?.trim() ?? ""
    : teamDefaults.description;
  const teamCtaLabel = hasTeamBlock ? teamShowcaseBlock?.cta?.label?.trim() ?? "" : "";
  const teamCtaUrl = hasTeamBlock ? teamShowcaseBlock?.cta?.url?.trim() ?? "" : "";
  const teamViewAllUrlRaw = teamShowcaseBlock?.viewAllUrl?.trim();
  const teamViewAllUrl =
    teamViewAllUrlRaw && teamViewAllUrlRaw.length > 0 ? teamViewAllUrlRaw : teamDefaults.viewAllUrl;
  const teamSlidesData =
    teamShowcaseBlock?.members?.length
      ? teamShowcaseBlock.members.map((member, index) => {
          const fallback =
            teamDefaults.members[index % teamDefaults.members.length] ||
            teamDefaults.members[0];
          const name = member.name?.trim() || fallback.name;
          const title = member.title?.trim() || fallback.title;
          const bio = member.bio?.trim() || fallback.bio;
          const linkedinUrl = member.linkedinUrl?.trim() || fallback.linkedinUrl;
          const media = asMedia(member.image);
          const image = media
            ? {
                src: media.url!,
                alt: media.alt?.trim() || name,
              }
            : fallback.image ?? { src: "", alt: name };

          return {
            id: member.id ?? `team-${index}`,
            name,
            title,
            bio,
            image,
            linkedinUrl,
          };
        })
      : teamDefaults.members;
  const showTeamCta = teamCtaLabel.length > 0 && teamCtaUrl.length > 0;

  return (
    <main className="min-h-screen">
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-10 px-4 pt-12 pb-16 sm:px-6 sm:pt-14 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="mx-auto w-full max-w-4xl space-y-6 lg:max-w-none lg:flex-1">
            <AnimatedHeading
              className="text-4xl font-semibold leading-tight tracking-tight text-[#0B0B0F] md:text-5xl lg:text-6xl"
              lines={headingLines}
            />
            {showHeroSubheading ? (
              <p className="max-w-xl text-base text-[#5B5F72] md:text-lg">
                {heroSubheading}
              </p>
            ) : null}
            {showHeroCta ? (
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="rounded-full bg-[#6CE269] px-6 py-5 text-sm font-medium text-[#0B0B0F] shadow-sm transition hover:bg-[#5cd15a]"
                >
                  <Link href={heroCtaHref}>{heroCtaLabel}</Link>
                </Button>
              </div>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#EEF4FF] md:rounded-[32px] lg:max-w-xl lg:flex-1">
            <div className="relative aspect-[5/4] w-full md:aspect-[16/10] lg:aspect-square">
              <Image
                src={heroBackgroundUrl}
                alt={heroBackgroundAlt}
                fill
                priority
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(108, 226, 105, 0.35) 0px, rgba(108, 226, 105, 0.35) 80px, rgba(108, 226, 105, 0) 80px, rgba(108, 226, 105, 0) 160px)',
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              {featureHeading}
            </h2>
            {featureDescription ? (
              <p className="max-w-2xl text-base text-[#5B5F72]">{featureDescription}</p>
            ) : null}
          </div>
          <FeatureCarousel slides={featureSlides} />
        </div>
      </section>

      <ClientExperiences
        title={partnerHeading}
        description={partnerDescription}
        ctaLabel={partnerCtaLabel}
        ctaUrl={partnerCtaUrl}
        logos={partnerLogosData}
        testimonials={partnerTestimonialsData}
      />

      <section className="bg-[#F6F8FB]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
                  {productHeading}
                </h2>
                {productDescription ? (
                  <p className="max-w-2xl text-base text-[#5B5F72] md:text-lg">
                    {productDescription}
                  </p>
                ) : null}
              </div>
            </div>
            {showProductCta ? (
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-[#0B0B0F] px-6 py-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25] md:w-auto"
              >
                <Link href={productCtaUrl}>{productCtaLabel}</Link>
              </Button>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlightCards.map((highlight) => {
              const showHighlightCta =
                highlight.ctaLabel?.length && highlight.href?.length;
              return (
                <div
                  key={highlight.id}
                  className="rounded-3xl bg-white p-6 shadow-[0px_16px_35px_rgba(13,37,70,0.06)]"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6CE269]/15 text-[#55B948]">
                    {highlight.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0B0B0F]">{highlight.title}</h3>
                  {highlight.description ? (
                    <p className="mt-2 text-sm text-[#5B5F72]">{highlight.description}</p>
                  ) : null}
                  {showHighlightCta ? (
                    <Link
                      href={highlight.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#55B948]"
                    >
                      {highlight.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center gap-3 text-center">
            {teamEyebrow ? (
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6CE269]">
                {teamEyebrow}
              </span>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              {teamHeading}
            </h2>
            {teamDescription ? (
              <p className="max-w-3xl text-base text-[#5B5F72]">{teamDescription}</p>
            ) : null}
            {showTeamCta ? (
              <div className="pt-2">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-[#0B0B0F] px-5 py-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25]"
                >
                  <Link href={teamCtaUrl}>{teamCtaLabel}</Link>
                </Button>
              </div>
            ) : null}
          </div>
          <TeamCarousel slides={teamSlidesData} viewAllHref={teamViewAllUrl} />
        </div>
      </section>

    </main>
  );
};

export default HomePageClient;

