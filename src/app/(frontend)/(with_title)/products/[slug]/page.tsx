import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import type { Media, Product } from "@/payload-types";
import { serializeLexical } from "@/app/(frontend)/(with_title)/blog/lexical-serializer";

export const revalidate = 60;

const formatYouTubeEmbed = (url?: string | null) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return null;
  } catch {
    return null;
  }
};

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: "products",
    where: {
      status: { equals: "published" },
    },
    limit: 1000,
  });

  return products.docs
    .map((product) =>
      typeof product.slug === "string" && product.slug.length > 0
        ? { slug: product.slug }
        : null,
    )
    .filter(Boolean) as { slug: string }[];
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: "Product Not Found" };

  const payload = await getPayload({ config });
  const productQuery = await payload.find({
    collection: "products",
    depth: 2,
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
  });

  if (!productQuery.docs[0]) {
    return { title: "Product Not Found" };
  }

  const product = productQuery.docs[0] as Product;
  const heroAsset =
    Array.isArray(product.mediaGallery) &&
    product.mediaGallery[0] &&
    typeof product.mediaGallery[0].asset === "object" &&
    product.mediaGallery[0].asset !== null &&
    "url" in product.mediaGallery[0].asset
      ? (product.mediaGallery[0].asset as Media)
      : null;

  return {
    title: `${product.name} | Alphamed Global`,
    description: product.shortDescription ?? undefined,
    openGraph: heroAsset && heroAsset.url
      ? {
          title: product.name,
          description: product.shortDescription ?? undefined,
          images: [{ url: heroAsset.url, alt: heroAsset.alt ?? product.name }],
        }
      : undefined,
  };
}

const resolveMedia = (entry: Product["mediaGallery"][number] | undefined) => {
  if (
    entry &&
    typeof entry.asset === "object" &&
    entry.asset !== null &&
    "url" in entry.asset &&
    typeof entry.asset.url === "string"
  ) {
    return entry.asset as Media;
  }
  return null;
};

const ProductDetailPage = async ({ params }: PageParams) => {
  const { slug } = await params;
  if (!slug) notFound();

  const payload = await getPayload({ config });
  const productQuery = await payload.find({
    collection: "products",
    depth: 2,
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
  });

  if (!productQuery.docs[0]) {
    notFound();
  }

  const product = productQuery.docs[0] as Product;
  const heroImage = resolveMedia(
    Array.isArray(product.mediaGallery) ? product.mediaGallery[0] : undefined,
  );
  const additionalImages =
    Array.isArray(product.mediaGallery) && product.mediaGallery.length > 1
      ? product.mediaGallery
          .slice(1)
          .map((entry) => resolveMedia(entry))
          .filter((asset): asset is Media => Boolean(asset))
      : [];

  const categories =
    Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories
          .map((category) =>
            typeof category === "object" && category !== null && "name" in category
              ? (category.name as string)
              : null,
          )
          .filter(Boolean)
      : [];

  const clinicalAreas =
    Array.isArray(product.clinicalAreas) && product.clinicalAreas.length > 0
      ? product.clinicalAreas
          .map((area) =>
            typeof area === "object" && area !== null && "name" in area
              ? (area.name as string)
              : null,
          )
          .filter(Boolean)
      : [];

  const productFamily =
    typeof product.productFamily === "object" && product.productFamily !== null
      ? product.productFamily
      : null;

  const embedUrl = formatYouTubeEmbed(product.videoUrl);

  return (
    <article className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 lg:px-0 lg:pt-20">
        <header className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#6CE269]">
              {categories.length > 0 ? <span>{categories.join(" • ")}</span> : null}
              {clinicalAreas.length > 0 ? (
                <>
                  {categories.length > 0 ? (
                    <span className="h-1 w-1 rounded-full bg-[#6CE269]/60" />
                  ) : null}
                  <span>{clinicalAreas.join(" • ")}</span>
                </>
              ) : null}
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-[#0B0B0F] md:text-5xl">
              {product.name}
            </h1>
            {product.shortDescription ? (
              <p className="text-lg leading-8 text-[#4F5563]">
                {product.shortDescription}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#4F5563]">
              {product.productCode ? (
                <span>Product code: {product.productCode}</span>
              ) : null}
              {productFamily && "name" in productFamily ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
                  <span>Family: {productFamily.name}</span>
                </>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2450D3]">
                {product.inStock ? "In Stock" : "Backorder"}
              </span>
            </div>
            {product.cta?.label && product.cta?.url ? (
              <div className="pt-2">
                <Link
                  href={product.cta.url}
                  className="inline-flex items-center justify-center rounded-full bg-[#0B0B0F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a1a25]"
                >
                  {product.cta.label}
                </Link>
              </div>
            ) : null}
          </div>

          {heroImage && heroImage.url ? (
            <div className="overflow-hidden rounded-3xl bg-[#EEF3FB] p-6">
              <div className="relative mx-auto aspect-[4/3] w-full">
                <Image
                  src={heroImage.url}
                  alt={
                    (typeof heroImage.alt === "string" && heroImage.alt) || product.name
                  }
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 550px, 90vw"
                  priority
                />
              </div>
              {product.mediaGallery?.[0]?.caption ? (
                <p className="mt-4 text-center text-sm text-[#4F5563]">
                  {product.mediaGallery[0]?.caption}
                </p>
              ) : null}
            </div>
          ) : null}
        </header>

        {additionalImages.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {additionalImages.map((asset) => (
              <div
                key={asset.id}
                className="overflow-hidden rounded-3xl bg-[#F7F9FC] p-4"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={asset.url ?? ""}
                    alt={asset.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 90vw"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <section className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-8 text-lg leading-8 text-[#2F3140]">
            {product.description ? serializeLexical(product.description) : null}
            {embedUrl ? (
              <div className="overflow-hidden rounded-3xl bg-[#121A2C] p-2">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full rounded-2xl"
                    title={`${product.name} product video`}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-10">
            {Array.isArray(product.keyUses) && product.keyUses.length > 0 ? (
              <div className="rounded-3xl bg-[#F7F9FC] p-8">
                <h2 className="text-xl font-semibold text-[#0B0B0F]">
                  Key uses
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#4F5563]">
                  {product.keyUses.map((use, index) => (
                    <li key={`${use?.item ?? index}`} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#55B948]" />
                      <span>{use?.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {Array.isArray(product.technicalSpecs) &&
            product.technicalSpecs.length > 0 ? (
              <div className="rounded-3xl bg-[#0B0B0F] p-8 text-white shadow-[0px_22px_40px_rgba(7,17,36,0.35)]">
                <h2 className="text-xl font-semibold">Technical specs</h2>
                <dl className="mt-6 space-y-4 text-sm">
                  {product.technicalSpecs.map((spec, index) => (
                    <div
                      key={`${spec?.label ?? spec?.value ?? index}`}
                      className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-none last:pb-0"
                    >
                      <dt className="text-white/70">{spec?.label}</dt>
                      <dd className="text-white">{spec?.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </aside>
        </section>

        <div className="mt-16 border-t border-[#E4E7EF] pt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2450D3] transition hover:text-[#163AA3]"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductDetailPage;
