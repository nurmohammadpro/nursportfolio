"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon } from "lucide-react";
import { generateSlug, calculateReadingTime, generateExcerpt, BLOG_CATEGORIES } from "@/app/lib/blog-types";
import Button from "@/app/components/Button";

const TiptapEditor = dynamic(() => import("@/app/components/blog/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-(--secondary) border border-(--border-color) rounded-lg animate-pulse" />
  ),
});

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postId, setPostId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "general",
    tags: [] as string[],
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    params.then((p) => {
      setPostId(p.id);
      fetchPost(p.id);
    });
  }, [params]);

  const fetchPost = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/blog`);
      const data = await response.json();
      const posts = data.data || data;
      const post = posts.find((p: any) => (p._id === id || p.id === id));

      if (post) {
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          category: post.category || "general",
          tags: post.tags || [],
          featuredImage: post.featuredImage || "",
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
          isPublished: post.isPublished || false,
        });
      } else {
        alert("Post not found");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      alert("Failed to load post");
      router.push("/admin/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
      excerpt: formData.excerpt || generateExcerpt(content),
    });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, featuredImage: data.url });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/blog/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSave = async (publish: boolean = false) => {
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const readingTime = calculateReadingTime(formData.content);
      const excerpt = formData.excerpt || generateExcerpt(formData.content);

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          excerpt,
          readingTime,
          isPublished: publish,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        setTimeout(() => router.push("/admin/blog"), 500);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save post");
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-(--text-subtle)">Loading post...</div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 text-(--text-subtle) hover:text-(--brand)"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>
          <div className="flex gap-2">
            <Button onClick={() => handleSave(false)} loading={isSaving}>
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} loading={isSaving}>
              {formData.isPublished ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>
        <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
          {formData.featuredImage && (
            <img src={formData.featuredImage} alt="Featured" className="w-full rounded-lg mb-6" />
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 text-(--text-subtle) hover:text-(--brand)"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Edit Post</h1>
            <p className="text-sm text-(--text-subtle)">
              Edit your blog post
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={() => setPreviewMode(true)}
            disabled={!formData.content}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button onClick={() => handleSave(false)} loading={isSaving}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button onClick={() => handleSave(true)} loading={isSaving}>
            {formData.isPublished ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== "idle" && (
        <div className="text-sm text-(--text-subtle)">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved successfully!"}
          {saveStatus === "error" && "Failed to save"}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              className="w-full px-4 py-3 text-2xl font-semibold bg-(--secondary) border border-(--border-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand)"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-(--text-main) mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-url-slug"
              className="w-full px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
            />
          </div>

          {/* Content Editor */}
          <div>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              onImageUpload={handleEditorImageUpload}
              placeholder="Start writing your post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">Featured Image</h3>
            {formData.featuredImage ? (
              <div className="relative">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  onClick={() => setFormData({ ...formData, featuredImage: "" })}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-8 border-2 border-dashed border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
              >
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-(--text-muted)" />
                <p className="text-sm text-(--text-subtle)">
                  {isUploading ? "Uploading..." : "Click to upload image"}
                </p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Category */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">Category</h3>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">Tags</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover)"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-(--subtle) rounded text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-(--text-muted) hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">Excerpt</h3>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description..."
              rows={3}
              className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand) resize-none"
            />
          </div>

          {/* SEO */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-(--text-subtle) mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Override title for SEO..."
                  className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                />
              </div>
              <div>
                <label className="block text-sm text-(--text-subtle) mb-1">Meta Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Meta description for search engines..."
                  rows={3}
                  className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand) resize-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-4">
            <h3 className="font-semibold text-(--text-main) mb-3">Status</h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  formData.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {formData.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
