import { TeamCarousel } from "@/components/team/TeamCarousel";
import type { Page } from "@/payload-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { FC } from "react";
import { defaultTeamSection } from "./defaults";
import type { PageLayout } from "./index";
import { resolveMedia, stringOr } from "./utils";

type TeamShowcaseBlockProps = {
  block: Extract<NonNullable<Page["sections"]>[number], { blockType: "teamShowcase" }>;
  index: number;
  layout: PageLayout;
};

export const TeamShowcaseBlock: FC<TeamShowcaseBlockProps> = ({ block, layout: _layout }) => {
  const eyebrow = block.eyebrow?.trim() || "";
  const heading = stringOr(block.heading, defaultTeamSection.heading);
  const description = block.description?.trim() || "";

  const ctaLabel = block.cta?.label?.trim() || "";
  const ctaUrl = block.cta?.url?.trim() || "";
  const showCta = ctaLabel.length > 0 && ctaUrl.length > 0;

  const viewAllUrlRaw = block.viewAllUrl?.trim() || "";
  const viewAllUrl = viewAllUrlRaw.length > 0 ? viewAllUrlRaw : defaultTeamSection.viewAllUrl;

  const members =
    block.members?.length
      ? block.members.map((member, index) => {
          const fallback =
            defaultTeamSection.members[index % defaultTeamSection.members.length] ||
            defaultTeamSection.members[0];
          const media = resolveMedia(member.image);
          return {
            id: member.id ?? `team-${index}`,
            name: stringOr(member.name, fallback.name),
            title: stringOr(member.title, fallback.title),
            bio: member.bio?.trim() || fallback.bio,
            linkedinUrl: member.linkedinUrl?.trim() || fallback.linkedinUrl,
            image: media
              ? {
                  src: media.url,
                  alt: media.alt || fallback.image.alt,
                }
              : fallback.image,
          };
        })
      : defaultTeamSection.members;

  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6CE269]">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
            {heading}
          </h2>
          {description ? (
            <p className="max-w-3xl text-base text-[#5B5F72]">{description}</p>
          ) : null}
          {showCta ? (
            <div className="pt-2">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[#0B0B0F] px-5 py-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25]"
              >
                <Link href={ctaUrl}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </div>
        <TeamCarousel slides={members} viewAllHref={viewAllUrl} />
      </div>
    </section>
  );
};
