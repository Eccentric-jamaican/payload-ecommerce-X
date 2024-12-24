"use client";

import { AddProductDialog } from "@/components/products/AddProductDialog";
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
      <div className="absolute inset-0 bg-dot-pattern" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      <div className="relative">
        {/* Header */}
        <div className="sticky top-[65px] z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4">
            <div className="flex flex-col gap-4">
              {/* Top Row - Search and Filters */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="bg-background pl-9"
                  />
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
                      className="gap-1.5 px-2 py-1 text-xs"
                    >
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary"
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
                      className="gap-1.5 px-2 py-1 text-xs"
                    >
                      {tech}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary"
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
                      <Button variant="outline" size="sm" className="gap-2">
                        Sort by:{" "}
                        <span className="font-medium">
                          {sortOption.charAt(0).toUpperCase() +
                            sortOption.slice(1)}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => setSortOption("featured")}
                      >
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

        <div className="container py-6">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-64">
              <div className="sticky top-[206px] rounded-lg border bg-card/50 p-6">
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
                {currentProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border bg-card/50 transition-all duration-500 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {product.previewImages?.[0]?.image &&
                          typeof product.previewImages[0].image !== "string" &&
                          product.previewImages[0].image.url ? (
                            <Image
                              src={product.previewImages[0].image.url}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted/30">
                              <span className="text-4xl font-medium text-muted-foreground/50">
                                {product.name[0]}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <Button
                            size="icon"
                            className="absolute right-4 top-4 h-8 w-8 translate-y-2 rounded-full opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
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
                      </Link>
                      <div className="space-y-3 p-5">
                        <Link
                          href={`/products/${product.id}`}
                          className="group/title"
                        >
                          <h3 className="line-clamp-1 text-lg font-medium transition-colors duration-300 group-hover/title:text-primary">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold">
                            {formatPrice(product.price)}
                          </p>
                          {product.category &&
                            typeof product.category === "object" && (
                              <Badge
                                variant="secondary"
                                className="font-normal"
                              >
                                {product.category.name}
                              </Badge>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8"
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
