"use client";

import { Category, Product } from "@/payload-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

const CategoryPageClient = ({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) => {
  const { addItem, items, removeItem } = useCart();

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const handleCartAction = (product: Product) => {
    if (isInCart(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
    }
  };

  if (!category) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link
            href="/"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Category Header */}
      <div className="bg-white">
        <div className="container mx-auto py-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            {category.icon &&
            typeof category.icon !== "string" &&
            category.icon.url ? (
              <div className="h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={category.icon.url}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-3xl">
                {category.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="mt-1 text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto py-12">
        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.previewImages?.[0]?.image &&
                    typeof product.previewImages[0].image !== "string" &&
                    product.previewImages[0].image.url ? (
                      <Image
                        src={product.previewImages[0].image.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          No image available
                        </p>
                      </div>
                    )}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCartAction(product);
                        }}
                        variant={isInCart(product.id) ? "default" : "secondary"}
                      >
                        {isInCart(product.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <ShoppingBag className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold hover:underline">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPageClient;
