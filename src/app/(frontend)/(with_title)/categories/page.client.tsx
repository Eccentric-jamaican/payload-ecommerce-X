"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Category } from "@/payload-types";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CategoriesPageClient = ({ categories }: { categories: Category[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const categoriesRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      categoriesObserver.disconnect();
    };
  }, []);

  return (
    <main className="relative mx-auto min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-dot-pattern" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      {/* Header */}
      <div className="container relative">
        <div className="pt-12">
          <h1 className="text-4xl font-bold md:text-5xl">Browse Categories</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our curated collection of digital assets across various
            categories
          </p>
        </div>
      </div>

      {/* Search and Grid */}
      <div className="container relative py-12">
        {/* Search */}
        <div className="mb-12 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="h-12 w-full pl-10 pr-4 text-base shadow-sm placeholder:text-muted-foreground/60 focus-visible:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No categories found matching your search.
            </p>
          </div>
        ) : (
          <div
            ref={categoriesRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredCategories.map((category) => (
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
                          <span className="text-4xl text-muted-foreground/30">
                            {category.name[0]}
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
        )}
      </div>
    </main>
  );
};

export default CategoriesPageClient;
