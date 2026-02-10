"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Eye, MessageSquare, Search, Filter } from "lucide-react";
import { Comment } from "@/app/lib/blog-types";
import { cn } from "@/app/lib/utils";

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all comments across all posts
  useEffect(() => {
    fetchComments();
  }, [statusFilter, page]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // We need to fetch comments for each post or create a dedicated admin comments API
      // For now, let's create a simple implementation
      const response = await fetch(`/api/admin/blog/comments?status=${statusFilter}&page=${page}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        // Fallback: try to get comments from posts endpoint
        console.log("Admin comments API not implemented yet");
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (commentId: string, postSlug: string) => {
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId && c._id !== commentId));
      }
    } catch (error) {
      console.error("Failed to approve comment:", error);
    }
  };

  const handleReject = async (commentId: string, postSlug: string) => {
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId && c._id !== commentId));
      }
    } catch (error) {
      console.error("Failed to reject comment:", error);
    }
  };

  const handleDelete = async (commentId: string, postSlug: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/blog/${postSlug}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId && c._id !== commentId));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleBatchApprove = async () => {
    // Implement batch approval
    alert("Batch approval not yet implemented");
  };

  const handleBatchDelete = async () => {
    // Implement batch deletion
    alert("Batch deletion not yet implemented");
  };

  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xl md:text-2xl font-semibold">
          Comment <span className="font-medium">Moderation</span>
        </p>
        <p className="text-sm text-(--text-subtle)">
          Manage and moderate comments across all posts
        </p>
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
            placeholder="Search comments..."
            className="w-full pl-10 pr-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        >
          <option value="all">All Comments</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p>
          <strong>Note:</strong> The admin comments API endpoint needs to be implemented to fetch
          all comments across all posts. Currently, this page shows the UI structure.
        </p>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-12 text-(--text-subtle)">Loading comments...</div>
      ) : comments.length > 0 ? (
        <>
          {/* Batch Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleBatchApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve Selected
            </button>
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 bg-(--border-color) border border-(--border-color)">
            {comments.map((comment: any) => (
              <div
                key={comment._id || comment.id}
                className="bg-(--surface) p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Comment Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-(--text-main)">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-(--text-subtle)">
                        {comment.authorEmail}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded",
                          comment.status === "approved" && "bg-green-100 text-green-800",
                          comment.status === "pending" && "bg-yellow-100 text-yellow-800",
                          comment.status === "rejected" && "bg-red-100 text-red-800"
                        )}
                      >
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-sm text-(--text-subtle) line-clamp-2 mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-(--text-muted)">
                      <Link
                        href={`/blog/${comment.postSlug}`}
                        className="hover:text-(--brand) transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 inline" /> View Post
                      </Link>
                      <span>•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {comment.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(comment._id || comment.id, comment.postSlug)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(comment._id || comment.id, comment.postSlug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <Link
                      href={`/blog/${comment.postSlug}#comments`}
                      target="_blank"
                      className="p-2 text-(--text-subtle) hover:text-(--brand) hover:bg-(--subtle) rounded transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(comment._id || comment.id, comment.postSlug)}
                      className="p-2 text-(--text-subtle) hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <X size={18} />
                    </button>
                  </div>
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
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-(--text-muted)" />
          <p className="text-(--text-subtle) mb-2">No comments found</p>
          <p className="text-sm text-(--text-muted)">
            {statusFilter === "pending"
              ? "No comments pending moderation"
              : "No comments match your filters"}
          </p>
        </div>
      )}
    </div>
  );
}
