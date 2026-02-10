"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenTool, Eye, Trash2, Edit, Plus, Search, Filter } from "lucide-react";
import { Post } from "@/app/lib/blog-types";
import { cn } from "@/app/lib/utils";

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter, page]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", page.toString());

      const response = await fetch(`/api/admin/blog?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== id && post.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const response = await fetch(`/api/admin/blog/${post._id || post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((p) =>
            p._id === updatedPost._id || p.id === updatedPost.id ? updatedPost : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "react", label: "React" },
    { value: "nextjs", label: "Next.js" },
    { value: "wordpress", label: "WordPress" },
    { value: "automation", label: "Automation" },
    { value: "tutorial", label: "Tutorial" },
    { value: "general", label: "General" },
  ];

  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold">
            Blog <span className="font-medium">Manager</span>
          </p>
          <p className="text-sm text-(--text-subtle)">
            Manage your blog posts and content
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12 text-(--text-subtle)">Loading posts...</div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-1 bg-(--border-color) border border-(--border-color)">
            {posts.map((post: any) => (
              <div
                key={post._id || post.id}
                className="bg-(--surface) p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 group"
              >
                <div className="flex gap-4 flex-1">
                  {/* Thumbnail */}
                  {post.featuredImage ? (
                    <div className="w-16 h-16 flex-shrink-0 bg-(--subtle) rounded overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 bg-(--brand) rounded flex items-center justify-center text-white text-xl font-bold">
                      {post.title.charAt(0)}
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-semibold truncate">{post.title}</p>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded",
                          post.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-(--text-subtle)">
                      {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs text-(--text-muted) bg-(--subtle) px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-(--text-subtle) hover:text-(--brand) cursor-pointer"
                    title="View"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/admin/blog/${post._id || post.id}/edit`}
                    className="text-(--text-subtle) hover:text-(--brand) cursor-pointer"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={cn(
                      "cursor-pointer",
                      post.isPublished
                        ? "text-(--text-subtle) hover:text-yellow-600"
                        : "text-green-600 hover:text-green-700"
                    )}
                    title={post.isPublished ? "Unpublish" : "Publish"}
                  >
                    <PenTool size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id || post.id)}
                    className="text-(--text-subtle) hover:text-red-500 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-(--text-subtle)">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-(--secondary) border border-(--border-color) rounded-lg">
          <p className="text-(--text-subtle) mb-4">No posts found</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 text-(--brand) hover:underline"
          >
            <Plus className="w-4 h-4" />
            Create your first post
          </Link>
        </div>
      )}
    </div>
  );
}
