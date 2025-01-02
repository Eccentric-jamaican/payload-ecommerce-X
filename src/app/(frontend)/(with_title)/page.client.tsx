"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Category, Product } from "@/payload-types";
import { useCart } from "@/providers/CartProvider";
import {
  ArrowRight,
  Check,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef } from "react";

interface HomePageClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

const HomePageClient: FC<HomePageClientProps> = ({
  initialCategories,
  initialProducts,
}) => {
  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { addItem, items, removeItem } = useCart();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "-100px 0px",
    };

    const createObserver = () => {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      }, observerOptions);
    };

    // Products observer
    const productsObserver = createObserver();
    const productCards = productsRef.current?.querySelectorAll(".product-card");
    productCards?.forEach((card, index) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.animationDelay = `${index * 200}ms`;
      productsObserver.observe(card);
    });

    // Categories observer
    const categoriesObserver = createObserver();
    const categoryCards =
      categoriesRef.current?.querySelectorAll(".category-card");
    categoryCards?.forEach((card, index) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.animationDelay = `${index * 200}ms`;
      categoriesObserver.observe(card);
    });

    return () => {
      productsObserver.disconnect();
      categoriesObserver.disconnect();
    };
  }, []);

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

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.jpg')] bg-cover bg-fixed bg-center opacity-50 transition-opacity duration-700 hover:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-purple-900/30" />
        <div className="container relative mx-auto pb-32 pt-16 lg:py-48">
          <div className="max-w-4xl space-y-8">
            <div className="animate-fade-in-up">
              <Badge
                variant="secondary"
                className="bg-white/10 text-white transition-colors duration-300 hover:bg-white/20"
              >
                🔥 New Collection Available
              </Badge>
            </div>
            <div className="animation-delay-200 animate-fade-in-up">
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl xl:text-8xl">
                Premium Templates{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  For Modern Developers
                </span>
              </h1>
            </div>
            <div className="animation-delay-400 animate-fade-in-up">
              <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-xl">
                Start your next project with our professionally crafted
                templates. Save weeks of development time and focus on what
                matters most.
              </p>
            </div>
            <div className="animation-delay-600 flex animate-fade-in-up flex-wrap gap-4 pt-6">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary px-8 text-white transition-all hover:bg-primary/90"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Browsing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -z-0 translate-y-[100%] bg-gradient-to-r from-primary/80 to-primary transition-transform duration-300 group-hover:translate-y-0" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-white/10"
              >
                View Collections
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="animation-delay-800 animate-fade-in-up pt-12">
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Lifetime Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Premium Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Ready-to-Deploy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Stats Section */}
      <section className="relative -mt-16">
        <div className="container mx-auto overflow-visible px-4 pb-24">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-card to-card/95 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-[2fr,1fr,1fr,1fr]">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search templates, components..."
                      className="h-12 border-none bg-muted/50 pl-10 pr-4 text-base placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-12 bg-primary px-8 text-white transition-all hover:bg-primary/90"
                  >
                    Search
                  </Button>
                </div>
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex animate-fade-in-up items-center gap-4 rounded-lg bg-muted/30 p-4 backdrop-blur-sm transition-transform hover:scale-105"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold tracking-tight">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary"
            >
              Browse Categories
            </Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Find What You Need
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore our curated collection of templates and components
            </p>
          </div>
          <div
            ref={categoriesRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {initialCategories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="category-card group relative overflow-hidden border-none bg-gradient-to-br from-card to-card/95 opacity-0 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {category.icon &&
                      typeof category.icon !== "string" &&
                      category.icon.url ? (
                        <Image
                          src={category.icon.url}
                          alt={category.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-primary/5">
                          <span className="text-4xl text-primary/40">
                            {category.name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {category.description ||
                          `Explore ${category.name} products`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary"
            >
              New Arrivals
            </Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Featured Templates
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Hand-picked collection of our best-selling templates
            </p>
          </div>
          <div
            ref={productsRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {initialProducts.map((product) => (
              <Card
                key={product.id}
                className="product-card group relative overflow-hidden border-none bg-gradient-to-br from-card to-card/95 opacity-0 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {product.previewImages?.[0]?.image &&
                      typeof product.previewImages[0].image !== "string" &&
                      product.previewImages[0].image.url ? (
                        <>
                          <Image
                            src={product.previewImages[0].image.url}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                          />
                          {/* {product.compareAtPrice && (
                            <Badge className="absolute left-4 top-4 bg-green-500/90 text-white">
                              {Math.round(
                                ((product.compareAtPrice - product.price) /
                                  product.compareAtPrice) *
                                  100,
                              )}
                              % OFF
                            </Badge>
                          )} */}
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center bg-primary/5">
                          <span className="text-4xl text-primary/40">
                            {product.name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Button
                        size="icon"
                        className="absolute right-4 top-4 h-8 w-8 translate-y-2 rounded-full opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
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
                  </Link>
                  <div className="space-y-4 p-6">
                    <Link
                      href={`/products/${product.id}`}
                      className="group/title"
                    >
                      <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover/title:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {/* <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3 w-3",
                                star <= (product.rating || 0)
                                  ? "fill-current"
                                  : "fill-muted stroke-muted text-muted",
                              )}
                            />
                          ))}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      </div> */}
                      <Badge variant="secondary" className="font-medium">
                        {product.productType.split("-").join(" ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const stats = [
  {
    label: "Active Users",
    value: "50K+",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
  },
  {
    label: "Total Products",
    value: "10K+",
    icon: <ShoppingBag className="h-5 w-5 text-primary" />,
  },
  {
    label: "Happy Customers",
    value: "24K+",
    icon: <Star className="h-5 w-5 text-primary" />,
  },
];

export default HomePageClient;
