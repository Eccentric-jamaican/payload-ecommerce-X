import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";
import { Inter } from "next/font/google";
import { FC, ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
