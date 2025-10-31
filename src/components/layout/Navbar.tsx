"use client";

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Media, SiteSetting } from '@/payload-types';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

type NavigationItem = NonNullable<SiteSetting['primaryNavigation']>[number];
type UtilityItem = NonNullable<SiteSetting['utilityNavigation']>[number];

interface NavbarProps {
  logo?: SiteSetting['logo'];
  primaryNavigation?: SiteSetting['primaryNavigation'];
  utilityNavigation?: SiteSetting['utilityNavigation'];
  cta?: SiteSetting['cta'];
  supportEmail?: SiteSetting['supportEmail'];
  primaryPhone?: SiteSetting['primaryPhone'];
}

const LOGO_FALLBACK_TEXT = 'Alphamed Global';

function resolveMedia(media?: SiteSetting['logo']): Media | null {
  if (!media) return null;
  if (typeof media === 'object' && media !== null && 'url' in media) {
    return media as Media;
  }

  return null;
}

function NavLinks({
  items,
  className,
  includeViewAll,
}: {
  items?: NavigationItem[];
  className?: string;
  includeViewAll?: boolean;
}) {
  if (!items?.length && !includeViewAll) return null;

  return (
    <nav
      className={cn(
        'grid auto-cols-max items-center gap-4 text-sm font-medium sm:auto-cols-min sm:grid-flow-col sm:gap-6 md:gap-8',
        className,
      )}
    >
      {items?.map((item) => {
        if (!item?.label || !item?.url) return null;

        return (
          <Link
            key={`${item.label}-${item.url}`}
            href={item.url}
            className="flex items-center gap-1 whitespace-nowrap px-2 transition-colors hover:text-[var(--brand-primary,#4FB8FF)] sm:px-0"
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noreferrer' : undefined}
          >
            <span>{item.label}</span>
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        );
      })}
      {includeViewAll ? (
        <Link
          href="/#navigation"
          className="whitespace-nowrap text-muted-foreground transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
        >
          View all
        </Link>
      ) : null}
    </nav>
  );
}

function UtilityLinks({
  items,
}: {
  items?: UtilityItem[];
}) {
  if (!items?.length) return null;

  return (
    <div className="hidden items-center gap-4 text-sm text-muted-foreground lg:flex">
      {items.map((item) => {
        if (!item?.label || !item?.url) return null;

        return (
          <Link
            key={`${item.label}-${item.url}`}
            href={item.url}
            className="transition-colors hover:text-[var(--brand-primary,#4FB8FF)]"
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noreferrer' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar({
  logo,
  primaryNavigation,
  utilityNavigation,
  cta,
  supportEmail,
  primaryPhone,
}: NavbarProps) {
  const resolvedLogo = useMemo(() => resolveMedia(logo), [logo]);
  const primaryItems = useMemo(
    () => (primaryNavigation ?? []).filter((item): item is NavigationItem => !!item?.label && !!item?.url),
    [primaryNavigation],
  );
  const shouldShowViewAll = (primaryItems?.length ?? 0) > 7;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4">
        <div className="flex h-20 w-full items-center justify-between gap-8">
          <div className="flex flex-1 items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {resolvedLogo?.url ? (
                <Image
                  src={resolvedLogo.url}
                  alt={resolvedLogo.alt ?? LOGO_FALLBACK_TEXT}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-lg">{LOGO_FALLBACK_TEXT}</span>
              )}
            </Link>
            <div className="hidden flex-1 justify-center lg:flex">
              <NavLinks
                items={primaryItems}
                includeViewAll={shouldShowViewAll}
                className="text-sm text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UtilityLinks items={utilityNavigation ?? []} />

            {cta?.label && cta.href ? (
              <Button asChild className="hidden rounded-full px-5 py-2 text-sm font-medium lg:inline-flex">
                <Link
                  href={cta.href}
                  target={cta.href.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {cta.label}
                </Link>
              </Button>
            ) : null}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center lg:hidden"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 space-y-8 bg-background">
                <div className="pt-6">
                  <NavLinks
                    items={primaryItems}
                    includeViewAll={shouldShowViewAll}
                    className="flex flex-col gap-4 text-base"
                  />
                </div>
                <div className="space-y-4 text-sm">
                  {supportEmail ? (
                    <div>
                      <div className="font-semibold">Email</div>
                      <Link href={`mailto:${supportEmail}`} className="text-muted-foreground hover:text-foreground">
                        {supportEmail}
                      </Link>
                    </div>
                  ) : null}
                  {primaryPhone ? (
                    <div>
                      <div className="font-semibold">Phone</div>
                      <Link href={`tel:${primaryPhone}`} className="text-muted-foreground hover:text-foreground">
                        {primaryPhone}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
