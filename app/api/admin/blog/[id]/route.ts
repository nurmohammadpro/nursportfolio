import { NextResponse, NextRequest } from "next/server";
import { generateSlug } from "@/app/lib/blog-types";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

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

      await dbConnect();

      const currentPost = await Post.findById(id);
      if (!currentPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      let newSlug = currentPost.slug;
      if (body.title && body.title !== currentPost.title) {
        newSlug = generateSlug(body.title);
        const conflictingPost = await Post.findOne({ slug: newSlug });
        if (conflictingPost && conflictingPost._id.toString() !== id) {
          return NextResponse.json(
            { error: "A post with this new title already exists." },
            { status: 409 },
          );
        }
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { ...body, slug: newSlug },
        { new: true }
      );

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

      await dbConnect();

      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

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
