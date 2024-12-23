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

    const createObserver = (selector: string) => {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      }, observerOptions);
    };

    // Products observer
    const productsObserver = createObserver(".product-card");
    const productCards = productsRef.current?.querySelectorAll(".product-card");
    productCards?.forEach((card, index) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.animationDelay = `${index * 200}ms`;
      productsObserver.observe(card);
    });

    // Categories observer
    const categoriesObserver = createObserver(".category-card");
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
        <div className="container relative mx-auto py-32 lg:py-48">
          <div className="max-w-4xl space-y-8">
            <div className="animate-fade-in-up">
              <Badge
                variant="secondary"
                className="bg-white/10 text-white transition-colors duration-300 hover:bg-white/20"
              >
                🔥 New Collection Available
              </Badge>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h1 className="text-5xl font-bold tracking-tight text-white lg:text-7xl xl:text-8xl">
                Thousands Of Design Assets Ready To{" "}
                <span className="relative">
                  <span
                    className="absolute -inset-1 block -skew-y-3 bg-gradient-to-r from-purple-600 to-pink-600"
                    aria-hidden="true"
                  />
                  <span className="relative text-white">Download</span>
                </span>
              </h1>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <p className="max-w-2xl text-xl leading-relaxed text-gray-300">
                Discover curated products that blend style with innovation. Join
                thousands of satisfied customers worldwide and transform your
                projects.
              </p>
            </div>
            <div className="animate-fade-in-up animation-delay-600 flex flex-wrap gap-4 pt-6">
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

      <section className="relative -mt-8">
        <div className="container mx-auto">
          <Card className="transform shadow-2xl transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-[2fr,1fr,1fr,1fr]">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="border-gray-200 pl-10 pr-4 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button className="shrink-0 transform transition-all duration-300 hover:scale-105">
                    Search
                  </Button>
                </div>
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="animate-fade-in-up flex items-center gap-4"
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

      <section className="py-20">
        <div className="container mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
                Trending Categories
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular categories
              </p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="group">
                View All Categories{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div
            ref={categoriesRef}
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {initialCategories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="category-card group cursor-pointer overflow-hidden opacity-0 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 transition-transform duration-300 group-hover:scale-[1.02]">
                        {category.icon &&
                        typeof category.icon !== "string" &&
                        category.icon.url ? (
                          <div className="relative h-16 w-16 transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src={category.icon.url}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="text-4xl text-primary/80 transition-transform duration-300 group-hover:scale-110">
                            {category.name[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
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

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <div className="animate-fade-in-up mb-12 flex items-center justify-between">
            <div>
              <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked by our curators
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="group">
                View All Products{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div
            ref={productsRef}
            className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {initialProducts.map((product, index) => (
              <Card
                key={product.id}
                className="product-card group overflow-hidden opacity-0 transition-all duration-500 hover:shadow-xl"
                style={{
                  transform: "perspective(1000px)",
                }}
              >
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {product.previewImages?.[0]?.image &&
                      typeof product.previewImages[0].image !== "string" &&
                      product.previewImages[0].image.url ? (
                        <Image
                          src={product.previewImages[0].image.url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted-foreground">
                            No image available
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute right-3 top-3 flex gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-lg backdrop-blur-md"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCartAction(product);
                          }}
                          variant={
                            isInCart(product.id) ? "default" : "secondary"
                          }
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
                      <h3 className="font-semibold transition-colors duration-300 hover:underline group-hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold text-transparent">
                        {formatPrice(product.price)}
                      </p>
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
