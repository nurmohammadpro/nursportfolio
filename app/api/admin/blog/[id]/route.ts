import { generateSlug, Post } from "@/app/lib/blog-types";
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const postRef = adminDb.collection("posts").doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const currentPost = postDoc.data() as Post;
    let newSlug = currentPost.slug;

    //When title is being updated, we need to check for slug uniqueness
    if (body.title && body.title !== currentPost.title) {
      newSlug = generateSlug(body.title);
      const existingPost = await adminDb
        .collection("posts")
        .where("slug", "==", newSlug)
        .get();

      if (!existingPost.empty && existingPost.docs[0].id !== id) {
        return NextResponse.json(
          { error: "A post with this title already exists" },
          { status: 409 },
        );
      }
    }

    const updateData = {
      ...body,
      slug: newSlug,
      updatedAt: new Date().toISOString(),
    };

    await postRef.update(updateData);

    //Fetching and returning the updated post
    const updatedPostDoc = await postRef.get();
    const updatedPost = updatedPostDoc.data() as Post;

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(`Failed to update post with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error: could not update post." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const postRef = adminDb.collection("posts").doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await postRef.delete();

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to delete post with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error: could not delete post." },
      { status: 500 },
    );
  }
}
