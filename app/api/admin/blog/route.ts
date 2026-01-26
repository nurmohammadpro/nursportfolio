import { generateSlug, Post } from "@/app/lib/blog-types";
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

const PLACEHOLDER_AUTHOR_ID = "placeholder-author-id";

//Creating a blog post
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const slug = generateSlug(body.title);

    const existingPost = await adminDb
      .collection("posts")
      .where("slug", "==", slug)
      .get();
    if (!existingPost.empty) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 409 },
      );
    }

    const newPostRef = adminDb.collection("posts").doc();
    const newPostData: Omit<Post, "id"> = {
      title: body.title,
      slug: slug,
      content: body.content,
      authorId: PLACEHOLDER_AUTHOR_ID,
      authorName: body.authorName || "Admin",
      imageUrl: body.imageUrl || null,
      isPublished: body.isPublished || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    };

    await newPostRef.set({ id: newPostRef.id, ...newPostData });

    return NextResponse.json(
      { id: newPostRef.id, ...newPostData },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
