import type { FeatureCard } from "@/components/home/FeatureCarousel";
import type { PartnerLogo, PartnerTestimonial } from "@/components/home/ClientExperiences";
import type { TeamMemberSlide } from "@/components/team/TeamCarousel";

export const defaultHeroContent = {
  heading: "All the supply workflows\nyour health system needs",
  subheading:
    "Equip every facility, warehouse, and outreach team with dependable medical products, sourced and delivered without the friction.",
  ctaLabel: "Speak with our procurement team",
  ctaUrl: "/contact",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=2000&q=80",
  backgroundImageAlt: "Healthcare professionals coordinating logistics",
};

export const defaultFeatureSection: {
  heading: string;
  description: string;
  slides: FeatureCard[];
} = {
  heading: "See Alphamed in action",
  description:
    "Explore the core tools that help healthcare teams manage operations, streamline procurement, and keep patients cared for.",
  slides: [
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
  ],
};

export const defaultPartnerSection: {
  heading: string;
  description: string;
  testimonials: PartnerTestimonial[];
  logos: PartnerLogo[];
} = {
  heading: "Who we work with",
  description: "Real insights from the agencies and providers we collaborate with.",
  testimonials: [
    {
      quote:
        "This solution transformed our administrative workflow with unprecedented efficiency.",
      name: "Michael Thompson",
      title: "Director, Government Operations",
      rating: 5,
      avatar: {
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        alt: "Portrait of Michael Thompson",
      },
    },
  ],
  logos: [
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
  ],
};

export const defaultProductSection = {
  heading: "Equip every facility with Alphamed",
  description:
    "From consumables to high-dependency equipment, our curated product range keeps your teams ready for any patient need. Browse the catalogue or jump straight into a conversation with our procurement specialists.",
  ctaLabel: "View all products",
  ctaUrl: "/products",
  highlights: [
    {
      id: "clinical",
      title: "Clinical Essentials",
      description: "Reliable PPE, wound care, and consumables ready to deploy across each ward.",
      ctaLabel: "Browse essentials",
      href: "/products?category=clinical",
      icon: "stethoscope" as const,
    },
    {
      id: "logistics",
      title: "Cold Chain & Logistics",
      description: "Temperature-controlled storage and tracking to keep vaccines and medicines safe.",
      ctaLabel: "View cold chain",
      href: "/products?category=logistics",
      icon: "shield-check" as const,
    },
    {
      id: "equipment",
      title: "Capital Equipment",
      description:
        "High-spec imaging, diagnostics, and surgical tools sourced from trusted manufacturers.",
      ctaLabel: "Explore equipment",
      href: "/products?category=equipment",
      icon: "package" as const,
    },
  ],
};

export const defaultTeamSection: {
  eyebrow: string;
  heading: string;
  description: string;
  viewAllUrl: string;
  members: TeamMemberSlide[];
} = {
  eyebrow: "Pioneers",
  heading: "Who we are",
  description:
    "Alphamed Global Limited is powered by clinicians, supply chain experts, and regional partners committed to keeping health systems stocked and responsive.",
  viewAllUrl: "/team",
  members: [
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
  ],
};

