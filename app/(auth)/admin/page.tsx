"use client";

import { useState, useEffect } from "react";
import { Post } from "@/app/lib/blog-types";
import { authenticatedFetch } from "@/app/lib/api";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authenticatedFetch("api/admin/posts");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.posts);
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
        method: "PUt",
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
      <div className="relative flex justify-center items-center min-h-screen">
        <span className="animate-spin w-2 h-2 "> Loading posts...</span>
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
          <Button variant="contained">
            <Link href="/admin/new">Create New Post</Link>
          </Button>
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
                onActionClick={() =>
                  (window.location.href = `/admin/edit/${post.id}`)
                }
              >
                {/* Extra Actions for the Card */}
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
