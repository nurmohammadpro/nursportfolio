import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import { generateSlug } from "@/app/lib/blog-types";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

// Wrap the GET handler with withAuth
export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is fetching all admin posts.`);
  try {
    await dbConnect();
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(posts, { status: 200 });
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
    const slug = generateSlug(body.title);
    
    await dbConnect();

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        {
          error:
            "A post with this title already exists. Please choose a different title.",
        },
        { status: 409 },
      );
    }

    const newPost = await Post.create({
      title: body.title,
      slug: slug,
      content: body.content,
      authorId: user.id,
      authorName: user.name || user.email,
      imageUrl: body.imageUrl || null,
      isPublished: body.isPublished || false,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    // ... error handling remains the same
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to create post." },
      { status: 500 },
    );
  }
});
