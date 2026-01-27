// app/(auth)/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Post } from "@/app/lib/blog-types";
import { authenticatedFetch } from "@/app/lib/api";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); // FIX: Start with 'true' for initial load
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // FIX: Correct API endpoint
        const res = await authenticatedFetch("/api/admin/blog");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }
        const data = await res.json();
        // FIX: The API returns an array directly, not an object.
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      const res = await authenticatedFetch(`/api/admin/blog/${post.id}`, {
        // FIX: Correct HTTP method
        method: "PUT",
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to update post status");
      }

      const updatedPost = await res.json();
      setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* A better loading spinner */}
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-error">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-on-surface">
            Manage Posts
          </h1>
          {/* FIX: Wrap Button in Link for proper navigation */}
          <Link href="/admin/new">
            <Button variant="contained">Create New Post</Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-on-surface-variant">
            You haven't created any posts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                variant="default"
                heading={post.title}
                description={post.content.substring(0, 150) + "..."}
                bottomSubHeading={`Status: ${post.isPublished ? "Published" : "Draft"}`}
                actionLabel="Edit"
                onActionClick={() => router.push(`/admin/edit/${post.id}`)} // Use router.push
              >
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => handlePublish(post)}
                    icon={
                      post.isPublished ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )
                    }
                  >
                    {post.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    icon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
