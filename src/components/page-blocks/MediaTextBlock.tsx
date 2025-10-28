import { Button } from "@/components/ui/button";
import type { Page } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import type { PageLayout } from "./index";
import { resolveMedia, stringOr } from "./utils";

type MediaTextBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "mediaText" }>;
  index: number;
  layout: PageLayout;
};

export const MediaTextBlock: FC<MediaTextBlockProps> = ({ block, index, layout }) => {
  const override = block.mediaPosition ?? "auto";
  const orientation =
    override && override !== "auto"
      ? override
      : layout === "alternating"
      ? index % 2 === 0
        ? "image-left"
        : "image-right"
      : "image-left";

  const isImageLeft = orientation === "image-left";

  const heading = stringOr(block.heading, "Untitled section");
  const media = resolveMedia(block.media);
  const ctaLabel = block.cta?.label?.trim() || "";
  const ctaUrl = block.cta?.url?.trim() || "";
  const showCta = ctaLabel.length > 0 && ctaUrl.length > 0;

  return (
    <section className="bg-white">
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-24 ${
          isImageLeft ? "" : "lg:flex-row-reverse"
        }`}
      >
        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#EEF4FF] md:rounded-[32px] lg:max-w-xl lg:flex-1">
          {media ? (
            <>
              <div className="relative aspect-[5/4] w-full md:aspect-[16/10] lg:aspect-square">
                <Image
                  src={media.url}
                  alt={media.alt || heading}
                  fill
                  className="h-full w-full object-cover"
                  sizes="100vw"
                />
              </div>
            </>
          ) : (
            <div className="aspect-[5/4] w-full bg-gradient-to-br from-[#EEF4FF] via-white to-[#DDE6F6]" />
          )}
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-6 lg:max-w-none lg:flex-1">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              {heading}
            </h2>
            {block.body ? (
              <div className="prose prose-neutral max-w-none text-[#3F4354]">
                <RichText data={block.body} />
              </div>
            ) : null}
          </div>
          {showCta ? (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0B0B0F] px-6 py-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25]"
            >
              <Link href={ctaUrl}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

