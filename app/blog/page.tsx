import { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/app/components/blog/BlogCard";
import BlogFilters from "@/app/components/blog/BlogFilters";
import { BLOG_CATEGORIES } from "@/app/lib/blog-types";

export const metadata: Metadata = {
  title: "Blog | Nur Mohammad - Web Application Developer",
  description: "Insights on Javascript, React, Next.js, and Web Automation from a professional developer.",
};

async function getBlogPosts(searchParams: {
  search?: string;
  category?: string;
  tags?: string;
  page?: string;
}) {
  const params = new URLSearchParams();
  if (searchParams.search) params.append("search", searchParams.search);
  if (searchParams.category) params.append("category", searchParams.category);
  if (searchParams.tags) params.append("tags", searchParams.tags);
  params.append("page", searchParams.page || "1");
  params.append("limit", "12");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false } };
  }

  return response.json();
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/blog/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: BLOG_CATEGORIES.map((c) => ({ ...c, postCount: 0 })) };
  }

  return response.json();
}

async function getTags() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/blog/tags`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: [] };
  }

  return response.json();
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; tags?: string; page?: string };
}) {
  const [postsData, categoriesData, tagsData] = await Promise.all([
    getBlogPosts(searchParams),
    getCategories(),
    getTags(),
  ]);

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
              availableCategories={categoriesData.data}
              availableTags={tagsData.data}
              onFilterChange={() => {}}
            />
          </aside>

          {/* Main Content */}
          <div>
            {postsData.data.length > 0 ? (
              <>
                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {postsData.data.map((post: any) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {postsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {postsData.pagination.hasPrev && (
                      <Link
                        href={`/blog?page=${parseInt(searchParams.page || "1") - 1}${
                          searchParams.search ? `&search=${searchParams.search}` : ""
                        }${
                          searchParams.category ? `&category=${searchParams.category}` : ""
                        }${
                          searchParams.tags ? `&tags=${searchParams.tags}` : ""
                        }`}
                        className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
                      >
                        Previous
                      </Link>
                    )}

                    <span className="text-(--text-subtle)">
                      Page {postsData.pagination.page} of {postsData.pagination.totalPages}
                    </span>

                    {postsData.pagination.hasNext && (
                      <Link
                        href={`/blog?page=${parseInt(searchParams.page || "1") + 1}${
                          searchParams.search ? `&search=${searchParams.search}` : ""
                        }${
                          searchParams.category ? `&category=${searchParams.category}` : ""
                        }${
                          searchParams.tags ? `&tags=${searchParams.tags}` : ""
                        }`}
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