import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

//Creating a blog post
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPost = {
      ...body,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      isPublished: body.isPublished || false,
    };

    const res = await adminDb.collection("posts").add(newPost);

    return NextResponse.json({ id: res.id, ...newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
