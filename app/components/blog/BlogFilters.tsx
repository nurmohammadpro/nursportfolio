"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { debounce } from "lodash";
import { cn } from "@/app/lib/utils";
import { BLOG_CATEGORIES } from "@/app/lib/blog-types";

interface BlogFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    category?: string;
    tags?: string[];
  }) => void;
  availableCategories?: Array<{ slug: string; name: string; postCount: number }>;
  availableTags?: Array<{ slug: string; name: string; postCount: number }>;
  className?: string;
}

export default function BlogFilters({
  onFilterChange,
  availableCategories = BLOG_CATEGORIES,
  availableTags = [],
  className,
}: BlogFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFilterChange({
        search: value || undefined,
        category: category !== "all" ? category : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
    }, 300),
    [category, selectedTags, onFilterChange]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    onFilterChange({
      search: search || undefined,
      category: newCategory !== "all" ? newCategory : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    onFilterChange({
      search: search || undefined,
      category: category !== "all" ? category : undefined,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSelectedTags([]);
    onFilterChange({});
  };

  const hasActiveFilters =
    search || category !== "all" || selectedTags.length > 0;

  return (
    <div className={cn("bg-(--secondary) border border-(--border-color) rounded-lg p-4", className)}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main)"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </span>
          <span className={cn("transition-transform", isExpanded ? "rotate-180" : "")}>
            ▼
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className={cn("md:block", isExpanded ? "block mt-4" : "hidden")}>
        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-(--text-main) mb-2">Category</h3>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} ({cat.postCount})
              </option>
            ))}
          </select>
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-(--text-main) mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 10).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => handleTagToggle(tag.slug)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors",
                    selectedTags.includes(tag.slug)
                      ? "bg-(--brand) text-white"
                      : "bg-(--primary) text-(--text-subtle) border border-(--border-color) hover:border-(--brand)"
                  )}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-(--text-subtle) hover:text-(--brand) transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
