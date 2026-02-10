"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BlogCard from "@/app/components/blog/BlogCard";
import BlogFilters from "@/app/components/blog/BlogFilters";
import { BLOG_CATEGORIES, BlogPost } from "@/app/lib/blog-types";
import { cn } from "@/app/lib/utils";

function BlogPageContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const tagsParam = searchParams.get("tags") || undefined;
  const pageParam = searchParams.get("page");

  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [pageParam]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (tagsParam) params.append("tags", tagsParam);
        params.append("page", currentPage.toString());
        params.append("limit", "12");

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          fetch(`${baseUrl}/api/blog?${params.toString()}`),
          fetch(`${baseUrl}/api/blog/categories`),
          fetch(`${baseUrl}/api/blog/tags`),
        ]);

        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data || []);
        }

        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setTags(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [search, category, tagsParam, currentPage]);

  return (
    <div className="min-h-screen bg-(--primary) text-(--text-main) p-8 md:p-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="p-heading-xl mb-4">The Dev Journal</h1>
          <p className="p-body text-(--text-subtle) max-w-2xl mx-auto">
            Insights on web development, Next.js, React, and automation. Documenting my journey building modern applications.
          </p>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BlogFilters
              availableCategories={categories}
              availableTags={tags}
              onFilterChange={(filters) => {
                // Update URL with new filters
                const newParams = new URLSearchParams();
                if (filters.search) newParams.set("search", filters.search);
                if (filters.category) newParams.set("category", filters.category);
                if (filters.tags && filters.tags.length > 0) newParams.set("tags", filters.tags.join(","));
                window.history.pushState({}, "", `/blog?${newParams.toString()}`);
              }}
            />
          </aside>

          {/* Main Content */}
          <div>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-(--secondary) border border-(--border-color) rounded-lg animate-pulse" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/blog?page=${currentPage - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}${tagsParam ? `&tags=${tagsParam}` : ""}`}
                        className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
                      >
                        Previous
                      </Link>
                    )}

                    <span className="text-(--text-subtle)">
                      Page {currentPage} of {totalPages}
                    </span>

                    {currentPage < totalPages && (
                      <Link
                        href={`/blog?page=${currentPage + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}${tagsParam ? `&tags=${tagsParam}` : ""}`}
                        className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-(--secondary) border border-(--border-color) rounded-lg">
                <h3 className="text-xl font-semibold text-(--text-main) mb-2">No posts found</h3>
                <p className="text-(--text-subtle)">
                  Try adjusting your filters or check back later for new content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-(--primary) text-(--text-main) p-8 md:p-24 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="text-(--text-subtle)">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
