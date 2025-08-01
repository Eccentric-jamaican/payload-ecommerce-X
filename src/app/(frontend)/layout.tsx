import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";
import { Metadata } from "next";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({ children, modal }: LayoutProps) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen bg-background antialiased">
            <BannerCarousel />
            <Navbar />
            <main>{children}</main>
            {modal}
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
