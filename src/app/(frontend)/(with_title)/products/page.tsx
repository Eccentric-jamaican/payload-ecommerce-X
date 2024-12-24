import { Metadata } from "next";
import BrowsePageClient from "./page.client";
import configPromise from "@/payload.config";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Browse Products",
  description:
    "Browse through our collection of high-quality digital assets and templates.",
  openGraph: {
    title: "Browse Products",
    description:
      "Browse through our collection of high-quality digital assets and templates.",
  },
  twitter: {
    title: "Browse Products",
    description:
      "Browse through our collection of high-quality digital assets and templates.",
  },
};

const getBrowsePage = async () => {
  const payload = await getPayload({ config: configPromise });

  const [productsResponse, categoriesResponse, technologiesResponse] =
    await Promise.all([
      payload.find({
        collection: "products",
      }),
      payload.find({
        collection: "categories",
      }),
      payload.find({
        collection: "technologies",
      }),
    ]);

  return {
    products: productsResponse.docs,
    categories: categoriesResponse.docs,
    technologies: technologiesResponse.docs,
  };
};

const BrowsePage = async () => {
  const { products, categories, technologies } = await getBrowsePage();
  return (
    <BrowsePageClient
      products={products}
      categories={categories}
      technologies={technologies}
    />
  );
};

export default BrowsePage;
