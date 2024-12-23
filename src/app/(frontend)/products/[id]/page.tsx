import { FC } from "react";
import configPromise from "@/payload.config";
import { getPayload } from "payload";
import ProductPageClient from "./page.client";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getProduct = async (id: string) => {
  const payload = await getPayload({ config: configPromise });
  const product = await payload.findByID({
    collection: "products",
    id,
  });
  return product;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  if (product.status === "draft") {
    return {
      title: "Product Not Found",
    };
  }

  const imageUrl =
    product.previewImages?.[0]?.image &&
    typeof product.previewImages[0].image !== "string" &&
    product.previewImages[0].image.url;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      title: product.name,
      description: product.description,
      card: "summary_large_image",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

const ProductPage: FC<ProductPageProps> = async ({ params }) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  if (product.status === "draft") {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
        </div>
      </div>
    );
  }

  return <ProductPageClient product={product} />;
};

export default ProductPage;
