import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/getSiteSettings";
import type { Blog, BlogTopic, SiteSetting } from "@/payload-types";
import { Instagram, Linkedin } from "lucide-react";
import { serializeLexical } from "./lexical-serializer";

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
} as const;

const formatDate = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return { title: "Blog Post Not Found" };
  }
  const payload = await getPayloadHMR({ config });

  const blog = await payload.find({
    depth: 2,
    collection: "blogs",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
  });

  if (!blog.docs[0]) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const post = blog.docs[0] as Blog;
  return {
    title: `${post.title} | Alphamed Global`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images:
        typeof post.featuredImage === "object" && post.featuredImage?.url
          ? [
              {
                url: post.featuredImage.url,
                alt: post.featuredImage.alt ?? post.title,
              },
            ]
          : undefined,
    },
  };
}

const BlogPostPage = async ({ params }: BlogPostProps) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const payload = await getPayloadHMR({ config });
  const siteSettings = (await getSiteSettings()) as SiteSetting;

  const blog = await payload.find({
    depth: 2,
    collection: "blogs",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
  });

  if (!blog.docs[0]) {
    notFound();
  }

  const post = blog.docs[0] as Blog;
  const featuredImage =
    typeof post.featuredImage === "object" && post.featuredImage !== null
      ? post.featuredImage
      : null;
  const featuredImageUrl =
    featuredImage && typeof featuredImage.url === "string"
      ? featuredImage.url
      : null;
  const featuredImageAlt =
    featuredImage && typeof featuredImage.alt === "string"
      ? featuredImage.alt
      : post.title;

  const socialLinks = siteSettings.blogSocialLinks ?? [];
  const topics =
    Array.isArray(post.topics) && post.topics.length > 0
      ? (post.topics.filter(
          (topic): topic is BlogTopic =>
            typeof topic === "object" &&
            topic !== null &&
            "title" in topic &&
            "slug" in topic,
        ) as BlogTopic[])
      : [];

  const topicLabels = topics.map((topic) => topic.title);
  const formattedDate = formatDate(post.publishedDate);
  const authorName =
    typeof post.author === "object" && post.author !== null
      ? `${post.author.firstName ?? ""} ${post.author.lastName ?? ""}`.trim()
      : null;

  const estimatedReadTime = (() => {
    if (!post.content) return null;
    const textContent = JSON.stringify(post.content);
    const words = textContent.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 225));
    return `${minutes} min read`;
  })();

  return (
    <article className="bg-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-0">
        <header className="space-y-6">
          {topicLabels.length > 0 ? (
            <div className="text-sm font-medium uppercase tracking-[0.25em] text-[#6CE269]">
              {topicLabels.join(" • ")}
            </div>
          ) : null}
          <h1 className="text-4xl font-semibold leading-tight text-[#0B0B0F] md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="max-w-3xl text-lg leading-8 text-[#394152]">
              {post.excerpt}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#4F5563]">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {authorName ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
                <span>By {authorName}</span>
              </>
            ) : null}
            {estimatedReadTime ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
                <span>{estimatedReadTime}</span>
              </>
            ) : null}
          </div>
          {socialLinks.length > 0 ? (
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((link) => {
                if (!link?.url || !link.platform) return null;
                const Icon =
                  iconMap[link.platform as keyof typeof iconMap];
                if (!Icon) return null;
                return (
                  <Link
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0B0B0F] text-[#0B0B0F] transition hover:bg-[#0B0B0F] hover:text-white"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span className="sr-only">{link.platform}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </header>

        {featuredImageUrl ? (
          <figure className="mt-12 overflow-hidden rounded-3xl">
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              width={
                typeof featuredImage?.width === "number"
                  ? featuredImage.width
                  : 1600
              }
              height={
                typeof featuredImage?.height === "number"
                  ? featuredImage.height
                  : 900
              }
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </figure>
        ) : null}

        <section className="mt-12 space-y-8 text-lg leading-8 text-[#2F3140]">
          {post.content ? serializeLexical(post.content) : null}
        </section>
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 pb-20 lg:px-0">
        <div className="mt-16 border-t border-[#E4E7EF] pt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2450D3] transition hover:text-[#163AA3]"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;







