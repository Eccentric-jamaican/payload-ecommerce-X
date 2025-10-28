import { Button } from "@/components/ui/button";
import type { Page } from "@/payload-types";
import { ArrowRight, Package, ShieldCheck, Stethoscope } from "lucide-react";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { defaultProductSection } from "./defaults";
import type { PageLayout } from "./index";
import { stringOr } from "./utils";

type ProductHighlightsBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "productHighlights" }>;
  index: number;
  layout: PageLayout;
};

const iconMap = {
  "shield-check": <ShieldCheck className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
  stethoscope: <Stethoscope className="h-5 w-5" />,
} satisfies Record<string, ReactNode>;

export const ProductHighlightsBlock: FC<ProductHighlightsBlockProps> = ({ block, layout: _layout }) => {
  const heading = stringOr(block.heading, defaultProductSection.heading);
  const description = block.description?.trim() || "";

  const sectionCtaLabel = block.cta?.label?.trim() || "";
  const sectionCtaUrl = block.cta?.url?.trim() || "";
  const showSectionCta = sectionCtaLabel.length > 0 && sectionCtaUrl.length > 0;

  const cards =
    block.highlights?.length
      ? block.highlights.map((highlight, index) => {
          const fallback =
            defaultProductSection.highlights[index % defaultProductSection.highlights.length] ||
            defaultProductSection.highlights[0];
          const iconKey = highlight.icon || fallback.icon;
          const icon = iconMap[iconKey] ?? iconMap.stethoscope;
          const cardCtaLabel = highlight.cta?.label?.trim() || "";
          const cardHref = highlight.cta?.url?.trim() || "";

          return {
            id: highlight.id ?? `highlight-${index}`,
            title: stringOr(highlight.title, fallback.title),
            description: highlight.description?.trim() || fallback.description,
            ctaLabel: cardCtaLabel,
            href: cardHref,
            icon,
          };
        })
      : defaultProductSection.highlights.map((highlight) => ({
          id: highlight.id,
          title: highlight.title,
          description: highlight.description,
          ctaLabel: highlight.ctaLabel,
          href: highlight.href,
          icon: iconMap[highlight.icon] ?? iconMap.stethoscope,
        }));

  return (
    <section className="bg-[#F6F8FB]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
                {heading}
              </h2>
              {description ? (
                <p className="max-w-2xl text-base text-[#5B5F72] md:text-lg">{description}</p>
              ) : null}
            </div>
          </div>
          {showSectionCta ? (
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-[#0B0B0F] px-6 py-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25] md:w-auto"
            >
              <Link href={sectionCtaUrl}>{sectionCtaLabel}</Link>
            </Button>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const showCardCta = card.ctaLabel.length > 0 && card.href.length > 0;
            return (
              <div
                key={card.id}
                className="rounded-3xl bg-white p-6 shadow-[0px_16px_35px_rgba(13,37,70,0.06)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6CE269]/15 text-[#55B948]">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0B0B0F]">{card.title}</h3>
                {card.description ? (
                  <p className="mt-2 text-sm text-[#5B5F72]">{card.description}</p>
                ) : null}
                {showCardCta ? (
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#55B948]"
                  >
                    {card.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
