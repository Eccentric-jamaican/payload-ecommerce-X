"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TopicOption = {
  slug: string;
  title: string;
};

type SortOrder = "desc" | "asc";

interface BlogFiltersProps {
  topics: TopicOption[];
  activeTopicSlug?: string;
  sortOrder: SortOrder;
}

const buildSearch = (
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

export const BlogFilters = ({
  topics,
  activeTopicSlug,
  sortOrder,
}: BlogFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicOptions = useMemo(
    () => [{ slug: "all", title: "All topics" }, ...topics],
    [topics],
  );

  const handleTopicChange = (value: string) => {
    const nextSearch = buildSearch(searchParams, {
      topic: value === "all" ? null : value,
    });
    router.replace(nextSearch ? `/blog?${nextSearch}` : "/blog", {
      scroll: false,
    });
  };

  const handleSortChange = (value: SortOrder) => {
    const nextSearch = buildSearch(searchParams, {
      sort: value === "desc" ? null : value,
    });
    router.replace(nextSearch ? `/blog?${nextSearch}` : "/blog", {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#1C1E21]">
      <span className="text-xs uppercase tracking-[0.35em] text-[#6B6F7B]">
        Browse by:
      </span>
      <Select
        value={activeTopicSlug ?? "all"}
        onValueChange={handleTopicChange}
      >
        <SelectTrigger className="h-8 w-40 rounded-full border border-transparent bg-transparent px-3 py-1 text-sm font-medium text-[#2450D3] focus:ring-0">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          {topicOptions.map((topic) => (
            <SelectItem key={topic.slug} value={topic.slug}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={handleSortChange}>
        <SelectTrigger className="h-8 w-32 rounded-full border border-transparent bg-transparent px-3 py-1 text-sm font-medium text-[#2450D3] focus:ring-0">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BlogFilters;
