"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  slug: string;
  label: string;
};

interface ProductsFiltersProps {
  categories: Option[];
  clinicalAreas: Option[];
  activeCategory?: string;
  activeClinicalArea?: string;
}

const updateSearch = (
  params: URLSearchParams,
  updates: Record<string, string | null>,
) => {
  const next = new URLSearchParams(params.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });
  return next.toString();
};

export const ProductsFilters = ({
  categories,
  clinicalAreas,
  activeCategory,
  activeClinicalArea,
}: ProductsFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryOptions = useMemo(
    () => [{ slug: "all", label: "All categories" }, ...categories],
    [categories],
  );
  const clinicalAreaOptions = useMemo(
    () => [{ slug: "all", label: "All clinical areas" }, ...clinicalAreas],
    [clinicalAreas],
  );

  const handleCategoryChange = (value: string) => {
    const next = updateSearch(searchParams, {
      category: value === "all" ? null : value,
    });
    router.replace(next ? `/products?${next}` : "/products", { scroll: false });
  };

  const handleClinicalAreaChange = (value: string) => {
    const next = updateSearch(searchParams, {
      clinicalArea: value === "all" ? null : value,
    });
    router.replace(next ? `/products?${next}` : "/products", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#1C1E21]">
      <span className="text-xs uppercase tracking-[0.35em] text-[#6B6F7B]">
        Filter by:
      </span>
      <Select
        value={activeCategory ?? "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="h-9 w-44 rounded-full border border-transparent bg-[#F3F5FA] px-3 py-1 text-sm font-medium text-[#1C1E21] focus:ring-0">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option.slug} value={option.slug}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={activeClinicalArea ?? "all"}
        onValueChange={handleClinicalAreaChange}
      >
        <SelectTrigger className="h-9 w-52 rounded-full border border-transparent bg-[#F3F5FA] px-3 py-1 text-sm font-medium text-[#1C1E21] focus:ring-0">
          <SelectValue placeholder="Clinical area" />
        </SelectTrigger>
        <SelectContent>
          {clinicalAreaOptions.map((option) => (
            <SelectItem key={option.slug} value={option.slug}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductsFilters;
