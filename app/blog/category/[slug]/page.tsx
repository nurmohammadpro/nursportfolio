import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/app/components/blog/BlogCard";
import { getCategoryBySlug } from "@/app/lib/blog-types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getPostsByCategory(category: string, page: number = 1) {
  try {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("page", page.toString());
    params.append("limit", "12");

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false } };
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch category posts:", error);
    return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false } };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Blog`,
    description: category.description || `Articles about ${category.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const postsData = await getPostsByCategory(slug, parseInt(page));

  return (
    <div className="min-h-screen bg-(--primary) text-(--text-main) p-8 md:p-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-(--text-subtle) mb-4">
            <Link href="/blog" className="hover:text-(--brand) transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-(--brand)">{category.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-(--text-subtle) max-w-2xl">{category.description}</p>
          )}
        </header>

        {/* Posts */}
        {postsData.data.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {postsData.data.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {postsData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {postsData.pagination.hasPrev && (
                  <Link
                    href={`/blog/category/${slug}?page=${parseInt(page) - 1}`}
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
                    href={`/blog/category/${slug}?page=${parseInt(page) + 1}`}
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
            <h3 className="text-xl font-semibold text-(--text-main) mb-2">No posts in this category</h3>
            <p className="text-(--text-subtle) mb-4">
              Check back later for new content in this category.
            </p>
            <Link href="/blog" className="text-(--brand) hover:underline">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
