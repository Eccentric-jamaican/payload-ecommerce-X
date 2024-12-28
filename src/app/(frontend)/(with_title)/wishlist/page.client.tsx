"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { useWishlist } from "@/providers/WishlistProvider";
import { Check, StarOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WishlistPageClient = () => {
  const { items, loading, isInWishlist, addToWishlist, removeFromWishlist } =
    useWishlist();

  const handleWishlistItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading)
    return (
      <main className="container relative min-h-[calc(100vh-4rem)]">
        <div className="mx-auto py-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] w-full rounded-lg bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );

  return (
    <main className="container relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-dot-pattern" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      {/* Header */}
      <div className="relative">
        <div className="pt-12">
          <h1 className="text-4xl font-bold md:text-5xl">Browse Categories</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our curated collection of digital assets across various
            categories
          </p>
        </div>
      </div>
      <div className="mx-auto py-8">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Your wishlist is empty</h2>
            <p className="text-gray-600">
              Start adding products to your wishlist while shopping!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border bg-card/50 transition-all duration-500 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {product.previewImages?.[0]?.image &&
                      typeof product.previewImages[0].image !== "string" &&
                      product.previewImages[0].image.url ? (
                        <Image
                          src={product.previewImages[0].image.url}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted/30">
                          <span className="text-4xl font-medium text-muted-foreground/50">
                            {product.name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Button
                        size="icon"
                        className="absolute right-4 top-4 h-8 w-8 translate-y-2 rounded-full shadow-lg backdrop-blur-md"
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlistItem(product);
                        }}
                        variant={
                          isInWishlist(product.id) ? "default" : "secondary"
                        }
                      >
                        {isInWishlist(product.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Link>
                  <div className="space-y-3 p-5">
                    <Link
                      href={`/products/${product.id}`}
                      className="group/title"
                    >
                      <h3 className="line-clamp-1 text-lg font-medium transition-colors duration-300 group-hover/title:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">
                        {formatPrice(product.price)}
                      </p>
                      {product.category &&
                        typeof product.category === "object" && (
                          <Badge variant="secondary" className="font-normal">
                            {product.category.name}
                          </Badge>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPageClient;
