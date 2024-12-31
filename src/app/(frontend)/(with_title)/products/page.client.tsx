"use client";

import { AddProductDialog } from "@/components/products/AddProductDialog";
import { Filters } from "@/components/products/Filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { Category, Product, Technology } from "@/payload-types";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import {
  ArrowUpDown,
  Check,
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
  const [currentPage, setCurrentPage] = useState(1);
  const { addItem, items, removeItem } = useCart();
  const { user } = useAuth();
  const productsPerPage = 12;

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

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handleCartAction = (product: Product) => {
    if (isInCart(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
    }
  };

  return (
    <main className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      <div className="relative">
        {/* Header */}
        <div className="sticky top-[65px] z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-6">
            <div className="flex flex-col gap-6">
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 transition-all duration-300 hover:scale-[1.01] hover:transform">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="h-12 bg-card pl-12 text-lg shadow-sm transition-shadow duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                        {(selectedCategories.length > 0 ||
                          selectedTechnologies.length > 0) && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedCategories.length +
                              selectedTechnologies.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-full max-w-sm border-r"
                    >
                      <SheetHeader className="space-y-2.5 pr-6">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Refine your search using the options below
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-8">
                        <Filters
                          categories={categories}
                          technologies={technologies}
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                          selectedTechnologies={selectedTechnologies}
                          setSelectedTechnologies={setSelectedTechnologies}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {[
                        { label: "Featured", value: "featured" },
                        { label: "Price: Low to High", value: "price-low" },
                        { label: "Price: High to Low", value: "price-high" },
                        { label: "Newest", value: "newest" },
                      ].map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          className="flex items-center justify-between"
                          onClick={() => setSortOption(option.value)}
                        >
                          {option.label}
                          {sortOption === option.value && (
                            <Check className="h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-primary/20"
                    >
                      {category}
                      <X
                        className="h-4 w-4 cursor-pointer transition-colors hover:text-primary"
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
                      className="gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-primary/20"
                    >
                      {tech}
                      <X
                        className="h-4 w-4 cursor-pointer transition-colors hover:text-primary"
                        onClick={() =>
                          setSelectedTechnologies(
                            selectedTechnologies.filter((t) => t !== tech),
                          )
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.previewImages?.[0]?.image &&
                      typeof product.previewImages[0].image !== "string" &&
                      product.previewImages[0].image.url && (
                        <Image
                          src={product.previewImages[0].image.url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                  </div>
                </Link>

                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/products/${product.id}`}
                        className="group/link"
                      >
                        <h3 className="line-clamp-2 font-medium transition-colors group-hover/link:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      {typeof product.category === "object" &&
                        product.category && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatPrice(product.price || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={() => handleCartAction(product)}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9"
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {user?.role?.includes("admin") && <AddProductDialog />}
    </main>
  );
};

export default BrowsePageClient;
