import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

export const dynamic = "force-dynamic";

// GET /api/blog/[slug] - Fetch a single published post by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const post = await Post.findOne({ slug, isPublished: true }).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Handle lean() result which could be array or single object
    const postData = Array.isArray(post) ? post[0] : post;
    const postId = (postData as any)._id;

    // Increment view count
    await Post.findByIdAndUpdate(postId, {
      $inc: { viewCount: 1 },
    });

    // Format response
    const formattedPost = {
      ...postData,
      id: postId.toString(),
      _id: undefined,
    };

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch post." },
      { status: 500 }
    );
  }
}
