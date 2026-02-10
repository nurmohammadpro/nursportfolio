// Blog post interface (type-safe version of Post model, excludes Mongoose document methods)
export interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  authorName: string;
  authorBio?: string;
  authorAvatar?: string;
  imageUrl?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  seoTitle?: string;
  seoDescription?: string;
  viewCount?: number;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

// Comment interfaces
export interface Comment {
  _id?: string;
  id?: string;
  postSlug: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
  parentId?: string | null;
  status: "pending" | "approved" | "rejected" | "spam";
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  likeCount: number;
  replies?: Comment[];
}

// Blog filters interface
export interface BlogFilters {
  search?: string;
  category?: string;
  tags?: string[];
  status?: "draft" | "published" | "all";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "viewCount";
  sortOrder?: "asc" | "desc";
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Predefined categories
export const BLOG_CATEGORIES: Omit<Category, "postCount">[] = [
  { id: "web-development", name: "Web Development", slug: "web-development", description: "Articles about modern web development technologies and practices" },
  { id: "react", name: "React", slug: "react", description: "React.js tutorials, tips, and best practices" },
  { id: "nextjs", name: "Next.js", slug: "nextjs", description: "Next.js framework guides and techniques" },
  { id: "wordpress", name: "WordPress", slug: "wordpress", description: "WordPress development and customization" },
  { id: "automation", name: "Automation", slug: "automation", description: "Workflow automation and productivity tools" },
  { id: "tutorial", name: "Tutorial", slug: "tutorial", description: "Step-by-step tutorials and guides" },
  { id: "general", name: "General", slug: "general", description: "General thoughts and updates" },
];

// Utility function to calculate reading time
export function calculateReadingTime(content: string): number {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "");
  // Count words (average reading speed: 200 words per minute)
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  return Math.max(1, readingTime); // Minimum 1 minute
}

// Utility function to generate excerpt
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

// Enhanced slugify function
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Generate slug from text (for tags/categories)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (category) {
    return { ...category, postCount: 0 };
  }
  return undefined;
}

// Get all categories
export function getAllCategories(): Category[] {
  return BLOG_CATEGORIES.map((c) => ({ ...c, postCount: 0 }));
}
