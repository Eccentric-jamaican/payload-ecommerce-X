import { FC } from "react";
import configPromise from "@/payload.config";
import { getPayload } from "payload";
import ProductPageClient from "./page.client";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductPage: FC<ProductPageProps> = async ({ params }) => {
  const { id } = await params;

  const payload = await getPayload({ config: configPromise });

  const product = await payload.findByID({
    collection: "digital-products",
    id,
  });

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
