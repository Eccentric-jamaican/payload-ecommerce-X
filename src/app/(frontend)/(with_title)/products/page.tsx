import type { Metadata } from "next";
import Link from "next/link";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { ProductsFilters } from "@/components/products/ProductsFilters";
import { ProductCard } from "@/components/products/ProductCard";
import type { Category, ClinicalArea, Product } from "@/payload-types";

export const metadata: Metadata = {
  title: "Products | Alphamed Global",
  description:
    "Explore Alphamed Global’s medical products, from diagnostics to supply-chain infrastructure.",
};

export const revalidate = 60;

type SearchParams = {
  category?: string | string[];
  clinicalArea?: string | string[];
};

const resolveSlugFromSearch = (value?: string | string[]) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const payload = await getPayloadHMR({ config });
  const resolvedSearch = (searchParams ? await searchParams : undefined) ?? {};

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

  const categories: Category[] = categoriesResult.docs.reduce<Category[]>((acc, category) => {
    if (
      typeof category === "object" &&
      category !== null &&
      "id" in category &&
      "slug" in category
    ) {
      acc.push(category as Category);
    }
    return acc;
  }, []);
  const clinicalAreas: ClinicalArea[] = clinicalAreasResult.docs.reduce<ClinicalArea[]>(
    (acc, area) => {
      if (
        typeof area === "object" &&
        area !== null &&
        "id" in area &&
        "slug" in area
      ) {
        acc.push(area as ClinicalArea);
      }
      return acc;
    },
    [],
  );

  const categoryOptions = categories.reduce<{ slug: string; label: string }[]>(
    (acc, category) => {
      if (typeof category.slug === "string" && category.slug.length > 0) {
        acc.push({ slug: category.slug, label: category.name });
      }
      return acc;
    },
    [],
  );

  const clinicalAreaOptions = clinicalAreas.reduce<
    { slug: string; label: string }[]
  >((acc, area) => {
    if (typeof area.slug === "string" && area.slug.length > 0) {
      acc.push({ slug: area.slug, label: area.name });
    }
    return acc;
  }, []);

  const activeCategorySlug = resolveSlugFromSearch(resolvedSearch.category);
  const activeClinicalAreaSlug = resolveSlugFromSearch(
    resolvedSearch.clinicalArea,
  );

  const activeCategory = activeCategorySlug
    ? categories.find((category) => category.slug === activeCategorySlug)
    : undefined;
  const activeClinicalArea = activeClinicalAreaSlug
    ? clinicalAreas.find((area) => area.slug === activeClinicalAreaSlug)
    : undefined;

  const productsQuery = await payload.find({
    depth: 2,
    collection: "products",
    sort: "name",
    where: {
      status: {
        equals: "published",
      },
      ...(activeCategory
        ? {
            categories: {
              contains: activeCategory.id,
            },
          }
        : {}),
      ...(activeClinicalArea
        ? {
            clinicalAreas: {
              contains: activeClinicalArea.id,
            },
          }
        : {}),
    },
  });

  const products = productsQuery.docs as Product[];

  const heroHeading = "Equip every facility with Alphamed";
  const heroSubheading =
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
              categories={categoryOptions}
              clinicalAreas={clinicalAreaOptions}
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
