import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import type { Blog } from "@/payload-types";
import { getSiteSettings } from "@/lib/getSiteSettings";
import type { SiteSetting } from "@/payload-types";
import { Instagram, Linkedin } from "lucide-react";
import { serializeLexical } from "@/app/(frontend)/blog/lexical-serializer";

export const runtime = "nodejs";
export const revalidate = 10;

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const blogs = await payload.find({
    collection: "blogs",
    where: {
      status: { equals: "published" },
    },
    limit: 100,
    depth: 0,
  });

  return blogs.docs
    .filter((blog) => blog.slug && typeof blog.slug === "string")
    .map((blog) => ({
      slug: blog.slug as string,
    }));
}

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
} as const;

interface PageParams {
  params: Promise<{
    slug: string;
  }>;
}

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const estimateReadTime = (content: unknown) => {
  if (!content) return null;
  const text = typeof content === "string" ? content : JSON.stringify(content);
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 225));
  return `${minutes} min read`;
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: "Blog Post Not Found" };

  const payload = await getPayload({ config });
  const blog = await payload.find({
    collection: "blogs",
    depth: 2,
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
  });

  if (!blog.docs[0]) {
    return { title: "Blog Post Not Found" };
  }

  const post = blog.docs[0] as Blog;
  const featuredImage =
    typeof post.featuredImage === "object" &&
    post.featuredImage !== null &&
    "url" in post.featuredImage &&
    typeof post.featuredImage.url === "string"
      ? post.featuredImage
      : null;

  return {
    title: `${post.title} | Alphamed Global`,
    description: post.excerpt ?? undefined,
    openGraph: featuredImage && featuredImage.url
      ? {
          title: post.title,
          description: post.excerpt ?? undefined,
          images: [
            {
              url: featuredImage.url,
              alt: featuredImage.alt ?? post.title,
            },
          ],
        }
      : undefined,
  };
}

const BlogPostPage = async ({ params }: PageParams) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const payload = await getPayload({ config });
  const [siteSettings, blog] = await Promise.all([
    getSiteSettings() as Promise<SiteSetting>,
    payload.find({
      collection: "blogs",
      depth: 2,
      where: {
        slug: { equals: slug },
        status: { equals: "published" },
      },
    }),
  ]);

  if (!blog.docs[0]) {
    notFound();
  }

  const post = blog.docs[0] as Blog;
  const heroImage =
    typeof post.featuredImage === "object" &&
    post.featuredImage !== null &&
    "url" in post.featuredImage &&
    typeof post.featuredImage.url === "string"
      ? post.featuredImage
      : null;

  const authorName =
    typeof post.author === "object" && post.author !== null
      ? `${post.author.firstName ?? ""} ${post.author.lastName ?? ""}`.trim()
      : null;

  const formattedDate = formatDate(post.publishedDate);
  const readTime = estimateReadTime(post.content);

  const socialLinks = siteSettings.blogSocialLinks ?? [];

  return (
    <article className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 lg:px-0 lg:pt-20">
        <header className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-[#0B0B0F] md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="text-lg leading-8 text-[#4F5563]">{post.excerpt}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#4F5563]">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {authorName ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
                <span>By {authorName}</span>
              </>
            ) : null}
            {readTime ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
                <span>{readTime}</span>
              </>
            ) : null}
          </div>
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

        {heroImage && heroImage.url ? (
          <figure className="relative mt-12 overflow-hidden rounded-3xl bg-[#EEF3FB] p-6">
            <div className="relative mx-auto aspect-[4/3] w-full">
              <Image
                src={heroImage.url}
                alt={
                  (typeof heroImage.alt === "string" && heroImage.alt) || post.title
                }
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
              />
            </div>
            {typeof post.featuredImage === "object" && post.featuredImage !== null && "caption" in post.featuredImage ? (
              <figcaption className="mt-4 text-center text-sm text-[#4F5563]">
                {(post.featuredImage as { caption?: string })?.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <section className="mt-12 space-y-8 text-lg leading-8 text-[#2F3140]">
          {post.content ? serializeLexical(post.content) : null}
        </section>

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
