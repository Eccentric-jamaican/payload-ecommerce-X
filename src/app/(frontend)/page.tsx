"use client";

import { FC, useEffect, useState } from "react";
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
import { Category, DigitalProduct } from "@/payload-types";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

const HomePage: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items, removeItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.docs || []);

        const productsResponse = await fetch(
          "/api/products?limit=8&sort=-createdAt",
        );
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData.docs || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const handleCartAction = (product: DigitalProduct) => {
    if (isInCart(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.jpg')] bg-cover bg-right opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        <div className="container relative mx-auto py-32 lg:py-44">
          <div className="max-w-3xl space-y-6">
            <Badge
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              🔥 New Collection Available
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-white lg:text-7xl">
              Thousands Of Design Assets Ready To{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Download
              </span>
            </h1>
            <p className="max-w-xl text-xl text-gray-300">
              Discover curated products that blend style with innovation. Join
              thousands of satisfied customers worldwide.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                View Collections
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8">
        <div className="container mx-auto">
          <Card className="shadow-xl">
            <CardContent className="p-6 md:pl-8">
              <div className="grid gap-6 md:grid-cols-[2fr,1fr,1fr,1fr]">
                <div className="flex items-center gap-3">
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="border-gray-200"
                  />
                  <Button>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="font-semibold">{stat.value}</p>
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
              <h2 className="text-3xl font-bold">Trending Categories</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular categories
              </p>
            </div>
            <Link href="/categories">
              <Button variant="ghost">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4 md:p-6">
                    <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 transition-transform duration-300 group-hover:scale-105">
                      {category.icon &&
                      typeof category.icon !== "string" &&
                      category.icon.url ? (
                        <div className="h-12 w-12 overflow-hidden">
                          <Image
                            src={category.icon.url}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl">{category.name[0]}</div>
                      )}
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.description ||
                        `Explore ${category.name} products`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked by our curators
              </p>
            </div>
            <Link href="/browse">
              <Button variant="ghost">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="group animate-pulse overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gray-200" />
                    <div className="p-4">
                      <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                      <div className="h-4 w-full rounded bg-gray-200" />
                      <div className="mt-2 h-6 w-20 rounded bg-gray-200" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

export default HomePage;
