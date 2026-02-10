"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";
import { BlogPost, formatDate } from "@/app/lib/blog-types";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact" | "featured";
}

export default function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <article
      className={`group bg-(--secondary) rounded-lg overflow-hidden border border-(--border-color) hover:border-(--brand) transition-all duration-300 ${
        isFeatured ? "md:flex md:items-center" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`block overflow-hidden bg-(--subtle) ${
          isFeatured
            ? "md:w-1/2 md:h-80"
            : isCompact
            ? "h-40"
            : "h-48"
        }`}
      >
        {post.featuredImage || post.imageUrl ? (
          <Image
            src={post.featuredImage || post.imageUrl!}
            alt={post.title}
            width={isFeatured ? 600 : 400}
            height={isFeatured ? 400 : 250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-(--brand) text-white">
            <span className="text-4xl font-bold opacity-50">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      <div
        className={`p-4 sm:p-6 ${
          isFeatured ? "md:w-1/2 md:p-8" : ""
        }`}
      >
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wider bg-(--brand) text-white rounded">
            {post.category}
          </span>
          <div className="flex items-center gap-2 text-(--text-subtle) text-sm">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
          <div className="flex items-center gap-2 text-(--text-subtle) text-sm">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-bold text-(--text-main) group-hover:text-(--brand) transition-colors mb-2 ${
              isFeatured ? "text-2xl" : isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {post.title}
          </h3>
        </Link>

        {!isCompact && post.excerpt && (
          <p className="text-(--text-subtle) mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && !isCompact && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-(--text-muted)" />
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase()}`}
                className="text-sm text-(--text-subtle) hover:text-(--brand) transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
