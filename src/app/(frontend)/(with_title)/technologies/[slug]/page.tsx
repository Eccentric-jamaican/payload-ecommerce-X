import { Metadata } from "next";
import TechnologyPageClient from "./page.client";
import configPromise from "@/payload.config";
import { BasePayload, getPayload } from "payload";

interface TechnologyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const technologies = (
    await payload.find({
      collection: "technologies",
    })
  ).docs;

  if (!technologies) {
    return [];
  }

  const params = technologies.map(({ slug }) => ({
    slug,
  }));

  return params;
}

const TechnologyPage = async ({ params }: TechnologyPageProps) => {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  const technology = await getTechnology(payload, slug);
  if (!technology) {
    throw new Error("Technology not found");
  }

  const products = await getProducts(payload, technology.id);

  return <TechnologyPageClient technology={technology} products={products} />;
};

export default TechnologyPage;

const getTechnology = async (payload: BasePayload, slug: string) => {
  const technology = await payload.find({
    collection: "technologies",
    where: { slug: { equals: slug } },
  });
  return technology.docs[0];
};

const getProducts = async (payload: BasePayload, technologyId: string) => {
  const products = await payload.find({
    collection: "products",
    where: { technology: { equals: technologyId } },
  });
  return products.docs;
};

export async function generateMetadata({
  params,
}: TechnologyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const technology = await getTechnology(payload, slug);

  if (!technology) {
    return {
      title: "Technology Not Found",
    };
  }

  const { name, description } = technology;

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
