"use client";

import { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  Star,
  ArrowRight,
  ShoppingBag,
  Check,
} from "lucide-react";
import Image from "next/image";
import { Category, Product } from "@/payload-types";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

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
                Thousands Of Design Assets Ready To{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Download</span>
                  <span
                    className="absolute inset-0 z-0 -skew-y-2 bg-gradient-to-r from-purple-500 to-pink-500"
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>
            <div className="animation-delay-400 animate-fade-in-up">
              <p className="max-w-2xl text-xl leading-relaxed text-gray-300">
                Discover curated products that blend style with innovation. Join
                thousands of satisfied customers worldwide and transform your
                projects.
              </p>
            </div>
            <div className="animation-delay-600 flex animate-fade-in-up flex-wrap gap-4 pt-6">
              <Button
                size="lg"
                className="transform bg-white text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transform border-white/30 bg-transparent text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-white"
              >
                View Collections
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-16">
        <div className="container mx-auto overflow-visible pb-24">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-[2fr,1fr,1fr,1fr]">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="h-12 w-full pl-10 pr-4 text-base placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <Button className="shrink-0 transform transition-all duration-300 hover:scale-105">
                    Search
                  </Button>
                </div>
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex animate-fade-in-up items-center gap-4"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 hover:scale-110">
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

      <section className="relative bg-dot-pattern py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
        <div className="container relative mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Trending Categories
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore our most popular categories and discover high-quality
              digital assets
            </p>
          </div>
          <div
            ref={categoriesRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {initialCategories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="category-card group overflow-hidden border-0 bg-card opacity-0 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl font-bold text-muted-foreground/30">
                            {category.name[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
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

      <section className="relative bg-dot-pattern py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
        <div className="container relative mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Featured Products
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover our handpicked selection of premium digital assets
            </p>
          </div>
          <div
            ref={productsRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {initialProducts.map((product) => (
              <Card
                key={product.id}
                className="product-card group overflow-hidden border-0 bg-card opacity-0 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              >
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {product.previewImages?.[0]?.image &&
                      typeof product.previewImages[0].image !== "string" &&
                      product.previewImages[0].image.url ? (
                        <Image
                          src={product.previewImages[0].image.url}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-4xl text-muted-foreground/30">
                            {product.name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Button
                        size="icon"
                        className="absolute right-4 top-4 h-8 w-8 translate-y-2 rounded-full opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
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
                  <div className="p-6">
                    <Link
                      href={`/products/${product.id}`}
                      className="group/title"
                    >
                      <h3 className="text-lg font-semibold transition-colors duration-300 group-hover/title:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </span>
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
