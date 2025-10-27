import { Button } from '@/components/ui/button';
import type { Media, SiteSettings as SiteSettingsType } from '@/payload-types';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type FooterColumn = NonNullable<SiteSettingsType['footerColumns']>[number];

interface FooterProps {
  logo?: SiteSettingsType['logo'];
  address?: SiteSettingsType['address'];
  supportEmail?: SiteSettingsType['supportEmail'];
  salesEmail?: SiteSettingsType['salesEmail'];
  primaryPhone?: SiteSettingsType['primaryPhone'];
  secondaryPhone?: SiteSettingsType['secondaryPhone'];
  cta?: SiteSettingsType['cta'];
  footerColumns?: SiteSettingsType['footerColumns'];
  socialLinks?: SiteSettingsType['socialLinks'];
  footerNote?: SiteSettingsType['footerNote'];
}

const LOGO_FALLBACK_TEXT = 'Alphamed Global';

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

function resolveMedia(media?: SiteSettingsType['logo']): Media | null {
  if (!media) return null;
  if (typeof media === 'object' && media !== null && 'url' in media) {
    return media as Media;
  }
  return null;
}

function FooterColumnLinks({ column }: { column: FooterColumn }) {
  if (!column?.links?.length) return null;

  return (
    <div>
      {column.heading ? (
        <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {column.heading}
        </h4>
      ) : null}
      <ul className="space-y-2.5 text-sm text-foreground/70">
        {column.links.map((link) => {
          if (!link?.label || !link?.url) return null;
          return (
            <li key={`${link.label}-${link.url}`}>
              <Link
                href={link.url}
                className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noreferrer' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function renderContactBlock({
  supportEmail,
  salesEmail,
  primaryPhone,
  secondaryPhone,
  address,
}: {
  supportEmail?: string | null;
  salesEmail?: string | null;
  primaryPhone?: string | null;
  secondaryPhone?: string | null;
  address?: string | null;
}) {
  if (!supportEmail && !salesEmail && !primaryPhone && !secondaryPhone && !address) {
    return null;
  }

  return (
    <div className="space-y-4 text-sm text-foreground/70">
      {supportEmail ? (
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">Support</div>
            <Link
              href={`mailto:${supportEmail}`}
              className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
            >
              {supportEmail}
            </Link>
          </div>
        </div>
      ) : null}
      {salesEmail ? (
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">Sales</div>
            <Link
              href={`mailto:${salesEmail}`}
              className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
            >
              {salesEmail}
            </Link>
          </div>
        </div>
      ) : null}
      {primaryPhone ? (
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">Phone</div>
            <Link
              href={`tel:${primaryPhone}`}
              className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
            >
              {primaryPhone}
            </Link>
          </div>
        </div>
      ) : null}
      {secondaryPhone ? (
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">Secondary</div>
            <Link
              href={`tel:${secondaryPhone}`}
              className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
            >
              {secondaryPhone}
            </Link>
          </div>
        </div>
      ) : null}
      {address ? (
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">Address</div>
            <p className="whitespace-pre-line">{address}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Footer({
  logo,
  address,
  supportEmail,
  salesEmail,
  primaryPhone,
  secondaryPhone,
  cta,
  footerColumns,
  socialLinks,
  footerNote,
}: FooterProps) {
  const resolvedLogo = resolveMedia(logo);

  const hasFooterColumns = footerColumns && footerColumns.length > 0;
  const hasSocialLinks = socialLinks && socialLinks.length > 0;

  return (
    <footer className="border-t bg-muted/20">
      <div className="container space-y-12 py-12 md:py-16">
        {cta?.label && cta.href ? (
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border bg-background p-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {cta.label}
              </h3>
              {cta.subtext ? (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {cta.subtext}
                </p>
              ) : null}
            </div>
            <Button asChild size="lg">
              <Link
                href={cta.href}
                target={cta.href.startsWith('http') ? '_blank' : undefined}
                rel={cta.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                Get in touch
              </Link>
            </Button>
          </div>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
              {resolvedLogo?.url ? (
                <Image
                  src={resolvedLogo.url}
                  alt={resolvedLogo.alt ?? LOGO_FALLBACK_TEXT}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <span>{LOGO_FALLBACK_TEXT}</span>
              )}
            </Link>
            {renderContactBlock({
              supportEmail,
              salesEmail,
              primaryPhone,
              secondaryPhone,
              address,
            })}
          </div>

          {hasFooterColumns ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {footerColumns?.map((column, index) => (
                <FooterColumnLinks key={column?.heading ?? index} column={column} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 border-t pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            {footerNote ?? '© ' + new Date().getFullYear() + ' Alphamed Global. All rights reserved.'}
          </div>
          {hasSocialLinks ? (
            <div className="flex items-center gap-4">
              {socialLinks?.map((link) => {
                if (!link?.platform || !link?.url) return null;
                const Icon =
                  SOCIAL_ICONS[link.icon?.toLowerCase() ?? link.platform.toLowerCase()] ?? null;
                return (
                  <Link
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-transparent hover:bg-[var(--brand-primary,#4FB8FF)] hover:text-white"
                    aria-label={link.platform}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : link.platform}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
