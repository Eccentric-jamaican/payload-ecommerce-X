import { Metadata } from "next";
import CategoriesPageClient from "./page.client";
import configPromise from "@/payload.config";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse through all our product categories and find the perfect digital assets for your needs.",
  openGraph: {
    title: "Categories",
    description:
      "Browse through all our product categories and find the perfect digital assets for your needs.",
  },
  twitter: {
    title: "Categories",
    description:
      "Browse through all our product categories and find the perfect digital assets for your needs.",
  },
};

const getBrowsePage = async () => {
  const payload = await getPayload({ config: configPromise });

  return await payload.find({
    collection: "categories",
    limit: 0,
  });
};

const CategoriesPage = async () => {
  const categories = await getBrowsePage();

  return <CategoriesPageClient categories={categories.docs} />;
};

export default CategoriesPage;
