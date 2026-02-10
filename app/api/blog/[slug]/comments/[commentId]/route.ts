import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Comment from "@/app/models/Comment";
import Post from "@/app/models/Post";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";

type RouteParams = {
  slug: string;
  commentId: string;
};

// PUT /api/blog/[slug]/comments/[commentId] - Update comment status (admin only)
export const PUT = withAuth<RouteParams>(
  async (req: NextRequest, context: AuthenticatedContext<RouteParams>) => {
    try {
      await dbConnect();

      const { slug, commentId } = context.params;
      const body = await req.json();

      // Find the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }

      // Verify comment belongs to this post
      if (comment.postSlug !== slug) {
        return NextResponse.json(
          { error: "Comment does not belong to this post" },
          { status: 400 }
        );
      }

      const previousStatus = comment.status;

      // Update status if provided
      if (body.status && ["pending", "approved", "rejected", "spam"].includes(body.status)) {
        comment.status = body.status;
      }

      await comment.save();

      // Update post comment count if status changed
      if (previousStatus !== comment.status) {
        if (comment.status === "approved" && previousStatus !== "approved") {
          await Post.findOneAndUpdate(
            { slug },
            { $inc: { commentCount: 1 } }
          );
        } else if (comment.status !== "approved" && previousStatus === "approved") {
          await Post.findOneAndUpdate(
            { slug },
            { $inc: { commentCount: -1 } }
          );
        }
      }

      const formattedComment = {
        ...comment.toObject(),
        id: comment._id.toString(),
        _id: undefined,
      };

      return NextResponse.json({ data: formattedComment }, { status: 200 });
    } catch (error) {
      console.error("Failed to update comment:", error);
      return NextResponse.json(
        { error: "Internal Server Error: Could not update comment." },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/blog/[slug]/comments/[commentId] - Delete a comment (admin only)
export const DELETE = withAuth<RouteParams>(
  async (req: NextRequest, context: AuthenticatedContext<RouteParams>) => {
    try {
      await dbConnect();

      const { slug, commentId } = context.params;

      // Find the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }

      // Verify comment belongs to this post
      if (comment.postSlug !== slug) {
        return NextResponse.json(
          { error: "Comment does not belong to this post" },
          { status: 400 }
        );
      }

      const wasApproved = comment.status === "approved";

      // Delete the comment (replies will be orphaned but can be handled separately)
      await Comment.findByIdAndDelete(commentId);

      // Also delete all replies to this comment
      await Comment.deleteMany({ parentId: commentId });

      // Update post comment count if comment was approved
      if (wasApproved) {
        const replyCount = await Comment.countDocuments({ parentId: commentId, status: "approved" });
        await Post.findOneAndUpdate(
          { slug },
          { $inc: { commentCount: -(1 + replyCount) } }
        );
      }

      return NextResponse.json(
        { message: "Comment deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
      return NextResponse.json(
        { error: "Internal Server Error: Could not delete comment." },
        { status: 500 }
      );
    }
  }
);
