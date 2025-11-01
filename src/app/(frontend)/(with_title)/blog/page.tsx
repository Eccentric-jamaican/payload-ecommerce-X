import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { getSiteSettings } from "@/lib/getSiteSettings";
import type { Blog, SiteSetting } from "@/payload-types";
import { NewsletterCard } from "@/components/blog/NewsletterCard";
import { Instagram, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Alphamed Global",
  description: "Insights and updates from Alphamed Global.",
};

export const revalidate = 60;

type SearchParams = {
  sort?: string | string[];
};

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
} as const;

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const BlogPage = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const payload = await getPayloadHMR({ config });
  const siteSettings = (await getSiteSettings()) as SiteSetting;

  const resolvedSearch = (searchParams ? await searchParams : undefined) ?? {};
  const sortOrder =
    typeof resolvedSearch.sort === "string" &&
    resolvedSearch.sort.toLowerCase() === "asc"
      ? "asc"
      : "desc";

  const blogsQuery = await payload.find({
    collection: "blogs",
    depth: 2,
    where: {
      status: { equals: "published" },
    },
    sort: sortOrder === "asc" ? "publishedDate" : "-publishedDate",
  });

  const posts = blogsQuery.docs as Blog[];

  const heroHeading =
    siteSettings.blogHero?.heading ?? "New at Alphamed Blog";
  const heroSubheading =
    siteSettings.blogHero?.subheading ??
    "A collection of stories about our people, our capabilities and our products.";

  const socialLinks = siteSettings.blogSocialLinks ?? [];
  const newsletter = siteSettings.blogNewsletter ?? null;
  const showNewsletter = Boolean(newsletter?.enabled);

  const cards = posts.map((post) => {
    const featuredImage =
      typeof post.featuredImage === "object" &&
      post.featuredImage !== null &&
      "url" in post.featuredImage &&
      typeof post.featuredImage.url === "string"
        ? post.featuredImage
        : null;

    const publishedDisplay = formatDate(post.publishedDate);

    return (
      <article
        key={post.id}
        className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_36px_rgba(15,23,42,0.04)] ring-1 ring-[#EEF1F6] transition hover:-translate-y-1 hover:shadow-[0px_24px_48px_rgba(13,37,70,0.08)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFF4FB]">
          {featuredImage && featuredImage.url ? (
            <Image
              src={featuredImage.url}
              alt={
                (typeof featuredImage.alt === "string" && featuredImage.alt) ||
                post.title
              }
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 90vw"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-[#5B5F72]">
              Alphamed Global
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-5 bg-white p-8">
          <div className="space-y-4">
            <h3 className="text-[1.75rem] font-semibold leading-snug text-[#0B0B0F]">
              {post.title}
            </h3>
            {publishedDisplay ? (
              <time className="block text-sm italic text-[#4F5563]">
                {publishedDisplay}
              </time>
            ) : null}
            {post.excerpt ? (
              <p className="text-base leading-7 text-[#4F5563] line-clamp-4">
                {post.excerpt}
              </p>
            ) : null}
          </div>
          <div className="mt-auto flex items-center justify-between pt-2">
            <span />
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2450D3] transition hover:text-[#163AA3]"
            >
              Read article →
            </Link>
          </div>
        </div>
      </article>
    );
  });

  const cardsWithNewsletter = showNewsletter
    ? [
        ...cards.slice(0, 2),
        <NewsletterCard
          key="newsletter"
          title={newsletter?.title}
          description={newsletter?.description}
          ctaLabel={newsletter?.ctaLabel}
          ctaUrl={newsletter?.ctaUrl ?? undefined}
        />,
        ...cards.slice(2),
      ]
    : cards;

  return (
    <div className="bg-[#F5F6FA]">
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-[#0B0B0F] md:text-5xl">
            {heroHeading}
          </h1>
          <p className="text-lg leading-8 text-[#5B5F72]">{heroSubheading}</p>
          {socialLinks.length > 0 ? (
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((link) => {
                if (!link?.url || !link.platform) return null;
                const Icon =
                  iconMap[link.platform as keyof typeof iconMap];
                if (!Icon) return null;
                return (
                  <Link
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#0B0B0F] text-[#0B0B0F] transition hover:bg-[#0B0B0F] hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span className="sr-only">{link.platform}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-[#E4E7EF] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6B6F7B]">
                Browse all posts
              </span>
            </div>
          </div>

          {cardsWithNewsletter.length === 0 ? (
            <p className="mt-16 text-base text-[#5B5F72]">
              No blog posts published yet.
            </p>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {cardsWithNewsletter.map((card, index) => (
                <div key={index} className="h-full">
                  {card}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
