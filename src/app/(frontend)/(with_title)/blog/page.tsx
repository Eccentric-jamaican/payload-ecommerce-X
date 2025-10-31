import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { getSiteSettings } from "@/lib/getSiteSettings";
import type { Blog, BlogTopic, SiteSetting } from "@/payload-types";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { NewsletterCard } from "@/components/blog/NewsletterCard";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Alphamed Global",
  description: "Insights and updates from Alphamed Global.",
};

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
} as const;

const formatDate = (input: string | null | undefined) => {
  if (!input) return null;
  const date = new Date(input);
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
  searchParams?: Promise<Record<string, string | string[]>>;
}) => {
  const payload = await getPayloadHMR({ config });
  const siteSettings = (await getSiteSettings()) as SiteSetting;

  const blogHero = siteSettings.blogHero ?? null;
  const socialLinks = siteSettings.blogSocialLinks ?? [];
  const newsletter = siteSettings.blogNewsletter ?? null;

  const resolvedSearchParams: Record<string, string | string[]> =
    (searchParams ? await searchParams : undefined) ?? {};

  const topicsResult = await payload.find({
    collection: "blog-topics",
    limit: 100,
    sort: "title",
  });

  const topics = topicsResult.docs
    .filter(
      (topic): topic is BlogTopic =>
        typeof topic === "object" &&
        topic !== null &&
        "slug" in topic &&
        "title" in topic &&
        "id" in topic,
    ) as BlogTopic[];

  const topicParamRaw = resolvedSearchParams.topic;
  const topicSlug =
    typeof topicParamRaw === "string"
      ? topicParamRaw
      : Array.isArray(topicParamRaw)
        ? topicParamRaw[0]
        : undefined;

  const sortParamRaw = resolvedSearchParams.sort;
  const sortOrder =
    typeof sortParamRaw === "string" && sortParamRaw === "asc" ? "asc" : "desc";

  const activeTopic = topicSlug
    ? topics.find((topic) => topic.slug === topicSlug)
    : undefined;
  const topicFilterId = activeTopic?.id;

  const blogQuery = await payload.find({
    depth: 2,
    collection: "blogs",
    where: {
      status: { equals: "published" },
      ...(topicFilterId
        ? {
            topics: {
              contains: topicFilterId,
            },
          }
        : {}),
    },
    sort: sortOrder === "asc" ? "publishedDate" : "-publishedDate",
  });

  const posts = blogQuery.docs as Blog[];

  const heroHeading = blogHero?.heading ?? "New at Alphamed Blog";
  const heroSubheading =
    blogHero?.subheading ??
    "A collection of stories about our people, our capabilities and our products.";

  const showNewsletter = Boolean(newsletter?.enabled);

  const cards = posts.map((post) => {
    const featuredImageData =
      typeof post.featuredImage === "object" &&
      post.featuredImage !== null &&
      "url" in post.featuredImage
        ? post.featuredImage
        : null;

    const featuredImageUrl =
      featuredImageData && typeof featuredImageData.url === "string"
        ? featuredImageData.url
        : null;
    const featuredImageAlt =
      featuredImageData && typeof featuredImageData.alt === "string"
        ? featuredImageData.alt
        : post.title;

    const topicLabels =
      Array.isArray(post.topics) && post.topics.length > 0
        ? post.topics
            .map((topic) =>
              typeof topic === "object" && topic !== null && "title" in topic
                ? (topic.title as string)
                : null,
            )
            .filter(Boolean)
        : [];

    const publishedDisplay = formatDate(post.publishedDate);

    return (
      <article
        key={post.id}
        className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_18px_36px_rgba(15,23,42,0.04)] ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-[0px_24px_48px_rgba(13,37,70,0.08)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#EAF4FF] to-[#F7F9FC]">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
            {topicLabels.length > 0 ? (
              <span className="text-sm font-medium text-[#4F5563]">
                {topicLabels.join(" • ")}
              </span>
            ) : (
              <span />
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2450D3] transition hover:text-[#163AA3]"
            >
              Read article
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    );
  });

  const gridItems = showNewsletter
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
            <BlogFilters
              topics={topics.map((topic) => ({
                slug: topic.slug,
                title: topic.title,
              }))}
              activeTopicSlug={activeTopic?.slug}
              sortOrder={sortOrder}
            />
          </div>

          {gridItems.length === 0 ? (
            <p className="mt-16 text-base text-[#5B5F72]">
              No blog posts published yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
              {gridItems.map((item, index) => (
                <div key={index} className="h-full">
                  {item}
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
