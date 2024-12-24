import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="relative border-t bg-dot-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      <div className="container relative py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-16 grid gap-8 rounded-2xl border bg-card/50 p-8 backdrop-blur-sm lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-2xl font-semibold sm:text-3xl">
              Stay in the loop
            </h3>
            <p className="mt-3 text-muted-foreground">
              Subscribe to our newsletter for updates, exclusive offers, and
              early access to new products.
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex w-full max-w-md gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background/50 h-11"
              />
              <Button className="h-11 px-6">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mb-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              About
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium uppercase tracking-wider">
              Connect
            </h4>
            <div className="mb-6 flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact us at:{" "}
              <a
                href="mailto:support@marketplace.com"
                className="text-primary transition-colors hover:text-primary/90 hover:underline"
              >
                support@marketplace.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t py-8 text-center sm:flex-row sm:gap-4 sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Marketplace. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/sitemap"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sitemap
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/accessibility"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
