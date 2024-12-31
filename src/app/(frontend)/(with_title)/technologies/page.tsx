import { Metadata } from "next";
import TechnologiesPageClient from "./page.client";
import configPromise from "@/payload.config";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Technologies",
  description:
    "Browse through all our product technologies and find the perfect digital assets for your needs.",
  openGraph: {
    title: "Technologies",
    description:
      "Browse through all our product technologies and find the perfect digital assets for your needs.",
  },
  twitter: {
    title: "Technologies",
    description:
      "Browse through all our product technologies and find the perfect digital assets for your needs.",
  },
};

const getBrowsePage = async () => {
  const payload = await getPayload({ config: configPromise });

  return await payload.find({
    collection: "technologies",
    limit: 0,
  });
};

const TechnologiesPage = async () => {
  const technologies = await getBrowsePage();

  return <TechnologiesPageClient technologies={technologies.docs} />;
};

export default TechnologiesPage;
