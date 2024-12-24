import { Metadata } from "next";
import TestPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Test",
  description:
    "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  openGraph: {
    title: "Test",
    description:
      "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  },
  twitter: {
    title: "Test",
    description:
      "Discover curated products that blend style with innovation. Join thousands of satisfied customers worldwide.",
  },
};

export default async function TestPage() {
  return <TestPageClient />;
}
