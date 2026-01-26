import { Post } from "@/app/lib/blog-types";
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const postRef = adminDb.collection("posts").where("slug", "==", slug);
    const querySnapshot = await postRef.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postDoc = querySnapshot.docs[0];
    const post = postDoc.data() as Post;

    if (!post.isPublished) {
      return NextResponse.json(
        { error: "Post is not published" },
        { status: 403 },
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch post with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error: could not fetch post." },
      { status: 500 },
    );
  }
}
