"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Post } from "@/app/lib/blog-types";

interface RelatedPostsProps {
  currentPostSlug: string;
  category?: string;
  tags?: string[];
  limit?: number;
}

export default function RelatedPosts({
  currentPostSlug,
  category,
  tags = [],
  limit = 3,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          limit: limit.toString(),
          exclude: currentPostSlug,
        });

        if (category) {
          params.append("category", category);
        }

        if (tags.length > 0) {
          params.append("tags", tags.slice(0, 3).join(","));
        }

        const response = await fetch(`/api/blog?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch related posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostSlug, category, tags, limit]);

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-(--text-main) mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-(--subtle) rounded-lg h-40 mb-4"></div>
              <div className="bg-(--subtle) rounded h-6 mb-2 w-3/4"></div>
              <div className="bg-(--subtle) rounded h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-(--text-main) mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </div>
  );
}
