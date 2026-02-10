import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Comments from "@/app/components/blog/Comments";
import TableOfContents from "@/app/components/blog/TableOfContents";
import RelatedPosts from "@/app/components/blog/RelatedPosts";
import ShareButtons from "@/app/components/blog/ShareButtons";
import { formatDate, getCategoryBySlug } from "@/app/lib/blog-types";
import Button from "@/app/components/Button";

interface Post {
  _id: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorBio?: string;
  authorAvatar?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const category = getCategoryBySlug(post.category);
  const categoryName = category?.name || post.category;

  return {
    title: post.seoTitle || `${post.title} | Nur Mohammad`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.authorName],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export async function generateStaticParams() {
  // In a real app, you'd fetch all slugs from your database
  // For now, return empty array and use ISR/dynamic rendering
  return [];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const category = getCategoryBySlug(post.category);
  const categoryName = category?.name || post.category;

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Nur Mohammad",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="min-h-screen bg-(--primary) text-(--text-main)">
        {/* Back Button */}
        <div className="bg-(--secondary) border-b border-(--border-color)">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-(--text-subtle) hover:text-(--brand) transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-(--secondary) border-b border-(--border-color)">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Category & Tags */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/blog/category/${post.category}`}
                className="px-3 py-1 text-sm font-semibold uppercase tracking-wider bg-(--brand) text-white rounded"
              >
                {categoryName}
              </Link>
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

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-(--text-main) mb-6">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 text-(--text-subtle) mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons title={post.title} url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`} />
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <div className="max-w-4xl">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Bio */}
              {post.authorBio && (
                <div className="mt-12 p-6 bg-(--secondary) border border-(--border-color) rounded-lg">
                  <h3 className="text-lg font-semibold text-(--text-main) mb-2">About the Author</h3>
                  <p className="text-(--text-subtle)">{post.authorBio}</p>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase()}`}
                      className="px-3 py-1 text-sm bg-(--secondary) border border-(--border-color) rounded-full hover:border-(--brand) hover:text-(--brand) transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - TOC */}
            <aside>
              <TableOfContents />
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        <div className="max-w-7xl mx-auto px-8">
          <RelatedPosts
            currentPostSlug={post.slug}
            category={post.category}
            tags={post.tags}
          />
        </div>

        {/* Comments */}
        <div className="max-w-4xl mx-auto px-8 py-12">
          <Comments postSlug={post.slug} />
        </div>
      </article>
    </>
  );
}
