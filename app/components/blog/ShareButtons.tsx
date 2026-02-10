"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

export default function ShareButtons({ title, url, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleShare = async (platform: "native" | "twitter" | "linkedin") => {
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else if (platform !== "native") {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-(--text-subtle) font-medium">Share:</span>

      {/* Native Share (mobile) */}
      {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
        <button
          onClick={() => handleShare("native")}
          className="p-2 rounded-full bg-(--secondary) border border-(--border-color) hover:border-(--brand) hover:text-(--brand) transition-colors"
          title="Share"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      )}

      {/* Twitter */}
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-full bg-(--secondary) border border-(--border-color) hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-full bg-(--secondary) border border-(--border-color) hover:border-[#0077B5] hover:text-[#0077B5] transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full bg-(--secondary) border border-(--border-color) hover:border-(--brand) hover:text-(--brand) transition-colors"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Link2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
