"use client";

import { EditProductDialog } from "@/components/products/EditProductDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { DigitalProduct } from "@/payload-types";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

interface ExtendedDigitalProduct extends DigitalProduct {
  images?: Array<{ url: string }>;
  rating?: number;
  reviewCount?: number;
  compareAtPrice?: number;
  reviews?: Array<{
    rating: number;
    author: string;
    content: string;
    createdAt: string;
  }>;
  user?: {
    id: string;
  };
}

interface ProductPageClientProps {
  product: ExtendedDigitalProduct;
}

const ProductPageClient: FC<ProductPageClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [currentProduct, setCurrentProduct] =
    useState<ExtendedDigitalProduct>(product);

  const isOwner = user?.id === currentProduct.user?.id;

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(currentProduct, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${currentProduct.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    // Implement checkout logic
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  return (
    <main className="container mx-auto py-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {typeof currentProduct.previewImages?.[0].image !== "string" &&
            currentProduct.previewImages?.[0].image?.url ? (
              <Image
                src={currentProduct.previewImages[0].image?.url}
                alt={currentProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {currentProduct.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={image.url}
                    alt={`${currentProduct.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
                </div>
              </div>
              {isOwner && (
                <EditProductDialog
                  product={currentProduct}
                  onSuccess={(updatedProduct) =>
                    setCurrentProduct(updatedProduct as ExtendedDigitalProduct)
                  }
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (currentProduct.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {currentProduct.rating || 0} (
                  {currentProduct.reviewCount || 0} reviews)
                </span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">
                {currentProduct.salesCount || 0} sold
              </span>
            </div>
          </div>

          <div className="space-y-2 border-t py-4">
            <div className="text-3xl font-bold text-primary">
              ${currentProduct.price.toFixed(2)}
            </div>
            {currentProduct.compareAtPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ${currentProduct.compareAtPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="mb-2 font-semibold">Product Type</h2>
              <Badge variant="outline" className="text-sm">
                {currentProduct.productType
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
            </div>

            {currentProduct.technology &&
              currentProduct.technology.length > 0 && (
                <div>
                  <h2 className="mb-2 font-semibold">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.technology.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {typeof tech === "string" ? tech : tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div>
            <h2 className="mb-2 font-semibold">Quantity</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-16 rounded-lg border p-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" size="lg" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="font-semibold">Product Description</h2>
            <div className="prose max-w-none">
              <p>{currentProduct.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">
                  {typeof currentProduct.category === "string"
                    ? currentProduct.category
                    : currentProduct.category?.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">License:</span>
                <span className="ml-2">
                  {currentProduct.licensingOptions
                    ?.split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">
                  {formatDate(currentProduct.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="ml-2">
                  {formatDate(currentProduct.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <Card>
          <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
            {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
              <div className="space-y-6">
                {currentProduct.reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (review.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {review.author}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </Card>
      </section>

      {/* Similar Products Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* Add ProductCard components here when available */}
          <p className="col-span-full text-center text-muted-foreground">
            Similar products coming soon...
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProductPageClient;
