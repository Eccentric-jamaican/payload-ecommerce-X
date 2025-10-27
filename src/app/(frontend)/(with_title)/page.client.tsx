"use client";

import { FeatureCarousel } from "@/components/home/FeatureCarousel";
import { TeamCarousel } from "@/components/team/TeamCarousel";
import { Button } from "@/components/ui/button";
import { Product } from "@/payload-types";
import { ArrowRight, Stethoscope, ShieldCheck, Package } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface HomePageClientProps {
  initialProducts: Product[];
}

const HomePageClient: FC<HomePageClientProps> = ({ initialProducts }) => {
  const filteredProducts = initialProducts.filter((product) => {
    const name = (product.name || "").toLowerCase();
    return !["male condoms", "female condoms"].includes(name);
  });
  const previewProducts = filteredProducts.slice(0, 3);

  return (
    <main className="min-h-screen">
      <section className="bg-white">
        <div className="flex w-full flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#0B0B0F] md:text-5xl lg:text-6xl">
              <span>All the payment tools </span>
              <span className="text-[#5B5F72]">your small business needs</span>
            </h1>
            <p className="max-w-xl text-base text-[#5B5F72] md:text-lg">
              Collect money faster than ever with our suite of hassle-free payment tools.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                className="rounded-full bg-[#6CE269] px-6 py-5 text-sm font-medium text-[#0B0B0F] shadow-sm transition hover:bg-[#5cd15a]"
              >
                Open a free account
              </Button>
              <div className="flex items-center gap-3 text-sm text-[#5B5F72]">
              </div>
            </div>
          </div>

          <div className="relative -mx-4 w-[calc(100%+2rem)] overflow-hidden bg-[#EEF4FF] sm:-mx-8 sm:w-[calc(100%+4rem)] lg:-mx-12 lg:w-[calc(100%+6rem)]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=2000&q=80"
                alt="Customer making a payment"
                fill
                priority
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(108, 226, 105, 0.35) 0px, rgba(108, 226, 105, 0.35) 80px, rgba(108, 226, 105, 0) 80px, rgba(108, 226, 105, 0) 160px)',
              }}
            />
            <div className="absolute bottom-6 left-6 max-w-xs rounded-2xl bg-white/80 px-5 py-3 text-xs leading-relaxed text-[#5B5F72] backdrop-blur">
              “From sending proposals to issuing invoices to collecting payments via Tap-2-Pay, Alphamed keeps us
              covered.”
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              See Alphamed in action
            </h2>
            <p className="max-w-2xl text-base text-[#5B5F72]">
              Explore the core tools that help healthcare teams manage operations, streamline procurement, and keep patients
              cared for.
            </p>
          </div>
          <FeatureCarousel slides={featureSlides} />
        </div>
      </section> 
      
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              Who we work with
            </h2>
            <p className="max-w-2xl text-base text-[#5B5F72]">
              Trusted by public health agencies and private providers across the region.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-12 lg:gap-16">
            {partnerLogos.map((partner) => (
              <div key={partner.name} className="flex h-16 items-center justify-center">
                <Image
                  src={partner.logo.src}
                  alt={partner.logo.alt}
                  width={partner.logo.width}
                  height={partner.logo.height}
                  className="h-10 w-auto object-contain grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F6F8FB]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
                  Equip every facility with Alphamed
                </h2>
                <p className="max-w-2xl text-base text-[#5B5F72] md:text-lg">
                  From consumables to high-dependency equipment, our curated product range keeps your teams ready for any patient need.
                  Browse the catalogue or jump straight into a conversation with our procurement specialists.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-[#0B0B0F] px-6 py-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a1a25] md:w-auto"
            >
              <Link href="/products">View all products</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {productHighlights.map((highlight) => (
              <div key={highlight.id} className="rounded-3xl bg-white p-6 shadow-[0px_16px_35px_rgba(13,37,70,0.06)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6CE269]/15 text-[#55B948]">
                  {highlight.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0B0B0F]">{highlight.title}</h3>
                <p className="mt-2 text-sm text-[#5B5F72]">{highlight.description}</p>
                <Link
                  href={highlight.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#55B948]"
                >
                  {highlight.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {previewProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {previewProducts.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group relative overflow-hidden rounded-[28px] bg-white shadow-[0px_14px_32px_rgba(10,25,58,0.05)]"
                >
                  <div className="relative aspect-[4/3]">
                    {product.previewImages?.[0]?.image &&
                    typeof product.previewImages[0].image !== "string" &&
                    product.previewImages[0].image.url ? (
                      <Image
                        src={product.previewImages[0].image.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#EEF4FF] text-4xl font-semibold text-[#9AA1B5]">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6CE269]">
                      {product.productType.split('-').join(' ')}
                    </div>
                    <h3 className="text-lg font-semibold text-[#0B0B0F]">{product.name}</h3>
                    <p className="line-clamp-2 text-sm text-[#5B5F72]">
                      {product.description || 'Learn how Alphamed keeps critical supplies ready for frontline teams.'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B0B0F] md:text-4xl">
              Who we are
            </h2>
            <p className="max-w-2xl text-base text-[#5B5F72]">
              Alphamed Global Limited is powered by a multidisciplinary team of clinicians, supply chain experts, and regional partners working to keep health systems stocked and responsive.
            </p>
          </div>
          <TeamCarousel slides={teamSlides} />
        </div>
      </section>

    </main>
  );
};

const featureSlides = [
  {
    id: "contacts-crm",
    title: "Contacts CRM",
    description: "Import, create, and manage provider or supplier contacts in one secure place.",
    ctaLabel: "Open a free account",
    href: "/contact",
    image: {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      alt: "Medical staff reviewing contacts",
    },
  },
  {
    id: "documents",
    title: "Documents & Contracts",
    description: "Generate contracts and procurement paperwork that can be signed digitally.",
    ctaLabel: "See document workflows",
    href: "/products",
    image: {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      alt: "Team collaborating on contracts",
    },
  },
  {
    id: "estimates",
    title: "Clinical Estimates",
    description: "Create estimates for equipment orders and automatically share with finance teams.",
    ctaLabel: "Build an estimate",
    href: "/contact",
    image: {
      src: "https://images.unsplash.com/photo-1576765607924-3f7b84b1b6c1?auto=format&fit=crop&w=1600&q=80",
      alt: "Healthcare professional reviewing reports",
    },
  },
];

const productHighlights = [
  {
    id: "clinical",
    title: "Clinical Essentials",
    description: "Reliable PPE, wound care, and consumables ready to deploy across each ward.",
    href: "/products?category=clinical",
    ctaLabel: "Browse essentials",
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    id: "logistics",
    title: "Cold Chain & Logistics",
    description: "Temperature-controlled storage and tracking to keep vaccines and medicines safe.",
    href: "/products?category=logistics",
    ctaLabel: "View cold chain",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "equipment",
    title: "Capital Equipment",
    description: "High-spec imaging, diagnostics, and surgical tools sourced from trusted manufacturers.",
    href: "/products?category=equipment",
    ctaLabel: "Explore equipment",
    icon: <Package className="h-5 w-5" />,
  },
];

const teamSlides = [
  {
    id: "amina-yusuf",
    name: "Dr. Amina Yusuf",
    title: "Chief Medical Officer",
    bio: "Oversees clinical partnerships and ensures every product aligns with frontline care standards across West Africa.",
    image: {
      src: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80",
      alt: "Portrait of Dr. Amina Yusuf",
    },
    linkedinUrl: "https://www.linkedin.com",
  },
  {
    id: "ken-owusu",
    name: "Ken Owusu",
    title: "Head of Supply Chain",
    bio: "Coordinates global sourcing, warehousing, and last-mile delivery for mission-critical healthcare supplies.",
    image: {
      src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=80",
      alt: "Portrait of Ken Owusu",
    },
    linkedinUrl: "https://www.linkedin.com",
  },
  {
    id: "lola-adeoye",
    name: "Lola Adeoye",
    title: "Regional Partnerships Lead",
    bio: "Builds relationships with ministries and facilities to tailor Alphamed solutions to national health priorities.",
    image: {
      src: "https://images.unsplash.com/photo-1544723795-3fbafb04cc45?auto=format&fit=crop&w=1200&q=80",
      alt: "Portrait of Lola Adeoye",
    },
    linkedinUrl: "https://www.linkedin.com",
  },
];

const partnerLogos = [
  {
    name: "World Health Organization",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/World_Health_Organization_Logo.svg/512px-World_Health_Organization_Logo.svg.png",
      alt: "World Health Organization logo",
      width: 160,
      height: 60,
    },
  },
  {
    name: "UNICEF",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/UNICEF_Logo.png/512px-UNICEF_Logo.png",
      alt: "UNICEF logo",
      width: 160,
      height: 60,
    },
  },
  {
    name: "African CDC",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Africa_CDC_logo.svg/512px-Africa_CDC_logo.svg.png",
      alt: "Africa CDC logo",
      width: 160,
      height: 60,
    },
  },
  {
    name: "Ministry of Health Ghana",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Coat_of_arms_of_Ghana.svg/512px-Coat_of_arms_of_Ghana.svg.png",
      alt: "Ghana Ministry of Health crest",
      width: 120,
      height: 60,
    },
  },
  {
    name: "MedAccess",
    logo: {
      src: "https://www.medaccess.org/wp-content/uploads/2021/04/medaccess-logo.svg",
      alt: "MedAccess logo",
      width: 160,
      height: 60,
    },
  },
];

export default HomePageClient;
