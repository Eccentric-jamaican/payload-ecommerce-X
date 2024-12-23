import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";
import { Inter } from "next/font/google";
import { FC, ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://payload-templates.com"),
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
    url: "https://payload-templates.com",
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

const Layout: FC<LayoutProps> = ({ children, modal }) => {
  return (
    <Providers>
      <html lang="en" className={inter.className}>
        <body className="min-h-screen bg-background">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
          {modal}
        </body>
      </html>
    </Providers>
  );
};

export default Layout;
