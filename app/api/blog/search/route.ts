import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

export const dynamic = "force-dynamic";

// GET /api/blog/search - Search published blog posts
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const limit = parseInt(searchParams.get("limit") || "20");

    const posts = await Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { excerpt: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    })
      .select("title slug excerpt category tags featuredImage readingTime createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const formattedPosts = posts.map((post: any) => ({
      ...post,
      id: post._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({ data: formattedPosts, count: formattedPosts.length }, { status: 200 });
  } catch (error) {
    console.error("Failed to search blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Search failed." },
      { status: 500 }
    );
  }
}
