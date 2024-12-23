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

const BrowsePage = async () => {
  const payload = await getPayload({ config: configPromise });

  const products = (
    await payload.find({
      collection: "products",
    })
  ).docs;

  const categories = (
    await payload.find({
      collection: "categories",
    })
  ).docs;

  const technologies = (
    await payload.find({
      collection: "technologies",
    })
  ).docs;

  return (
    <BrowsePageClient
      products={products}
      categories={categories}
      technologies={technologies}
    />
  );
};

export default BrowsePage;
