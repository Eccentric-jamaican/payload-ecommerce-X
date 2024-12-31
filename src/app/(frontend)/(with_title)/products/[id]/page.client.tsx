"use client";

import { EditProductDialog } from "@/components/products/EditProductDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

import { handleCheckout } from "@/actions/checkout";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductImageCarousel from "@/components/products/ProductImageCarousel";
import TabsSection from "@/components/products/TabsSection";
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { FC, useState } from "react";

interface ProductPageClientProps {
  product: Product;
}

const ProductPageClient: FC<ProductPageClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isWishListed, setIsWishListed] = useState(false);

  const ownerId =
    typeof product.seller !== "string" ? product.seller?.id : null;
  const isOwner = user?.id === ownerId;

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = async () => {
    try {
      const url = await handleCheckout([{ product, quantity }]);

      if (!url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = url;
    } catch (error: Error | unknown) {
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error ? error.message : "Failed to checkout",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const toggleWishlist = () => {
    setIsWishListed(!isWishListed);
    toast({
      title: isWishListed ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishListed
        ? `${product.name} removed from your wishlist`
        : `${product.name} added to your wishlist`,
    });
  };

  return (
    <main className="container py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <ProductImageCarousel product={product} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {product.salesCount || 0} sales
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isOwner && <EditProductDialog product={product} />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-10 w-10", isWishListed && "text-red-500")}
                  onClick={toggleWishlist}
                >
                  <Heart
                    className={cn("h-5 w-5", isWishListed && "fill-current")}
                  />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-4 flex items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                </div>
                {product.licensingOptions && (
                  <Badge variant="secondary" className="text-xs">
                    {product.licensingOptions
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}{" "}
                    License
                  </Badge>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2 border-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product.category && typeof product.category === "object" && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
              {product.technology?.map(
                (tech) =>
                  typeof tech !== "string" && (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">What&apos;s Included</h2>
        <ProductFeatures />
      </div>

      <TabsSection product={product} />

      {/* Similar Products Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* Add ProductCard components here when available */}
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              Similar products coming soon...
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPageClient;
