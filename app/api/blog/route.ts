import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";
import { BlogFilters, PaginatedResponse, BlogPost } from "@/app/lib/blog-types";

export const dynamic = "force-dynamic";

// GET /api/blog - Fetch published blog posts with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const featured = searchParams.get("featured") === "true";

    // Build query
    const query: any = {
      isPublished: true,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (featured) {
      query.featuredImage = { $exists: true, $ne: null, $nin: ["", null] };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [posts, total] = await Promise.all([
      Post.find(query)
        .select("-content") // Exclude content for listing
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Format response
    const formattedPosts: BlogPost[] = posts.map((post: any) => ({
      ...post,
      id: post._id.toString(),
      _id: undefined,
    }));

    const response: PaginatedResponse<BlogPost> = {
      data: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch posts." },
      { status: 500 }
    );
  }
}
