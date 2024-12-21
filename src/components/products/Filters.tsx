"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Technology {
  id: string;
  name: string;
}

interface FiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedTechnologies: string[];
  setSelectedTechnologies: (technologies: string[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

export function Filters({
  selectedCategories,
  setSelectedCategories,
  selectedTechnologies,
  setSelectedTechnologies,
  priceRange,
  setPriceRange,
}: FiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, technologiesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/technologies"),
        ]);

        if (!categoriesRes.ok || !technologiesRes.ok) {
          throw new Error("Failed to fetch filters data");
        }

        const [categoriesData, technologiesData] = await Promise.all([
          categoriesRes.json(),
          technologiesRes.json(),
        ]);

        setCategories(categoriesData.docs || []);
        setTechnologies(technologiesData.docs || []);
      } catch (error) {
        console.error("Failed to fetch filters data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div>
          <div className="mb-4 h-6 w-24 rounded bg-gray-200"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={selectedCategories.includes(category.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([
                      ...selectedCategories,
                      category.name,
                    ]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category.name),
                    );
                  }
                }}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Technologies</h3>
        <div className="space-y-2">
          {technologies.map((tech) => (
            <label
              key={tech.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={selectedTechnologies.includes(tech.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTechnologies([
                      ...selectedTechnologies,
                      tech.name,
                    ]);
                  } else {
                    setSelectedTechnologies(
                      selectedTechnologies.filter((t) => t !== tech.name),
                    );
                  }
                }}
              />
              <span className="text-sm">{tech.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex items-center justify-between gap-4">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="h-9"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
