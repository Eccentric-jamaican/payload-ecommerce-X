import type { Metadata } from "next";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { getSiteSettings } from "@/lib/getSiteSettings";
import type {
  Category,
  ClinicalArea,
  Product,
  SiteSetting,
} from "@/payload-types";
import { ProductsFilters } from "@/components/products/ProductsFilters";
import { ProductCard } from "@/components/products/ProductCard";

export const metadata: Metadata = {
  title: "Products | Alphamed Global",
  description:
    "Explore Alphamed Global's medical products, from diagnostics to supply-chain infrastructure.",
};

export const revalidate = 10;

type SearchParams = {
  category?: string | string[];
  clinicalArea?: string | string[];
};

const resolveSlug = (value?: string | string[]) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const payload = await getPayload({ config });
  const siteSettings = (await getSiteSettings()) as SiteSetting;

  const resolvedSearch = (searchParams ? await searchParams : undefined) ?? {};
  const activeCategorySlug = resolveSlug(resolvedSearch.category);
  const activeClinicalAreaSlug = resolveSlug(resolvedSearch.clinicalArea);

  const [categoriesResult, clinicalAreasResult] = await Promise.all([
    payload.find({
      collection: "categories",
      sort: "name",
      limit: 100,
    }),
    payload.find({
      collection: "clinical-areas",
      sort: "name",
      limit: 100,
    }),
  ]);

  const categories = categoriesResult.docs.filter(
    (category): category is Category =>
      typeof category === "object" &&
      category !== null &&
      "slug" in category &&
      typeof category.slug === "string",
  );

  const clinicalAreas = clinicalAreasResult.docs.filter(
    (area): area is ClinicalArea =>
      typeof area === "object" &&
      area !== null &&
      "slug" in area &&
      typeof area.slug === "string",
  );

  const activeCategory = activeCategorySlug
    ? categories.find((category) => category.slug === activeCategorySlug)
    : undefined;
  const activeClinicalArea = activeClinicalAreaSlug
    ? clinicalAreas.find((area) => area.slug === activeClinicalAreaSlug)
    : undefined;

  const productsQuery = await payload.find({
    collection: "products",
    depth: 2,
    where: {
      status: { equals: "published" },
      ...(activeCategory
        ? { categories: { contains: activeCategory.id } }
        : {}),
      ...(activeClinicalArea
        ? { clinicalAreas: { contains: activeClinicalArea.id } }
        : {}),
    },
    sort: "name",
  });

  const products = productsQuery.docs as Product[];

  const heroHeading =
    siteSettings.productHero?.heading ??
    "Equip every facility with Alphamed";
  const heroSubheading =
    siteSettings.productHero?.subheading ??
    "Browse the Alphamed Global catalogue to discover vetted medical supplies, equipment, and logistics solutions.";

  return (
    <div className="bg-[#F5F6FA]">
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-[#0B0B0F] md:text-5xl">
            {heroHeading}
          </h1>
          <p className="text-lg leading-8 text-[#5B5F72]">{heroSubheading}</p>
          <div className="flex items-center gap-4 pt-4 text-sm text-[#4F5563]">
            <span>{productsQuery.totalDocs} products</span>
            <span className="h-1 w-1 rounded-full bg-[#4F5563]" />
            <Link href="/contact" className="font-semibold text-[#2450D3]">
              Need help choosing? Contact procurement →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E4E7EF] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <ProductsFilters
              categories={categories.map((category) => ({
                slug: category.slug,
                label: category.name,
              }))}
              clinicalAreas={clinicalAreas.map((area) => ({
                slug: area.slug,
                label: area.name,
              }))}
              activeCategory={activeCategory?.slug}
              activeClinicalArea={activeClinicalArea?.slug}
            />
          </div>

          {products.length === 0 ? (
            <p className="mt-16 text-base text-[#5B5F72]">
              No products found for the selected filters.
            </p>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
