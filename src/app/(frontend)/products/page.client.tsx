"use client";

import { AddProductDialog } from "@/components/products/AddProductDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { Category, Product, Technology } from "@/payload-types";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Filters } from "@/components/products/Filters";

const BrowsePageClient = ({
  products,
  categories,
  technologies,
}: {
  products: Product[];
  categories: Category[];
  technologies: Technology[];
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    [],
  );
  const [sortOption, setSortOption] = useState<string>("featured");
  const { addItem, items, removeItem } = useCart();
  const { user } = useAuth();

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  if (!products) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0) {
      const categoryName =
        typeof product.category === "object" && product.category
          ? product.category.name
          : "";
      if (!selectedCategories.includes(categoryName)) {
        return false;
      }
    }

    if (selectedTechnologies.length > 0) {
      const productTechs = Array.isArray(product.technology)
        ? product.technology.map((tech) =>
            typeof tech === "object" && tech ? tech.name : "",
          )
        : [];
      if (
        !selectedTechnologies.some((selected) =>
          productTechs.includes(selected),
        )
      ) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  const handleCartAction = (product: Product) => {
    if (isInCart(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
    }
  };

  console.log("sortedProducts", sortedProducts);
  console.log("filteredProducts", filteredProducts);

  return (
    <main className="bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-[65px] z-10 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto py-4">
          <div className="flex flex-col gap-4">
            {/* Top Row - Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9" />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-lg">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <Filters
                    categories={categories}
                    technologies={technologies}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedTechnologies={selectedTechnologies}
                    setSelectedTechnologies={setSelectedTechnologies}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Bottom Row - Active Filters and Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="gap-2 px-3 py-2"
                  >
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== category),
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedTechnologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="gap-2 px-3 py-2"
                  >
                    {tech}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedTechnologies(
                          selectedTechnologies.filter((t) => t !== tech),
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-4">
                {user?.role === "admin" && <AddProductDialog />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      Sort by:{" "}
                      {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortOption("featured")}>
                      Featured
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("newest")}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("price-low")}
                    >
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("price-high")}
                    >
                      Price: High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container p-4">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:w-64">
            <div className="sticky top-[202px] rounded-lg border bg-white p-6">
              <Filters
                categories={categories}
                technologies={technologies}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedTechnologies={selectedTechnologies}
                setSelectedTechnologies={setSelectedTechnologies}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
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
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border bg-white p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              1
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              2
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              3
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BrowsePageClient;
