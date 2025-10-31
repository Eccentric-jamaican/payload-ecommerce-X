"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/payload-types";

interface ProductCardProps {
  product: Product;
}

const resolvePrimaryImage = (
  product: Product,
): { url: string; alt: string } | null => {
  if (!Array.isArray(product.mediaGallery) || product.mediaGallery.length === 0) {
    return null;
  }

  const firstEntry = product.mediaGallery[0];
  if (!firstEntry) return null;

  if (
    typeof firstEntry.asset === "object" &&
    firstEntry.asset !== null &&
    "url" in firstEntry.asset &&
    typeof firstEntry.asset.url === "string"
  ) {
    return {
      url: firstEntry.asset.url,
      alt:
        (typeof firstEntry.asset.alt === "string" && firstEntry.asset.alt.length > 0
          ? firstEntry.asset.alt
          : product.name) ?? product.name,
    };
  }

  return null;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = resolvePrimaryImage(product);
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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_36px_rgba(15,23,42,0.04)] ring-1 ring-[#EEF1F6] transition hover:-translate-y-1 hover:shadow-[0px_24px_48px_rgba(13,37,70,0.08)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFF4FB]">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
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

      <div className="flex flex-1 flex-col gap-4 p-8">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold leading-tight text-[#0B0B0F]">
            {product.name}
          </h3>
          {product.shortDescription ? (
            <p className="text-base leading-7 text-[#4F5563]">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          {categories.length > 0 ? (
            <span className="text-sm font-medium text-[#4F5563]">
              {categories.join(" • ")}
            </span>
          ) : (
            <span />
          )}
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-[#2450D3] transition hover:text-[#163AA3]"
          >
            View product →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
