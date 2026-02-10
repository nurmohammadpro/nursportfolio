import { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/app/components/blog/BlogCard";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getPostsByTag(tag: string, page: number = 1) {
  const params = new URLSearchParams();
  params.append("tags", tag);
  params.append("page", page.toString());
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `#${slug} | Blog`,
    description: `Posts tagged with ${slug}`,
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  const postsData = await getPostsByTag(slug, parseInt(page));
  const tagName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
            <span className="text-(--brand)">#{slug}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Tag: <span className="text-(--brand)">#{slug}</span>
          </h1>
          <p className="text-lg text-(--text-subtle)">
            {postsData.pagination.total} {postsData.pagination.total === 1 ? "post" : "posts"} tagged with "{tagName}"
          </p>
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
                    href={`/blog/tag/${slug}?page=${parseInt(page) - 1}`}
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
                    href={`/blog/tag/${slug}?page=${parseInt(page) + 1}`}
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
            <h3 className="text-xl font-semibold text-(--text-main) mb-2">No posts with this tag</h3>
            <p className="text-(--text-subtle) mb-4">
              Check back later for new content with this tag.
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
