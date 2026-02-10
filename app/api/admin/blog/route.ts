import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import { generateSlug, calculateReadingTime, generateExcerpt } from "@/app/lib/blog-types";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

// Wrap the GET handler with withAuth
export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is fetching all admin posts.`);
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status"); // draft, published, or all
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build query
    const query: any = {};
    if (status === "draft") {
      query.isPublished = false;
    } else if (status === "published") {
      query.isPublished = true;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch admin posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch posts." },
      { status: 500 },
    );
  }
});

// Wrap the POST handler with withAuth
export const POST = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is creating a new post.`);
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content are required." },
        { status: 400 },
      );
    }
    const slug = body.slug || generateSlug(body.title);

    await dbConnect();

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        {
          error:
            "A post with this slug already exists. Please choose a different title.",
        },
        { status: 409 },
      );
    }

    // Auto-generate excerpt if not provided
    const excerpt = body.excerpt || generateExcerpt(body.content);

    // Auto-calculate reading time if not provided
    const readingTime = body.readingTime || calculateReadingTime(body.content);

    const newPost = await Post.create({
      title: body.title,
      slug: slug,
      content: body.content,
      excerpt,
      authorId: user.id,
      authorName: user.name || user.email,
      authorBio: body.authorBio,
      authorAvatar: body.authorAvatar,
      imageUrl: body.imageUrl || null,
      featuredImage: body.featuredImage || null,
      category: body.category || "general",
      tags: body.tags || [],
      readingTime,
      isPublished: body.isPublished || false,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to create post." },
      { status: 500 },
    );
  }
});
