import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

export const dynamic = "force-dynamic";

// GET /api/blog/tags - Fetch all tags with post counts
export async function GET() {
  try {
    await dbConnect();

    // Get all tags with their post counts
    const tagsWithCounts = await Post.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    const tags = tagsWithCounts.map((tag: any) => ({
      id: tag._id,
      name: tag._id,
      slug: tag._id.toLowerCase().replace(/\s+/g, "-"),
      postCount: tag.count,
    }));

    return NextResponse.json({ data: tags }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch tags." },
      { status: 500 }
    );
  }
}
