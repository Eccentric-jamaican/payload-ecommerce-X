"use client";

import { EditProductDialog } from "@/components/products/EditProductDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, cn } from "@/lib/utils";
import { Product } from "@/payload-types";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { getAuthToken } from "@/actions/auth";

import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Download,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { FC, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ExtendedProduct extends Product {
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
  product: ExtendedProduct;
}

const ProductImageCarousel: FC<{ product: ExtendedProduct }> = ({
  product,
}) => {
  const [mainCarouselRef, mainEmbla] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
  });
  const [thumbCarouselRef, thumbEmbla] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(true);

  const images =
    product.previewImages
      ?.map((img) =>
        typeof img.image === "string" ? img.image : img.image?.url,
      )
      .filter(Boolean) || [];

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmbla || !thumbEmbla) return;
      mainEmbla.scrollTo(index);
    },
    [mainEmbla, thumbEmbla],
  );

  const onSelect = useCallback(() => {
    if (!mainEmbla || !thumbEmbla) return;
    setSelectedIndex(mainEmbla.selectedScrollSnap());
    thumbEmbla.scrollTo(mainEmbla.selectedScrollSnap());
  }, [mainEmbla, thumbEmbla]);

  const scrollPrev = useCallback(() => mainEmbla?.scrollPrev(), [mainEmbla]);
  const scrollNext = useCallback(() => mainEmbla?.scrollNext(), [mainEmbla]);

  // Autoplay functionality
  useEffect(() => {
    if (!mainEmbla || !isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      mainEmbla.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [mainEmbla, isPlaying, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!mainEmbla) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mainEmbla, scrollPrev, scrollNext]);

  useEffect(() => {
    if (mainEmbla) {
      mainEmbla.on("select", onSelect);
      onSelect();
    }
  }, [mainEmbla, onSelect]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="relative">
        <div
          className="overflow-hidden rounded-lg bg-gray-100"
          ref={mainCarouselRef}
        >
          <div className="flex touch-pan-y">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="group relative min-w-0 flex-[0_0_100%]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {isLoading[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  )}
                  <Image
                    src={imageUrl || ""}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    onLoadingComplete={() =>
                      setIsLoading((prev) => ({ ...prev, [index]: false }))
                    }
                    onLoadStart={() =>
                      setIsLoading((prev) => ({ ...prev, [index]: true }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden" ref={thumbCarouselRef}>
            <div className="flex gap-2 p-1">
              {images.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative aspect-square w-20 flex-[0_0_auto] overflow-hidden rounded-md transition-all hover:opacity-90",
                    selectedIndex === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={selectedIndex === index}
                >
                  <Image
                    src={imageUrl || ""}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductFeatures: FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-6 md:grid-cols-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Shield className="h-8 w-8 text-primary" />
        <h3 className="font-semibold">Secure License</h3>
        <p className="text-sm text-muted-foreground">
          Protected purchase & usage rights
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Download className="h-8 w-8 text-primary" />
        <h3 className="font-semibold">Instant Access</h3>
        <p className="text-sm text-muted-foreground">
          Download immediately after purchase
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Clock className="h-8 w-8 text-primary" />
        <h3 className="font-semibold">Lifetime Updates</h3>
        <p className="text-sm text-muted-foreground">Free updates & support</p>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <h3 className="font-semibold">Quality Assured</h3>
        <p className="text-sm text-muted-foreground">Tested & verified code</p>
      </div>
    </div>
  );
};

const ProductPageClient: FC<ProductPageClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [currentProduct, setCurrentProduct] =
    useState<ExtendedProduct>(product);
  const [isWishListed, setIsWishListed] = useState(false);

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

  const handleBuyNow = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication error. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: currentProduct.id,
              quantity: quantity,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout session creation failed");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Checkout Error",
        description:
          "There was a problem initiating checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: currentProduct.name,
        text: currentProduct.description,
        url: window.location.href,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        ? `${currentProduct.name} removed from your wishlist`
        : `${currentProduct.name} added to your wishlist`,
    });
  };

  return (
    <main className="container py-8">
      {/* Breadcrumb - can be implemented later */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <ProductImageCarousel product={currentProduct} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold">
                  {currentProduct.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= (currentProduct.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/25",
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {currentProduct.rating || 0} (
                      {currentProduct.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentProduct.salesCount || 0} sales
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isOwner && <EditProductDialog product={currentProduct} />}
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
                <span className="text-3xl font-bold">
                  £{currentProduct.price.toFixed(2)}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    £{currentProduct.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                {currentProduct.description}
              </p>
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
                <Button className="flex-1" onClick={handleBuyNow}>
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
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
              {currentProduct.category &&
                typeof currentProduct.category === "object" && (
                  <Badge variant="secondary">
                    {currentProduct.category.name}
                  </Badge>
                )}
              {currentProduct.technology?.map(
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

      {/* Additional Information */}
      <section className="mb-12">
        <Card>
          <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold">Additional Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </Card>
      </section>

      {/* Reviews Section */}
      <section className="mb-12">
        <Card>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              {user && !isOwner && (
                <Button variant="outline">Write a Review</Button>
              )}
            </div>
            {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
              <div className="space-y-6">
                {currentProduct.reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4",
                              star <= (review.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Similar Products Section */}
      <section>
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
