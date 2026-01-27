import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@/app/lib/blog-types";
import { withAuth } from "@/app/lib/auth-middleware";
import { generateSlug } from "@/app/lib/blog-types";

// Wrap the GET handler with withAuth
export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is fetching all admin posts.`);
  try {
    const postsQuery = adminDb
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(50);

    const querySnapshot = await postsQuery.get();
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as Post);
    });

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
    const existingPost = await adminDb
      .collection("posts")
      .where("slug", "==", slug)
      .get();
    if (!existingPost.empty) {
      return NextResponse.json(
        {
          error:
            "A post with this title already exists. Please choose a different title.",
        },
        { status: 409 },
      );
    }
    const newPostRef = adminDb.collection("posts").doc();
    const newPostData: Omit<Post, "id"> = {
      title: body.title,
      slug: slug,
      content: body.content,
      authorId: user.uid,
      authorName: user.name || user.email,
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
    // ... error handling remains the same
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to create post." },
      { status: 500 },
    );
  }
});
