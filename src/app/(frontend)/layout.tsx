import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { BannerCarousel } from '@/components/layout/BannerCarousel';
import { Toaster } from '@/components/ui/toaster';
import { getSiteSettings } from '@/lib/getSiteSettings';
import { Providers } from '@/providers';
import type { SiteSettings as SiteSettingsType } from '@/payload-types';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import type { CSSProperties, ReactNode } from 'react';
import './globals.css';

type Hsl = {
  h: number;
  s: number;
  l: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number) => Math.round(value * 100) / 100;

const hexToHsl = (hex: string): Hsl | null => {
  let sanitized = hex.trim();
  if (!sanitized) return null;
  if (sanitized.startsWith('#')) {
    sanitized = sanitized.slice(1);
  }
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(sanitized)) {
    return null;
  }

  const r = parseInt(sanitized.slice(0, 2), 16) / 255;
  const g = parseInt(sanitized.slice(2, 4), 16) / 255;
  const b = parseInt(sanitized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: round(h * 360),
    s: round(s * 100),
    l: round(l * 100),
  };
};

const hslToString = (hsl: Hsl): string =>
  `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;

const adjustLightness = (hsl: Hsl, amount: number): Hsl => ({
  ...hsl,
  l: clamp(hsl.l + amount, 0, 100),
});

const resolveHsl = (value: string | null | undefined, fallback: Hsl): Hsl => {
  if (!value) return fallback;
  const converted = value.startsWith('#') ? hexToHsl(value) : null;
  return converted ?? fallback;
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://payload-templates.vercel.app"),
  title: {
    default: "Payload Templates - Digital Assets Marketplace",
    template: "%s | Payload Templates",
  },
  description:
    "Discover and download high-quality digital assets and templates.",
  keywords: ["digital assets", "templates", "marketplace", "design resources"],
  authors: [{ name: "Payload Templates" }],
  creator: "Payload Templates",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://payload-templates.vercel.app",
    siteName: "Payload Templates",
    title: "Payload Templates - Digital Assets Marketplace",
    description:
      "Discover and download high-quality digital assets and templates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payload Templates - Digital Assets Marketplace",
    description:
      "Discover and download high-quality digital assets and templates.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const DEFAULT_BRAND_SETTINGS: Pick<
  SiteSettingsType,
  'primaryColor' | 'accentColor' | 'textColor' | 'backgroundColor' | 'fontFamily'
> = {
  primaryColor: '#4FB8FF',
  accentColor: '#4FB8FF',
  textColor: '#111827',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Poppins, sans-serif',
};

const DEFAULT_HSL = {
  background: hexToHsl(DEFAULT_BRAND_SETTINGS.backgroundColor)!,
  text: hexToHsl(DEFAULT_BRAND_SETTINGS.textColor)!,
  primary: hexToHsl(DEFAULT_BRAND_SETTINGS.primaryColor)!,
  accent: hexToHsl(DEFAULT_BRAND_SETTINGS.accentColor)!,
};

export default async function RootLayout({ children, modal }: LayoutProps) {
  const siteSettings = await getSiteSettings();

  const {
    primaryColor = DEFAULT_BRAND_SETTINGS.primaryColor,
    accentColor = DEFAULT_BRAND_SETTINGS.accentColor,
    textColor = DEFAULT_BRAND_SETTINGS.textColor,
    backgroundColor = DEFAULT_BRAND_SETTINGS.backgroundColor,
    fontFamily = DEFAULT_BRAND_SETTINGS.fontFamily,
    headingFontWeight,
    logo,
    primaryNavigation = [],
    utilityNavigation = [],
    cta,
    supportEmail,
    salesEmail,
    primaryPhone,
    secondaryPhone,
    address,
    footerColumns = [],
    socialLinks = [],
    footerNote,
  } = siteSettings;

  const backgroundHsl = resolveHsl(backgroundColor, DEFAULT_HSL.background);
  const textHsl = resolveHsl(textColor, DEFAULT_HSL.text);
  const primaryHsl = resolveHsl(primaryColor, DEFAULT_HSL.primary);
  const accentHsl = resolveHsl(accentColor, DEFAULT_HSL.accent);

  const cardHsl = adjustLightness(backgroundHsl, 2);
  const popoverHsl = adjustLightness(backgroundHsl, 4);
  const mutedHsl = adjustLightness(backgroundHsl, 6);
  const borderHsl = adjustLightness(backgroundHsl, -12);
  const secondaryForeground = adjustLightness(textHsl, -10);
  const mutedForeground = adjustLightness(textHsl, 10);

  const bodyStyle: CSSProperties = {
    '--brand-primary': primaryColor,
    '--brand-accent': accentColor,
    '--brand-text': textColor,
    '--brand-background': backgroundColor,
    '--brand-font-family': fontFamily,
    '--brand-heading-weight': headingFontWeight ?? '500',
    '--background': hslToString(backgroundHsl),
    '--foreground': hslToString(textHsl),
    '--card': hslToString(cardHsl),
    '--card-foreground': hslToString(textHsl),
    '--popover': hslToString(popoverHsl),
    '--popover-foreground': hslToString(textHsl),
    '--primary': hslToString(primaryHsl),
    '--primary-foreground': '0 0% 100%',
    '--secondary': hslToString(accentHsl),
    '--secondary-foreground': hslToString(secondaryForeground),
    '--muted': hslToString(mutedHsl),
    '--muted-foreground': hslToString(mutedForeground),
    '--accent': hslToString(accentHsl),
    '--accent-foreground': hslToString(textHsl),
    '--destructive': '0 84% 60%',
    '--destructive-foreground': '0 0% 98%',
    '--border': hslToString(borderHsl),
    '--input': hslToString(borderHsl),
    '--ring': hslToString(primaryHsl),
    '--chart-1': hslToString(primaryHsl),
    '--chart-2': hslToString(accentHsl),
    '--chart-3': hslToString(adjustLightness(primaryHsl, -10)),
    '--chart-4': hslToString(adjustLightness(accentHsl, -10)),
    '--chart-5': hslToString(adjustLightness(primaryHsl, 10)),
    backgroundColor,
    color: `hsl(${hslToString(textHsl)})`,
    fontFamily,
  };

  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body style={bodyStyle}>
        <Providers>
          <div className="min-h-screen bg-background antialiased">
            <BannerCarousel />
            <Navbar
              logo={logo}
              primaryNavigation={primaryNavigation}
              utilityNavigation={utilityNavigation}
              cta={cta}
              supportEmail={supportEmail}
              primaryPhone={primaryPhone}
            />
            <main>{children}</main>
            {modal}
            <Footer
              logo={logo}
              address={address}
              supportEmail={supportEmail}
              salesEmail={salesEmail}
              primaryPhone={primaryPhone}
              secondaryPhone={secondaryPhone}
              cta={cta}
              footerColumns={footerColumns}
              socialLinks={socialLinks}
              footerNote={footerNote}
            />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
