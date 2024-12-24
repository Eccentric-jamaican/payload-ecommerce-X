"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Category } from "@/payload-types";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CategoriesPageClient = ({ categories }: { categories: Category[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] bg-dot-pattern">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-secondary/30">
                      {typeof category.icon !== "string" &&
                      category.icon &&
                      category.icon.url ? (
                        <Image
                          src={category.icon.url}
                          alt={category.name}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-secondary/30 text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
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
