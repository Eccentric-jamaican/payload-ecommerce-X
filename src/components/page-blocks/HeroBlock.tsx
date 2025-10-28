import { AnimatedHeading } from "@/components/animations/AnimatedWords";
import { Button } from "@/components/ui/button";
import type { Page } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { defaultHeroContent } from "./defaults";
import type { PageLayout } from "./index";
import { resolveMedia, stringOr } from "./utils";

type HeroBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "hero" }>;
  index: number;
  layout: PageLayout;
};

export const HeroBlock: FC<HeroBlockProps> = ({ block, layout: _layout }) => {
  const headingSource = stringOr(block.heading, defaultHeroContent.heading);
  const headingLines = headingSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text, index) => ({
      text,
      className: index === 1 ? "text-[#5B5F72]" : undefined,
    }));

  const subheading = block.subheading?.trim() || defaultHeroContent.subheading;
  const ctaLabel = block.cta?.label?.trim() || defaultHeroContent.ctaLabel;
  const ctaUrl = block.cta?.url?.trim() || defaultHeroContent.ctaUrl;
  const showCta = ctaLabel.length > 0 && ctaUrl.length > 0;

  const media = resolveMedia(block.backgroundImage);
  const backgroundUrl = media?.url ?? defaultHeroContent.backgroundImageUrl;
  const backgroundAlt =
    media?.alt || block.heading || defaultHeroContent.backgroundImageAlt;

  const layoutStyle = (block.layoutStyle as string | undefined) ?? "split";
  const isOverlay = layoutStyle === "overlay";

  if (isOverlay) {
    return (
      <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src={backgroundUrl}
            alt={backgroundAlt}
            fill
            className="object-cover brightness-95"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/85 to-white/65" />
        </div>

        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:max-w-5xl lg:px-8">
          <AnimatedHeading
            className="text-4xl font-semibold leading-tight tracking-tight text-[#0B0B0F] md:text-5xl lg:text-6xl"
            lines={headingLines}
          />
          {subheading ? (
            <p className="max-w-2xl text-base text-[#3F4354] md:text-lg">
              {subheading}
            </p>
          ) : null}
          {showCta ? (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-[#0B0B0F] px-6 py-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25]"
              >
                <Link href={ctaUrl}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-4xl space-y-6 lg:max-w-none lg:flex-1">
          <AnimatedHeading
            className="text-4xl font-semibold leading-tight tracking-tight text-[#0B0B0F] md:text-5xl lg:text-6xl"
            lines={headingLines}
          />
          {subheading ? (
            <p className="max-w-xl text-base text-[#5B5F72] md:text-lg">{subheading}</p>
          ) : null}
          {showCta ? (
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-[#6CE269] px-6 py-5 text-sm font-medium text-[#0B0B0F] shadow-sm transition hover:bg-[#5cd15a]"
              >
                <Link href={ctaUrl}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#EEF4FF] md:rounded-[32px] lg:max-w-xl lg:flex-1">
          <div className="relative aspect-[5/4] w-full md:aspect-[16/10] lg:aspect-square">
            <Image
              src={backgroundUrl}
              alt={backgroundAlt}
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
                "repeating-linear-gradient(90deg, rgba(108, 226, 105, 0.35) 0px, rgba(108, 226, 105, 0.35) 80px, rgba(108, 226, 105, 0) 80px, rgba(108, 226, 105, 0) 160px)",
            }}
          />
        </div>
      </div>
    </section>
  );
};
