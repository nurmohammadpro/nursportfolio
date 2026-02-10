"use client";

import { useState, useEffect } from "react";
import { User, Mail, MessageSquare, Send, ThumbsUp, Flag } from "lucide-react";
import { Comment } from "@/app/lib/blog-types";
import { cn } from "@/app/lib/utils";

interface CommentsProps {
  postSlug: string;
  initialComments?: Comment[];
}

interface CommentFormData {
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  content: string;
  parentId?: string;
}

export default function Comments({ postSlug, initialComments = [] }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<CommentFormData>({
    authorName: "",
    authorEmail: "",
    authorUrl: "",
    content: "",
  });

  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments();
    }
  }, [postSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentId: replyTo || undefined,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Comment submitted for moderation!" });
        setFormData({ authorName: "", authorEmail: "", authorUrl: "", content: "" });
        setReplyTo(null);
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to submit comment" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit comment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentForm = ({ isReply = false }: { isReply?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-(--text-main) mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            required
            className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-(--text-main) mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
            required
            className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-(--text-main) mb-1">
          Website (optional)
        </label>
        <input
          type="url"
          id="url"
          value={formData.authorUrl}
          onChange={(e) => setFormData({ ...formData, authorUrl: e.target.value })}
          className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          placeholder="https://yourwebsite.com"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-(--text-main) mb-1">
          Comment *
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand) resize-none"
          placeholder="Share your thoughts..."
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-(--text-subtle)">
          Your email will not be published.
        </div>
        <div className="flex gap-2">
          {isReply && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 text-(--text-main) border border-(--border-color) rounded-lg hover:bg-(--subtle) transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div
      className={cn(
        "border border-(--border-color) rounded-lg p-4 bg-(--secondary)",
        isReply && "ml-8 mt-3"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-(--brand) flex items-center justify-center text-white font-semibold flex-shrink-0">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-(--text-main)">
              {comment.authorUrl ? (
                <a
                  href={comment.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-(--brand) transition-colors"
                >
                  {comment.authorName}
                </a>
              ) : (
                comment.authorName
              )}
            </h4>
            <span className="text-sm text-(--text-muted)">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-(--text-main) mt-2 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button className="flex items-center gap-1 text-sm text-(--text-subtle) hover:text-(--brand) transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Like
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id!)}
                className="flex items-center gap-1 text-sm text-(--text-subtle) hover:text-(--brand) transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Reply
              </button>
            )}
            <button className="flex items-center gap-1 text-sm text-(--text-subtle) hover:text-(--brand) transition-colors">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-(--secondary) border border-(--border-color) rounded-lg p-6">
      <h2 className="text-2xl font-bold text-(--text-main) mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="mb-8">
        {replyTo && (
          <div className="mb-4 p-3 bg-(--brand) bg-opacity-10 border border-(--brand) rounded-lg flex items-center justify-between">
            <span className="text-sm text-(--text-main)">Replying to comment...</span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-(--text-subtle) hover:text-(--brand)"
            >
              ✕
            </button>
          </div>
        )}
        <CommentForm />
      </div>

      {/* Message */}
      {message && (
        <div
          className={cn(
            "mb-4 p-3 rounded-lg",
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-(--text-subtle)">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} />
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-(--text-subtle)">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
}
