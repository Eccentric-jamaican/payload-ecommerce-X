import { Metadata } from "next";
import CategoriesPageClient from "./page.client";

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

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
