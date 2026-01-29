"use client";

import { useState, useEffect } from "react";
import { Post } from "@/app/lib/blog-types";
import { authenticatedFetch } from "@/app/lib/api";
import Button from "@/app/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff, Edit3, Plus } from "lucide-react";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authenticatedFetch("/api/admin/blog");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await authenticatedFetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      const res = await authenticatedFetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to update post status");
      }

      const updatedPost = await res.json();
      setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-(--surface)">
        <div className="w-8 h-8 border-2 border-(--border-color) border-t-(--text-main) rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-(--surface) py-24">
      <div className="layout-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h1 className="text-6xl font-heading tracking-tighter">
              Manage{" "}
              <span className="italic text-(--text-muted)">Insights</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
              Central Control Panel
            </p>
          </div>
          <Link href="/admin/new">
            <Button variant="primary" icon={<Plus />}>
              New Post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-(--border-color) hover:bg-(--subtle) transition-colors px-4"
            >
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  {post.isPublished ? "Published" : "Draft"}
                </span>
                <h3 className="text-2xl font-heading group-hover:italic transition-all">
                  {post.title}
                </h3>
                <p className="text-sm text-(--text-muted) font-light line-clamp-1">
                  {post.content.substring(0, 100)}...
                </p>
              </div>

              <div className="flex gap-4 mt-6 md:mt-0">
                <Button
                  variant="outlined"
                  size="sm"
                  icon={<Edit3 size={16} />}
                  onClick={() => router.push(`/admin/edit/${post.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  icon={
                    post.isPublished ? <EyeOff size={16} /> : <Eye size={16} />
                  }
                  onClick={() => handlePublish(post)}
                >
                  {post.isPublished ? "Hide" : "Live"}
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  className="text-red-500 border-red-100 hover:bg-red-50"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
