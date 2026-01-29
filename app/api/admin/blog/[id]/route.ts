//app/api/admin/blog/[id]/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import { Post, generateSlug } from "@/app/lib/blog-types";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware"; // Import the new types

type RouteParams = {
  id: string;
};

export const PUT = withAuth<RouteParams>(
  async (req: NextRequest, context: AuthenticatedContext<RouteParams>) => {
    console.log(
      `Authenticated user: ${context.user.email} is updating post: ${context.params.id}.`,
    );

    const { id } = context.params;

    try {
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
      if (body.title && body.title !== currentPost.title) {
        newSlug = generateSlug(body.title);
        const conflictingPost = await adminDb
          .collection("posts")
          .where("slug", "==", newSlug)
          .get();
        if (!conflictingPost.empty && conflictingPost.docs[0].id !== id) {
          return NextResponse.json(
            { error: "A post with this new title already exists." },
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
      const updatedPostDoc = await postRef.get();
      const updatedPost = updatedPostDoc.data() as Post;
      return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
      console.error(`Failed to update post with id:`, id, error);
      return NextResponse.json(
        { error: "Internal Server Error: Could not update post." },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAuth<RouteParams>(
  async (req: NextRequest, context: AuthenticatedContext<RouteParams>) => {
    console.log(
      `Authenticated user: ${context.user.email} is deleting post: ${context.params.id}.`,
    );

    const { id } = context.params;

    try {
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
      console.error(`Failed to delete post with id:`, id, error);
      return NextResponse.json(
        { error: "Internal Server Error: Could not delete post." },
        { status: 500 },
      );
    }
  },
);
