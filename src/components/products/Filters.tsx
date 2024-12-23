"use client";

import { Category, Technology } from "@/payload-types";

interface FiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedTechnologies: string[];
  setSelectedTechnologies: (technologies: string[]) => void;
  categories: Category[];
  technologies: Technology[];
}

export function Filters({
  selectedCategories,
  setSelectedCategories,
  selectedTechnologies,
  setSelectedTechnologies,
  categories,
  technologies,
}: FiltersProps) {
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
    </div>
  );
}
