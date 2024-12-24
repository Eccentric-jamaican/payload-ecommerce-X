import { Metadata } from "next";
import HomePageClient from "./page.client";
import configPromise from "@/payload.config";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Digital Assets Marketplace",
  description:
    "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  openGraph: {
    title: "Digital Assets Marketplace",
    description:
      "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  },
  twitter: {
    title: "Digital Assets Marketplace",
    description:
      "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  },
};

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const [categories, products] = await Promise.all([
    payload.find({
      collection: "categories",
    }),
    payload.find({
      collection: "products",
      limit: 8,
      sort: "-createdAt",
    }),
  ]);

  return (
    <HomePageClient
      initialCategories={categories.docs}
      initialProducts={products.docs}
    />
  );
}
