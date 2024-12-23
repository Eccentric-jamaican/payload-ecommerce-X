import { Metadata } from "next";
import CategoryPageClient from "./page.client";
import configPromise from "@/payload.config";
import { getPayload } from "payload";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const getCategory = async (slug: string) => {
  const payload = await getPayload({ config: configPromise });
  const category = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
  });
  return category.docs[0];
};

const getProducts = async (categoryId: string) => {
  const payload = await getPayload({ config: configPromise });
  const products = await payload.find({
    collection: "products",
    where: { category: { equals: categoryId } },
  });
  return products.docs;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const { name, description } = category;

  return {
    title: name,
    description: description || `Browse all ${name} products and templates`,
    openGraph: {
      title: name,
      description: description || `Browse all ${name} products and templates`,
    },
    twitter: {
      title: name,
      description: description || `Browse all ${name} products and templates`,
    },
  };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await getCategory(slug);
  const products = await getProducts(category.id);
  return <CategoryPageClient category={category} products={products} />;
};

export default CategoryPage;
