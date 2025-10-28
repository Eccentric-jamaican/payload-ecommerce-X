import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Media, SiteSettings as SiteSettingsType } from "@/payload-types";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  logo?: SiteSettingsType["logo"];
  supportEmail?: SiteSettingsType["supportEmail"];
  primaryPhone?: SiteSettingsType["primaryPhone"];
  footerColumns?: SiteSettingsType["footerColumns"];
  socialLinks?: SiteSettingsType["socialLinks"];
  footerNote?: SiteSettingsType["footerNote"];
  cta?: SiteSettingsType["cta"];
}

type ColumnItem = {
  label: string;
  href?: string;
  external?: boolean;
};

type ColumnData = {
  heading: string;
  items: ColumnItem[];
};

const LOGO_FALLBACK_TEXT = "Alphamed Global";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
};

function resolveMedia(media?: SiteSettingsType["logo"]): Media | null {
  if (!media) return null;
  if (typeof media === "object" && media !== null && "url" in media) {
    return media as Media;
  }
  return null;
}

function mapFooterColumns(
  footerColumns: SiteSettingsType["footerColumns"],
  supportEmail?: string | null,
  primaryPhone?: string | null,
): ColumnData[] {
  const columns: ColumnData[] = [];

  footerColumns?.forEach((column) => {
    if (!column) return;
    const items: ColumnItem[] = [];
    column.links?.forEach((link) => {
      if (!link?.label || !link.url) return;
      items.push({
        label: link.label,
        href: link.url,
        external: link.openInNewTab ?? false,
      });
    });

    columns.push({ heading: column.heading || "", items });
  });

  const contactItems: ColumnItem[] = [];
  if (supportEmail) {
    contactItems.push({ label: supportEmail, href: `mailto:${supportEmail}` });
  }
  if (primaryPhone) {
    contactItems.push({ label: primaryPhone, href: `tel:${primaryPhone}` });
  }

  if (contactItems.length > 0) {
    columns.push({ heading: "Connect", items: contactItems });
  }

  return columns;
}

const Column = ({ heading, items }: ColumnData) => {
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      {heading ? (
        <h4 className="text-sm font-semibold text-[#0B0B0F]">{heading}</h4>
      ) : null}
      <ul className="space-y-2 text-sm text-[#3F4354]">
        {items.map((item) => (
          <li key={`${heading}-${item.label}`}>
            {item.href ? (
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="transition-colors hover:text-[#0B0B0F]"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Footer({
  logo,
  supportEmail,
  primaryPhone,
  footerColumns,
  socialLinks,
  footerNote,
  cta,
}: FooterProps) {
  const resolvedLogo = resolveMedia(logo);
  const columns = mapFooterColumns(footerColumns, supportEmail, primaryPhone);
  const showColumns = columns.length > 0;
  const newsletterTitle = cta?.label || "Subscribe";
  const newsletterCopy =
    cta?.subtext || "Select topics and stay current with our latest insights.";

  const flattenedLinks = columns.flatMap((column) => column.items);

  return (
    <footer className="bg-[#F4F6FB]">
      <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex-1 space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold">
              {resolvedLogo?.url ? (
                <Image
                  src={resolvedLogo.url}
                  alt={resolvedLogo.alt ?? LOGO_FALLBACK_TEXT}
                  width={140}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-semibold text-[#0B0B0F]">
                  {LOGO_FALLBACK_TEXT}
                </span>
              )}
            </Link>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#0B0B0F]">{newsletterTitle}</h3>
              <p className="max-w-md text-sm text-[#3F4354] md:text-base">{newsletterCopy}</p>
            </div>
            <form
              action="#"
              method="post"
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="h-12 rounded-none border border-[#1B1B21] bg-white text-sm text-[#0B0B0F] focus-visible:border-[#1B1B21] focus-visible:ring-0 sm:flex-1"
              />
              <Button
                type="submit"
                className="h-12 rounded-none bg-[#2456FF] px-6 text-sm font-medium text-white transition hover:bg-[#1c43d9]"
              >
                Submit
              </Button>
            </form>
          </div>

          {showColumns ? (
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-wrap gap-x-10 gap-y-8 text-sm text-[#0B0B0F]">
                {columns.map((column, index) => (
                  <div
                    key={`${column.heading || column.items[0]?.label || "column"}-${index}`}
                    className="min-w-[140px]"
                  >
                    <Column {...column} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6 border-t border-[#D5D7E1] pt-8 text-sm text-[#3F4354]">
          {flattenedLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {flattenedLinks.map((item) =>
                item.href ? (
                  <Link
                    key={`footer-inline-${item.label}`}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="transition-colors hover:text-[#0B0B0F]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span key={`footer-inline-${item.label}`}>{item.label}</span>
                ),
              )}
            </div>
          ) : null}

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-[#5B5F72]">
              {footerNote || `© ${new Date().getFullYear()} Alphamed Global Limited. All rights reserved.`}
            </div>
            <div className="flex items-center gap-4 text-[#0B0B0F]">
              {socialLinks?.map((link) => {
                if (!link?.platform || !link.url) return null;
                const Icon =
                  SOCIAL_ICONS[link.icon?.toLowerCase() ?? link.platform.toLowerCase()] ?? null;
                return (
                  <Link
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0B0B0F] transition-colors hover:bg-[#0B0B0F] hover:text-white"
                    aria-label={link.platform}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : link.platform}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

