"use client";

import { useEffect, useState } from "react";
import { Category } from "@/payload-types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.docs || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold">All Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Browse through all our product categories
          </p>
        </div>
      </div>

      {/* Search and Grid */}
      <div className="container mx-auto py-8">
        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse p-6">
                <div className="mb-4 h-24 w-24 rounded-xl bg-gray-200"></div>
                <div className="h-6 w-24 rounded bg-gray-200"></div>
                <div className="mt-2 h-4 w-32 rounded bg-gray-200"></div>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">
              No categories found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="group flex flex-col items-center p-8 transition-all hover:shadow-lg">
                  {category.icon &&
                  typeof category.icon !== "string" &&
                  category.icon.url ? (
                    <div className="mb-6 h-24 w-24 overflow-hidden rounded-xl">
                      <Image
                        src={category.icon.url}
                        alt={category.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 text-4xl transition-transform duration-300 group-hover:scale-105">
                      {category.name[0]}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {category.description ||
                      `Explore ${category.name} products`}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
