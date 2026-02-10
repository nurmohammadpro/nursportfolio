import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Comment from "@/app/models/Comment";
import Post from "@/app/models/Post";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";

export const dynamic = "force-dynamic";

// GET /api/blog/[slug]/comments - Fetch approved comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Verify post exists
    const post = await Post.findOne({ slug, isPublished: true });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await Comment.find({
      postSlug: slug,
      status: "approved",
      parentId: null, // Only top-level comments
    })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await Comment.find({
          parentId: comment._id.toString(),
          status: "approved",
        })
          .sort({ createdAt: 1 })
          .lean();

        return {
          ...comment,
          id: comment._id.toString(),
          _id: undefined,
          replies: replies.map((r: any) => ({
            ...r,
            id: r._id.toString(),
            _id: undefined,
          })),
        };
      })
    );

    return NextResponse.json({ data: commentsWithReplies }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch comments." },
      { status: 500 }
    );
  }
}

// POST /api/blog/[slug]/comments - Create a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const body = await req.json();

    // Validate required fields
    if (!body.authorName || !body.authorEmail || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: authorName, authorEmail, and content are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.authorEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await Post.findOne({ slug, isPublished: true });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if this is a reply
    let parentId = null;
    if (body.parentId) {
      const parentComment = await Comment.findById(body.parentId);
      if (!parentComment || parentComment.postSlug !== slug) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
      parentId = body.parentId;
    }

    // Get client info for spam protection
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Create comment
    const newComment = await Comment.create({
      postSlug: slug,
      postId: post._id.toString(),
      authorName: body.authorName.trim(),
      authorEmail: body.authorEmail.trim().toLowerCase(),
      authorUrl: body.authorUrl?.trim() || undefined,
      content: body.content.trim(),
      parentId,
      status: "pending", // Requires moderation
      ipAddress,
      userAgent,
    });

    // Update post comment count (will be updated when approved)
    // Don't increment yet since comment is pending

    const formattedComment = {
      ...newComment.toObject(),
      id: newComment._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(
      { data: formattedComment, message: "Comment submitted for moderation" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not create comment." },
      { status: 500 }
    );
  }
}
